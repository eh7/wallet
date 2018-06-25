var config      = require('./config'); 

var Promise = require('promise');
var fs = require('fs');
var crypto = require('crypto'),
    algorithm = 'aes-256-ctr',
    password = config.secret;

var keythereum = require('keythereum');
var solc = require('solc');
var Web3 = require('web3');
var Tx = require('ethereumjs-tx');
var QRCode = require('qrcode');

var bcrypt = require('bcrypt');
const saltRounds = 10;

//var web3 = new Web3(new Web3.providers.WebsocketProvider(config.web3_provider));
var web3 = new Web3(new Web3.providers.HttpProvider(config.web3_provider_http));

web3.eth.net.isListening().then(() => {
  console.log('web3 is connected');
}).catch(e => {
  console.log('web3!!!! Wow. Something went wrong');
  process.exit();
});


const express = require('express');
const session = require('express-session');
const app = express();
var bodyParser = require("body-parser");
var path        = require('path');
var morgan      = require('morgan');

const Mnemonic = require('bitcore-mnemonic');
const eth_wallet = require('ethereumjs-wallet')
const aesjs = require('aes-js');

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var myNKey;// = localStorage.getItem('myNKey');
var myCount = localStorage.getItem('myCount');


//var parseurl = require('parseurl');

const port = process.argv[2] || 9999;


if(myNKey == '') {
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  localStorage.setItem('myNKey', code);
  storeMnemonic(code);
  localStorage.setItem('myCount', 0);
}

// this was used to populate the key a i fields in my.json
//storeMnemonic(config.myNKey);

setupCode();
//console.log(myNKey);


app.set('superSecret', config.secret);

app.set('view engine', 'ejs');

app.use(morgan('dev'));

app.use(session({
  secret: config.secret,
  resave: false,
  saveUninitialized: true
}));


