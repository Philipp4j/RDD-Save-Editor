// Author: lilyu_
// https://lilyu.xyz
// License and source code: https://github.com/Philipp4j/Aestik-Save-Editor
// Date: 2024/12/28 (YYYY/MM/DD)

// CONFIG
const key = "qpsodifguhjrkelx";
let lastFileName = "";
document.getElementById("res").value = "";

async function sendToAesEcb(mode, key, data) {
    try {
        const formData = new URLSearchParams();
        formData.append('mode', mode);
        formData.append('key', key);
        formData.append('data', data);
        const response = await fetch('./aesecb.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: formData.toString(),
        });
        if (!response.ok) {
            throw new Error(`Server error: ${response.status}`);
        }
        const result = await response.text();
        return result;
    } catch (error) {
        console.error("Error communicating with ./aesecb.php:", error);
        alert("An error occurred while processing the file. Please try again.");
        throw error;
    }
}

async function decryptSave() {
    const file = document.getElementById('file').files[0];
    if (file) {
        lastFileName = file.name;
        try {
            const fileData = await file.text();
            const decryptedData = await sendToAesEcb("decrypt", key, fileData);
            document.getElementById("res").value = decryptedData;
        } catch (error) {
            console.error("Error decrypting file:", error);
            alert("Failed to decrypt the file. Please ensure it is a valid encrypted file.");
        }
    }
}

async function encryptSave() {
    const textareaContent = document.getElementById('res').value;
    try {
        const encryptedData = await sendToAesEcb("encrypt", key, textareaContent);
        const blob = new Blob([encryptedData], { type: "application/octet-stream" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = lastFileName;
        a.click();
        URL.revokeObjectURL(url);
    } catch (error) {
        console.error("Error encrypting file:", error);
        alert("Failed to encrypt the file. Please try again.");
    }
}

function toggleHelpScreen() {
    const help = document.getElementById('help-screen');
    help.style.display = help.style.display === 'block' ? 'none' : 'block';
    const res = document.getElementById('res');
    res.style.display = res.style.display === 'none' ? 'block' : 'none';
}

function preventDrag(event) {
    event.preventDefault();
    event.stopPropagation();
}

document.getElementById("file").addEventListener("change", decryptSave);
document.getElementById("load").addEventListener("click", () => {
    document.getElementById('file').click();
});
document.getElementById("save").addEventListener("click", encryptSave);
document.getElementById("help").addEventListener("click", toggleHelpScreen);

document.addEventListener('dragover', preventDrag);
document.addEventListener('dragleave', preventDrag);
document.addEventListener('drop', async (event) => {
    preventDrag(event);
    const file = event.dataTransfer.files[0];
    if (file) {
        lastFileName = file.name;
        try {
            const fileData = await file.text();
            const decryptedData = await sendToAesEcb("decrypt", key, fileData);
            document.getElementById("res").value = decryptedData;
        } catch (error) {
            console.error("Error decrypting file:", error);
            alert("Failed to decrypt the file. Please ensure it is a valid save.");
        }
    }
});

console.info("Roulette Dungeon Demo loaded successfully");