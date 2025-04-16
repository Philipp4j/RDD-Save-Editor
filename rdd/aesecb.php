<?php

$mode = $_POST['mode'];
$key = $_POST['key'];
$data = $_POST['data'];

if ($mode == 'encrypt') {
    $encrypted = encrypt($data, $key);
    echo $encrypted;
} elseif ($mode == 'decrypt') {
    $decrypted = decrypt($data, $key);
    echo $decrypted;
} else {
    echo "Invalid mode";
}
function encrypt(string $plainText, string $key): string
{
    $key = mb_substr($key, 0, 32, '8bit');
    
    $options = OPENSSL_RAW_DATA;

    $encrypted = openssl_encrypt($plainText, "AES-128-ECB", $key, $options);

    return base64_encode($encrypted);
}

function decrypt(string $encryptedText, string $key): string
{
    $key = mb_substr($key, 0, 32, '8bit');
    
    $options = OPENSSL_RAW_DATA;

    $cipherText = base64_decode($encryptedText);

    $decrypted = openssl_decrypt($cipherText, "AES-128-ECB", $key, $options);

    return $decrypted !== false ? $decrypted : '';
}
