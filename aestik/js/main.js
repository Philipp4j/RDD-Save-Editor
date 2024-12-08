// Author: lilyu_
// https://lilyu.xyz
// License and source code: https://github.com/Philipp4j/Aestik-Save-Editor

// CONFIG
var server = "https://lilyu.xyz:3000";

var lastFileName = "";
document.getElementById("res").value = "";

function xorFile(mode, file) {
    var reader = new FileReader();
    var endpoint = mode === 0 ? server+'/decrypt' : server+'/encrypt';

    reader.onload = function(e) {
        lastFileName = file.name.split('.').slice(0, -1).join('.');
        var data = new Uint8Array(e.target.result);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var textArea = document.getElementById('res');
                textArea.value = formatJSON(response.data);
            }
        };
        xhr.send(JSON.stringify({data: Array.from(data)}));
    }
    try {
        reader.readAsArrayBuffer(file);
    } catch (e) {
        alert("No file selected. Drag and drop a file or click the upload button.");
    }
}

function formatJSON(jsonString) {
    try {
        var jsonObj = JSON.parse(jsonString);
        return JSON.stringify(jsonObj, null, 4);
    } catch (e) {
        console.error("Invalid JSON string", e);
        return jsonString;
    }
}

function minifyJSON(jsonString) {
    try {
        var jsonObj = JSON.parse(jsonString);
        return JSON.stringify(jsonObj);
    } catch (e) {
        console.error("Invalid JSON string", e);
        return jsonString; 
    }
}

function decryptFile() {
    var file = document.getElementById('file').files[0];
    xorFile(0, file);
}

function encryptFile() {
    var textArea = document.getElementById('res');
    var content = minifyJSON(textArea.value);
    var blob = new Blob([content], {type: 'application/json'});
    var reader = new FileReader();
    var endpoint = server+'/encrypt';

    reader.onload = function(e) {
        var data = new Uint8Array(e.target.result);
        var xhr = new XMLHttpRequest();
        xhr.open('POST', endpoint, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                var response = JSON.parse(xhr.responseText);
                var blob = new Blob([new Uint8Array(response.data)], {type: 'application/octet-stream'});
                var url = window.URL.createObjectURL(blob);
                var a = document.createElement('a');
                a.href = url;
                a.download = lastFileName + '.json';
                a.click();
                window.URL.revokeObjectURL(url);
            }
        };
        xhr.send(JSON.stringify({data: Array.from(data)}));
    }
    reader.readAsArrayBuffer(blob);
}

function helpScreen() {
    var help = document.getElementById('help-screen');
    help.style.display = help.style.display === 'block' ? 'none' : 'block';
    var res = document.getElementById('res');
    res.style.display = res.style.display === 'none' ? 'block' : 'none';
}

document.querySelector('.custom-file-upload').addEventListener('click', function() {
    document.getElementById('file').click();
});

document.getElementById("load").addEventListener("click", decryptFile);
document.getElementById("save").addEventListener("click", encryptFile);
document.getElementById("help").addEventListener("click", helpScreen);

document.addEventListener('dragover', function(event) {
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.add('dragging');
});

document.addEventListener('dragleave', function(event) {
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.remove('dragging');
});

document.addEventListener('drop', function(event) {
    event.preventDefault();
    event.stopPropagation();
    document.body.classList.remove('dragging');
    var file = event.dataTransfer.files[0];
    if (file) {
        xorFile(0, file);
    }
});