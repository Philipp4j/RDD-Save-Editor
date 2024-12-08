# Simple backend for Aestik save file encryption/decryption
# Check the readme for more info
# Author: lilyu_
# https://lilyu.xyz
# Date: 07/12/2024 (dd/mm/yyyy)


# NOTES
#
# PUT cert.pem AND privkey.pem IN THE SAME DIRECTORY AS THIS FILE. Modern browsers will NOT work if its only http, that was annoying to figure out ngl
# FILL OUT THE CONFIG SECTION BELOW BEFORE RUNNING THIS SCRIPT, OTHERWISE IT WILL NOT WORK
#
# Run this script by running `python3 aestikserver.py` or `python aestikserver` in a terminal that will stay open, you can use tmux for example
# How to: `tmux`, then cd to this dictionary, then `python3 aestikserver.py`, then press `Ctrl+B` then `D`.
# 
# Also, yes I am aware that this is jank as hell, but I made this entire thing + frontend in 2 hours so if you dont like it, make your own 

from http.server import BaseHTTPRequestHandler, HTTPServer
import ssl
import json

# CONFIG
cors_origin = 'https://lilyu.xyz' # Change this to your domain, otherwise CORS will break the entire thing
xorkey = "47373992"               # Change this to the current Aestik decryption key, no clue if that will ever change but it's here just in case
server_port = 3000                # Change this to the port you want the server to run on, if you change it CHANGE IT IN THE FRONTEND TOO

class AestikHandler(BaseHTTPRequestHandler):
    def xor_encrypt(self, data, keyword):
        encrypted_data = bytearray()
        key_len = len(keyword)
        key_index = 0

        for char in data:
            encrypted_byte = char ^ ord(keyword[key_index % key_len])
            encrypted_data.append(encrypted_byte)
            key_index += 1

        return encrypted_data

    def xor_decrypt(self, data, keyword):
        decrypted_data = bytearray()
        key_len = len(keyword)
        key_index = 0

        for char in data:
            decrypted_byte = char ^ ord(keyword[key_index % key_len])
            decrypted_data.append(decrypted_byte)
            key_index += 1

        return decrypted_data

    def send_cors_headers(self):
        self.send_header('Access-Control-Allow-Origin', cors_origin)
        self.send_header('Access-Control-Allow-Methods', 'POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'Content-Type')

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_cors_headers()
        self.end_headers()

    def do_POST(self):
        try:
            if self.path in ['/encrypt', '/decrypt']:
                content_length = int(self.headers.get('Content-Length', 0))
                post_data = self.rfile.read(content_length)
                post_json = json.loads(post_data)
                
                if 'data' not in post_json:
                    raise ValueError("Missing 'data' field in request.")
                
                data = post_json['data']
                if self.path == '/encrypt':
                    decrypted_data = bytearray(data)
                    encrypted_data = self.xor_encrypt(decrypted_data, xorkey)
                    response_data = {
                        'data': list(encrypted_data),
                        'filename': 'encrypted.json'
                    }
                elif self.path == '/decrypt':
                    encrypted_data = bytearray(data)
                    decrypted_data = self.xor_decrypt(encrypted_data, xorkey)
                    response_data = {
                        'data': decrypted_data.decode('utf-8'),
                        'filename': 'decrypted.json'
                    }

                self.send_response(200)
                self.send_header('Content-Type', 'application/json')
                self.send_cors_headers()
                self.end_headers()
                self.wfile.write(json.dumps(response_data).encode('utf-8'))

            else:
                self.send_response(404)
                self.end_headers()
        except ValueError as e:
            self.send_response(400)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            error_response = {'error': str(e)}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))
        except Exception as e:
            self.send_response(500)
            self.send_header('Content-Type', 'application/json')
            self.send_cors_headers()
            self.end_headers()
            error_response = {'error': 'Internal server error'}
            self.wfile.write(json.dumps(error_response).encode('utf-8'))

def run(server_class=HTTPServer, handler_class=AestikHandler, port=3000, certfile='cert.pem', keyfile='privkey.pem'):
    server_address = ('', port)
    httpd = server_class(server_address, handler_class)
    httpd.socket = ssl.wrap_socket(httpd.socket, certfile=certfile, keyfile=keyfile, server_side=True)
    print(f"Starting HTTPS server on port {port}...")
    httpd.serve_forever()

if __name__ == "__main__":
    run(server_port)
