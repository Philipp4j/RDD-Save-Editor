// Author: lilyu_
// https://lilyu.xyz
// License and source code: https://github.com/Philipp4j/Aestik-Save-Editor
// Date: 2024/12/28 (YYYY/MM/DD)

// CONFIG
const key = "47373992";
let lastFileName = "";
document.getElementById("res").value = "";

function xorProcess(data, keyword) {
    const processedData = [];
    const keyLen = keyword.length;

    for (let i = 0; i < data.length; i++) {
        processedData.push(data[i] ^ keyword.charCodeAt(i % keyLen));
    }

    return processedData;
}

function xorFile(encrypt, file) {
    const reader = new FileReader();
    reader.onload = function() {
        const data = new Uint8Array(reader.result);
        const result = encrypt 
            ? xorProcess(data, key) 
            : xorProcess(data, key);

        if (encrypt) {
            const blob = new Blob([new Uint8Array(result)], { type: "application/octet-stream" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = lastFileName;
            a.click();
            URL.revokeObjectURL(url);
        } else {
            document.getElementById("res").value = formatJSON(String.fromCharCode(...result));
        }
    };
    reader.readAsArrayBuffer(file);
}

function formatJSON(jsonString) {
    try {
        const jsonObj = JSON.parse(jsonString);
        return JSON.stringify(jsonObj, null, 4);
    } catch (e) {
        console.error("Invalid JSON string", e);
        return jsonString;
    }
}

function minifyJSON(jsonString) {
    try {
        const jsonObj = JSON.parse(jsonString);
        return JSON.stringify(jsonObj);
    } catch (e) {
        console.error("Invalid JSON string", e);
        return jsonString;
    }
}

function decryptSave() {
    const file = document.getElementById('file').files[0];
    if (file) {
        lastFileName = file.name;
        xorFile(0, file);
    }
}

function encryptSave() {
    const textareaContent = document.getElementById('res').value;
    const minifiedContent = minifyJSON(textareaContent);
    const encryptedContent = xorProcess(new TextEncoder().encode(minifiedContent), key);
    const blob = new Blob([new Uint8Array(encryptedContent)], { type: "application/octet-stream" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = lastFileName;
    a.click();
    URL.revokeObjectURL(url);
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
document.addEventListener('drop', (event) => {
    preventDrag(event);
    const file = event.dataTransfer.files[0];
    if (file) {
        lastFileName = file.name;
        xorFile(0, file);
    }
});

console.info("Aestik Save Editor loaded successfully");
