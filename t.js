
const Mnemonic = require('bitcore-mnemonic');
const aesjs = require('aes-js');

var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];
 
var code = new Mnemonic(Mnemonic.Words.ENGLISH);
var text = code.toString(); 
var textBytes = aesjs.utils.utf8.toBytes(text);
 
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var encryptedBytes = aesCtr.encrypt(textBytes);
 
var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
console.log(encryptedHex);
 
var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
 
var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(5));
var decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
console.log(decryptedText);