app.use('/assets', express.static(path.join(__dirname + '/assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(checkForWalletPassword);
app.use(checkAuthed);
//---------------------------------------------------------------------//

app.post('/wallet/auth', (req, res) => {

  var errors = [];

  var data = {
               "page_title":"Wallet Systems - Setup and Auth", 
             };

  if(req.body.passphrase != req.body.passphraseCheck) {
    errors.push("Passphrase and Passphrase Check did not match!");
    data.errors = errors;
    res.render('pages/auth', data);
  } else if(req.body.passphrase == "") {
    errors.push("Passphrase can not be empty!");
    data.errors = errors;
    res.render('pages/auth', data);
  } else {

    /* bcrypt and save passpharse */
    bcrypt.hash(req.body.passphrase, saltRounds, function(err, hash) {
      console.log(hash);

      req.session.authed = true;

      var file = config.my_json_file;
      fs.writeFile(file, JSON.stringify({hash:hash}), 'utf8', console.log(err)); 

      /* use this for now while testing */
//      errors.push("Passphrase Setup Completed");
//      data.errors = errors;
//      res.render('pages/auth', data);
    
      /* this line when live */
      res.redirect("/wallet");
    });
    
  }

//  console.log(req.body);
//  console.log(req.body.passphrase);
//  console.log(req.body.passphraseCheck);

});
//---------------------------------------------------------------------//

app.all('/wallet/user_services*', (req, res) => {

  var errors = [];

  var services = [
                   {name:'Verify My Data',url:'/wallet/user_services/varify'},
                   {name:'Validate User Address Hash',url:'/wallet/user_services/validate'},
                 ];

  if(req.url != "/wallet/user_services")
    services = [];

  var data = {
               "page_title":"Wallet Systems - User Services", 
               "errors":errors,
               "services":services,
             };

  res.render('pages/user_services', data);
});
//---------------------------------------------------------------------//

app.post('/wallet/login', (req, res) => {

  var errors = [];

  var data = {
               "page_title":"Wallet Systems - Login", 
               errors:errors,
             };

  res.render('pages/login', data);
});
//---------------------------------------------------------------------//

app.get('/wallet/login', (req, res) => {

  var errors = [];

  var data = {
               "page_title":"Wallet Systems - Login", 
               errors:errors,
             };

  res.render('pages/login', data);
});
//---------------------------------------------------------------------//

app.get('/wallet/auth', (req, res) => {

  var errors = [];

  var data = {
               "page_title":"Wallet Systems - Setup Authentication", 
               errors:errors,
             };

  res.render('pages/auth', data);
});
//---------------------------------------------------------------------//

app.get('/wallet/coms', (req, res) => {

  var coms = [
               'message',
               'voip',
               'video',
               'file share'];

  var data = {
               "page_title":"Wallet Systems - Coms", 
               "coms":coms,
             };

  res.render('pages/coms', data);
});
//---------------------------------------------------------------------//
app.get('/wallet/apps', (req, res) => {

  var apps = [
               {url:'/wallet/user_services',name:'User Services'},
               {url:'/wallet/decentralized_autonomous_organizations',name:'DAO (Decentralized Autonomous Organisation)'},
               {url:'/wallet/crowd_sale',name:'Crown Sale'},
               {url:'/wallet/games',name:'Crown Sale'},
               {url:'/wallet/products',name:'Content'},
               {url:'/wallet/products',name:'Products'},
               {url:'/wallet/services',name:'Services'},
               {url:'/wallet/tickets',name:'Tickets'}
             ];
  var data = {
               "page_title":"Wallet System - Wallet Apps", 
               "apps":apps,
             };
  res.render('pages/apps', data);
});
//---------------------------------------------------------------------//

app.get('/wallet/txs', (req, res) => {
  web3.eth.getTransactionCount(req.query.addr, function(err,nonce) {
    if(err)
      console.log(err);
    var data = {
                 page_title: "Wallet System - Transactions for "+req.query.addr,
                 address:req.query.addr,
                 count:nonce,
                 txs: [],
               };
    var txs = [];
    var file = "./eh7/" + req.query.addr + ".json";
    fs.readFile(file, 'utf8', function(err, fs_data){
      if(err)
        res.render('pages/txs', data);
      else {
        fs_data = JSON.parse(fs_data);
        for(i=0; i<fs_data.txs.length; i++) {
          data.txs.push({
                          'to':fs_data.txs[i].to,
                          'amount':web3.utils.fromWei(fs_data.txs[i].amount,'ether'),
                          'hash':fs_data.txs[i].hash,
                          'timestamp':fs_data.txs[i].timestamp,
                        });
        }
        res.render('pages/txs', data);
      }
    });
  });
});
//---------------------------------------------------------------------//

app.post('/wallet/send', (req, res) => {
  var address = req.body.addr;
  var balance = req.body.bal;
  var amount  = req.body.amount;
  var to      = req.body.addr_to;
  var acount   = req.body.acount;
  var data = {
    'page_title':'Wallet System - Send Tx Page',
    'addr':address,
    'bal':balance,
    'acount':acount,
  };

  if(!amount || !to) {
    var errors = [];
    if(!amount) errors.push("Enter 'Amount To'.");
    if(!to) errors.push("Enter 'To'.");
    data.errors = errors;
    res.render('pages/send', data);
  } else {

    console.log("send " + amount + " to " + to);
    console.log(acount);
    web3.eth.getGasPrice(function(err, gasPrice) {
      if(err)
        console.log(err);

      var gasPriceHex = web3.utils.toHex(gasPrice);
      var gasLimitHex = web3.utils.toHex(2000000);
//      var gasLimitHex = web3.utils.toHex(2000000 * 1.101);

      web3.eth.getTransactionCount(address, function(err,nonce) {
        if(err)
          console.log(err);
        var nonceHex = web3.utils.toHex(nonce);
        var transValue = web3.utils.toHex(web3.utils.toWei(amount));
        var thisTx = {
                       from: address,
                       to: to,
                       value: transValue,
                       nonce: nonceHex,
                       gasPrice: gasPriceHex,
                       gasLimit: gasLimitHex,
                     };
        console.log(thisTx);

        var code = new Mnemonic(myNKey);
//        var code = new Mnemonic(config.myNKey);
        var hdPrivateKey = code.toHDPrivateKey();
        var xpriv =  hdPrivateKey.xprivkey;
        var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
        var privateKey;
        if(acount == '') 
          privateKey = xpriv_pkey.getPrivateKey();
        else if(acount > -1) {
          var hdpk = hdPrivateKey.derive(44, true).derive(60,true).derive(0,true).derive(0).derive(Number(acount));
          var xpriv =  hdpk.xprivkey;
          var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
          privateKey = xpriv_pkey.getPrivateKey();
        } else {
          privateKey = xpriv_pkey.getPrivateKey();
        }
        var signedTx = new Tx(thisTx);
        signedTx.sign(privateKey);
//console.log(privateKey.toString('hex'));
        var serializedTx = signedTx.serialize();
        web3.eth.sendSignedTransaction("0x" + serializedTx.toString('hex'), function(err,hash){
//console.log(err);
//process.exit();
          var errors = [];
          if(err) {
            console.log(err);
            errors.push(err);
            data.errors = errors;
            res.render('pages/send', data);
          } else {
            errors.push(hash);
            
            var file = "./eh7/" + address + ".json";
            fs.readFile(file, 'utf8', function(err, data){
              if (err){
                  console.log(err);
                  var object = {'address':address,'txs':[]};
                  object.txs.push({'to':to,'amount':web3.utils.toWei(amount),'hash':hash,"timestamp":''});
                  var json = JSON.stringify(object);
                  fs.writeFile(file, json, 'utf8', console.log(err)); 
              } else {
                var object = JSON.parse(data); 
                object.txs.push({'to':to,'amount':web3.utils.toWei(amount),'hash':hash,"timestamp":''});
                var json = JSON.stringify(object); 
                fs.writeFile(file, json, 'utf8', console.log(err)); 
            }});
            console.log(file);
  
            data.errors = errors;
            data.txhash = hash;
            data.address = hash;
            res.render('pages/sending', data);
          }
        });
      });
    });
  }
});
//---------------------------------------------------------------------//

app.get('/wallet/send', (req, res) => {
  var addr   = req.query.addr || req.body.addr;
  var bal    = req.query.bal  || req.body.bal;
  var acount = req.query.acount  || req.body.acount;

  var data = {
    'page_title':'Wallet System - Send Tx Page',
    'addr':addr,
    'txhash':'',
    'acount':acount,
    'bal':bal
  };

console.log(data);
  if(req.query.action === "sending"){
    console.log(data);
    data.txhash = req.query.txhash;
    web3.eth.getTransaction(req.query.txhash).then(function(txHash){
      console.log(txHash);
      if(txHash.blockNumber > 0) {
        res.redirect(301, '/wallet?action=done&txhash=' + req.query.txhash)
      } else
        res.render('pages/sending', data);
    });
  } else
    res.render('pages/send', data);
});
//---------------------------------------------------------------------//

app.get('/wallet', (req, res) => {


  var myRootAddr;
  var myRootPKey;
  var keys = [];

//console.log(1234567);
//QRCode.toDataURL('I am a pony!', function (err, url) {
// console.log("hhhh" + url)
//})

  var code = new Mnemonic(myNKey);
//  var code = new Mnemonic(config.myNKey);
  var hdPrivateKey = code.toHDPrivateKey();
  var xpriv =  hdPrivateKey.xprivkey;
  var xpub  =  hdPrivateKey.xpubkey;
  var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
  myRootAddr = xpriv_pkey.getAddress().toString('hex');
  myRootPKey = xpriv_pkey.getPrivateKey().toString('hex');

  console.log("Pri: " + xpriv_pkey.getPrivateKey().toString('hex'));
/*
  console.log("Addr: " + xpriv_pkey.getAddress().toString('hex'));
  console.log("Pri: " + xpriv_pkey.getPrivateKey().toString('hex'));
  console.log("Pub: " + xpriv_pkey.getPublicKey().toString('hex'));
  console.log("xPub: " + xpub);
  //console.log(xpriv_pkey);
*/
  if(req.query.count > -1) {
    myCount = req.query.count;
    localStorage.setItem('myCount', myCount);
  } else if(req.query.add == 'true') {
    if(myCount < 10)
      myCount++;
    localStorage.setItem('myCount', myCount);
  } else if(req.query.del == 'true') {
    if(myCount > 0)
      myCount--;
    localStorage.setItem('myCount', myCount);
  }

//console.log('myCount = ' + localStorage.getItem('myCount') + req.query.add);

  var count = myCount;
  var promise = [];
  var promiseQRCode = [];

  for(var i=0; i<count; i++) {
    var hdpk = hdPrivateKey.derive(44, true).derive(60,true).derive(0,true).derive(0).derive(i);
//    var path = "m/44'/60'/0'/0/" + i;
//    var hdpk = hdPrivateKey.derive(path);
    var address = hdpk.privateKey.toAddress().toString('hex');
    var pkey = hdpk.privateKey.toString('hex');
    var pubkey = hdpk.publicKey.toString('hex');

    var xpriv =  hdpk.xprivkey;
    var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
//    console.log("\n" + i);
//    console.log("Pub:  " + xpriv_pkey.getPublicKey().toString('hex'));
//    console.log("Pri:  " + xpriv_pkey.getPrivateKey().toString('hex'));
//    console.log("Addr: " + xpriv_pkey.getAddress().toString('hex'));
    keys.push({  
                 count:i,
                 address:web3.utils.toChecksumAddress(xpriv_pkey.getAddress().toString('hex')),
                 qrcode:'',
                 pubkey:xpriv_pkey.getPublicKey().toString('hex'),
                 prikey:xpriv_pkey.getPrivateKey().toString('hex'),
              });
    var this_address = xpriv_pkey.getAddress().toString('hex');
//console.log(this_address + " :: " + "\n");
    promise.push(getBalance(this_address));
    promiseQRCode.push(getQRCode("0x"+this_address));
  }

//  res.send('Wallet Page');

  var this_balance = 0;

  var this_address = myRootAddr;

  promise.push(getBalance(this_address));
  promiseQRCode.push(getQRCode("0x"+this_address));

  Promise.all(promise)
  .then(results => {

  Promise.all(promiseQRCode)
  .then(resultsQRCodes => {

//console.log(resultsQRCodes);

    var data = {
      'page_title':"Wallet System - Wallet",
      'address':web3.utils.toChecksumAddress(myRootAddr),
      'pkey':myRootPKey,
      'phrase':myNKey,
      'keys':keys,
      'balance':'this_balance',
      'qrcode':'',
    };

    for(var i=0; i<results.length; i++) {
      var tmp = results.length-1;
      if(i == (results.length-1)) {
//        console.log(results.length-1);
        data.balance = results[i];
        data.qrcode  = resultsQRCodes[i];
      } else {
        keys[i].balance = results[i];
        keys[i].qrcode  = resultsQRCodes[i];
      }
    }
 //   console.log(results);

    var done_txhash = [];
    if(req.query.action == 'done'){
      web3.eth.getTransaction(req.query.txhash).then(function(txHash){
        done_txhash.push({'label':"Transaction", 'value':txHash.hash});
        done_txhash.push({'label':"From", 'value':txHash.from});
        done_txhash.push({'label':"To", 'value':txHash.to});
        done_txhash.push({'label':"Value", 'value':web3.utils.fromWei(txHash.value, 'ether') + " ETH"});
        data.done_txhash = done_txhash;
        web3.eth.getBlock(txHash.blockNumber).then(function(txBlock){
          var file = "./eh7/" + txHash.from + ".json";
          var timestamp = txBlock.timestamp;
          fs.readFile(file, 'utf8', function(err, fs_data){
            var json_data = JSON.parse(fs_data);
            for(i=0;i<json_data.txs.length;i++) {
              if(json_data.txs[i].hash == txHash.hash) {
                json_data.txs[i].timestamp = timestamp;
              }
            }
            var json_updated = JSON.stringify(json_data,null,2);
            fs.writeFile(file, json_updated, function (err) {
              if(err) console.log(err);
              res.render('pages/wallet', data);
            });
          });
        });
      });
//        res.render('pages/wallet', data);
    } else
      res.render('pages/wallet', data);
  });
  });

});
//---------------------------------------------------------------------//

app.get('/clear', (req, res) => {
  localStorage.setItem('myNKey', '');
  res.send('myNKey cleared...');
});

app.get('/', (req, res) => res.redirect(301, '/wallet'));

app.listen(port, () => console.log('Example app listening on http://127.0.0.1:' + port));

/*-----------------------------------------------------------------*/

var getBalance = function(balance_addr) {
  return new Promise(function (resolve, reject) {
    web3.eth.getBalance(balance_addr, function(error,balance) {
      if(error)
        reject(error);
      else
      {
        balance = web3.utils.fromWei(balance, 'ether');
//        console.log(balance_addr + " :: " + balance);
        resolve(balance);
      }
    });
  });
};

//--------------------------------------------------------------------// 
function getQRCode(code) {
  return new Promise(function (resolve, reject) {
    QRCode.toDataURL(code, function (err, url) {
      if(err)
        reject(err);
      else 
        resolve(url);
    })
  });
}

//--------------------------------------------------------------------// 
function encrypt(text){
  var cipher = crypto.createCipher(algorithm,password)
  var crypted = cipher.update(text,'utf8','hex')
  crypted += cipher.final('hex');
  return crypted;
}
//--------------------------------------------------------------------// 
function decrypt(text){
  var decipher = crypto.createDecipher(algorithm,password)
  var dec = decipher.update(text,'hex','utf8')
  dec += decipher.final('utf8');
  return dec;
}
//--------------------------------------------------------------------// 

function checkAuthed(req, res, next){
  console.log("checkAuthed");
//  console.log(req.session.hash);

  if(req.session.authed == true) {
    next();
  } else {

    console.log("no hash");

console.log("check and update req.session.authed if match : " + req.body.passphrase);

    var file = config.my_json_file;

    fs.readFile(file, 'utf8', function(err, fs_data){

      var fs_data_obj = JSON.parse(fs_data);

      bcrypt.compare(req.body.passphrase, fs_data_obj.hash, function(err, result) {

        console.log(result);

        if(result == true) {

          req.session.authed = true;

          var url = "/wallet";

          if(req.session.loginUrl) {
            url = req.session.loginUrl;
            req.session.loginUrl = '';
          } 

          res.redirect(url);

        } else if (req.path==='/wallet/login') {

          next();

        } else {
          req.session.loginUrl = req.url;
          res.redirect("/wallet/login");
        }
      });
    });

  }
}
//--------------------------------------------------------------------// 

function checkForWalletPassword(req, res, next){

  var file = config.my_json_file;
  fs.readFile(file, 'utf8', function(err, fs_data){
    console.log("checkForWalletPassword");
//    console.log(req);

    if (req.path==='/wallet/auth') {
      next();
    } else if(err) {
      console.log("need to create my.json");
      res.redirect("/wallet/auth");
    } else next();
  });
}
//--------------------------------------------------------------------// 
function getMnemonic(){

  return new Promise(function (resolve, reject) {

    var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];

    fs.readFile(config.my_json_file, 'utf8', function(err, fs_data){

      if(err){ 
        reject(err)
      } else {

        var json_data = JSON.parse(fs_data);
        console.log(json_data.hash);
        console.log(json_data.key);

        var encryptedBytes = aesjs.utils.hex.toBytes(json_data.key);
 
        var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(json_data.i));
        var decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
        var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
//        console.log(decryptedText);

        resolve(decryptedText);
      }
    });
  });
}
//--------------------------------------------------------------------// 
function storeMnemonic(myCode){

//  console.log(myCode);

  var count = config.count;

  var key = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
               16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28,
               29, 30, 31];
 
  var text = myCode; 
  var textBytes = aesjs.utils.utf8.toBytes(text);
 
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(count));
  var encryptedBytes = aesCtr.encrypt(textBytes);
 
  var encryptedHex = aesjs.utils.hex.fromBytes(encryptedBytes);
  console.log(encryptedHex);

  var file = config.my_json_file;
  fs.readFile(file, 'utf8', function(err, fs_data){
    var json_data = JSON.parse(fs_data);
    json_data.key = encryptedHex;
    json_data.i = count;
    fs.writeFile(file, JSON.stringify(json_data), 'utf8', function(err,result) {
      if(err)
        console.log(err); 
    });
  });

/* 
  var encryptedBytes = aesjs.utils.hex.toBytes(encryptedHex);
 
  var aesCtr = new aesjs.ModeOfOperation.ctr(key, new aesjs.Counter(count));
  var decryptedBytes = aesCtr.decrypt(encryptedBytes);
 
  var decryptedText = aesjs.utils.utf8.fromBytes(decryptedBytes);
  console.log(decryptedText);
*/
}
//--------------------------------------------------------------------// 
async function setupCode(){
  var myCode = await getMnemonic();
  myNKey = myCode;
  console.log(myCode);
}
//--------------------------------------------------------------------// 
