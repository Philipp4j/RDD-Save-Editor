# Aestik Save File Editor

>Aestik Save File Editor is a tool for encrypting and decrypting save files for the game Aestik. This project includes a fully browser based implementation of the save file editor.

## Features

- **Encrypt/Decrypt Save Files**: Easily encrypt and decrypt your Aestik save files.
- **Edit Save Data**: Modify your save data directly in the browser.
- **Secure**: All encryption and decryption is done locally in the browser. Your save file is never sent to or stored anywhere else.
- **Drag and Drop**: Supports drag and drop for file uploads.

## Live Demo

You can try out the Aestik Save File Editor at [https://lilyu.xyz/aestik](https://lilyu.xyz/aestik). Please note that this is a live demo and may not always be available.

## Setup Instructions

>The setup instructions assume you have a domain name and a linux server to run this project. Running this project on a local machine is also possible, but the instructions will not cover that.

### Prerequisites

- **Web Server**: You will need a web server to host the save file editor. Apache2 is recommended, but other web servers should work as well. 

### Setup

>This step varies depending on your currently used web server. Here is an example for apache2:

1. **Move the files**:
    Move the `aestik` folder into your web server's root directory. For apache2, this is usually `/var/www/html/`, meaning the `aestik` folder should be located at `/var/www/html/aestik`.

2. **Configure the Server**:
    Edit the `aestik/js/main.js` file to set the current encryption key.
    ```javascript
    const key = "47373992";
    ```
> [!NOTE]
> Only change the key if it has been changed by the developers of Aestik in any update. Otherwise, do not change the key.

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


> [!TIP]  
> To find the old server-based version of this project, please refer to the `archive-server` branch.
> It is not recommended to use, as it is worse in just about every way compared to the new version.
