# Aestik Save File Editor

> [!WARNING]  
> THIS IS A BACKUP OF THE OLD, WORSE VERSION WHICH IS BASED ON A PYTHON BACKEND!
> FOR THE IMPROVED VERSION, PLEASE SEE THE MAIN BRANCH OF THIS REPO.
> (However, this should still all work, its just worse in just about any way)

>Aestik Save File Editor is a tool for encrypting and decrypting save files for the game Aestik. This project includes a simple backend server and a frontend interface to make editing save files easy and secure.

## Features

- **Encrypt/Decrypt Save Files**: Easily encrypt and decrypt your Aestik save files.
- **Edit Save Data**: Modify your save data directly in the browser.
- **Secure**: Uses SSL for secure communication between the frontend and backend.
- **Drag and Drop**: Supports drag and drop for file uploads.

## Live Demo

You can try out the Aestik Save File Editor at [https://lilyu.xyz/aestik](https://lilyu.xyz/aestik). Please note that this is a live demo and may not always be available.

## Setup Instructions

>The setup instructions assume you have a domain name and a linux server to run this project.

### Prerequisites

- Python 3.x
- Certbot (for generating SSL certificates)
- A domain name (for SSL certificates)

### Backend Setup

1. **Clone the Repository**:
    ```sh
    git clone https://github.com/Philipp4j/Aestik-Save-Editor.git
    cd Aestik-Save-Editor
    ```

2. **Ensure python 3 is installed**:
    ```sh
    python3 --version
    ```
    If python 3 is not installed, install it through your package manager.

3. **Generate SSL Certificates**:
    Use Certbot to generate SSL certificates for your domain:
    ```sh
    sudo certbot certonly --standalone -d yourdomain.com
    ```
    This will generate the certificates in `/etc/letsencrypt/live/yourdomain.com/`.

4. **Move the Certificates**:
    Move the `cert.pem` and `privkey.pem` files to the same directory as the `aestikserver.py` file.

5. **Configure the Server**:
    Edit the aestikserver.py file to set your domain and port:
    ```python
    # CONFIG
    cors_origin = 'https://yourdomain.com'
    xorkey = "47373992"
    server_port = 3000
    ```

6. **Run the Server**:
    ```sh
    python3 aestikserver.py
    ```
    You can also use tmux to run the server in the background. This can be done by 
    ```sh
    tmux new -s aestik
    cd /path/to/Aestik-Save-Editor
    python3 aestikserver.py
    ```
    To detach from the tmux session, press `Ctrl + B` and then `D`.
    To reattach to the tmux session, run `tmux attach -t aestik`.

### Frontend Setup

>This step varies depending on your currently used web server. Here is an example for apache2:

1. **Move the files**:
    Move the `aestik` folder into your web server's root directory. For apache2, this is usually `/var/www/html/`, meaning the `aestik` folder should be located at `/var/www/html/aestik`.

2. **Configure the Server**:
    Edit the `aestik/js/main.js` file to set your domain and port:
    ```javascript
    const serverUrl = 'https://yourdomain.com:3000';
    ```
    Only change the port if you have changed the server port in the backend setup.

3. **Access the Site**:
    Open your browser and navigate to `https://yourdomain.com/aestik`. You should see the Aestik Save File Editor interface. 

## Usage

>Remember to always make a backup of your save files before editing them, as there is always a risk of data loss when editing save files.

1. **Upload a Save File**:
    Drag and drop your save file into the upload area, or click to select a file. Details about where to find the save file can be found by clicking the "How to use" button.

2. **Load the Save File**:
    Click the "Load" button to decrypt the save file. The decrypted data will be displayed in the editor.

3. **Edit the Save Data**:
    Modify the save data directly in the editor. Do not change the format or remove lines, as this may cause the save file to become corrupted.

4. **Export the edited Save File**:
    Click the "Save" button to re-encrypt the modified save file. The file should automatically download to your computer.

5. **Import the Save File**:
    Replace the original save file with the edited save file. Make sure to back up the original save file first. You can do that by appending `.bak` to the file name or moving it to a different location.

6. **Load the Save File in Aestik**:
    Open Aestik and load the save file to see the changes you made. If the game is already running, you may need to restart it for the changes to take effect.

## License

This project is licensed under the Aestik Save File Editor License. See the `LICENSE.MD` file for details.

## Author

Created by [lilyu_](https://lilyu.xyz). This project is not affiliated with Aestik or its developers in any way.
