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

var web3 = new Web3(new Web3.providers.WebsocketProvider(config.web3_provider));

const express = require('express');
const app = express();
var bodyParser = require("body-parser");
var path        = require('path');
var morgan      = require('morgan');

const Mnemonic = require('bitcore-mnemonic');
const eth_wallet = require('ethereumjs-wallet')

if (typeof localStorage === "undefined" || localStorage === null) {
  var LocalStorage = require('node-localstorage').LocalStorage;
  localStorage = new LocalStorage('./scratch');
}

var myNKey = localStorage.getItem('myNKey');
var myCount = localStorage.getItem('myCount');

//var parseurl = require('parseurl');

const port = process.argv[2] || 9999;


if(myNKey == '') {
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  localStorage.setItem('myNKey', code);
  localStorage.setItem('myCount', 0);
}

app.set('superSecret', config.secret);

app.set('view engine', 'ejs');

app.use(morgan('dev'));
app.use('/assets', express.static(path.join(__dirname + '/assets')));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
//---------------------------------------------------------------------//

app.get('/wallet/txs', (req, res) => {
  web3.eth.getTransactionCount(req.query.addr, function(err,nonce) {
    if(err)
      console.log(err);
    var data = {
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
    'address':address,
    'balance':balance,
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

//        var code = new Mnemonic(myNKey);
        var code = new Mnemonic(config.myNKey);
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
console.log(privateKey.toString('hex'));
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
                  object.txs.push({'to':to,'amount':web3.utils.toWei(amount),'hash':hash});
                  var json = JSON.stringify(object);
                  fs.writeFile(file, json, 'utf8', console.log(err)); 
              } else {
                var object = JSON.parse(data); 
                object.txs.push({'to':to,'amount':web3.utils.toWei(amount),'hash':hash});
                var json = JSON.stringify(object); 
                fs.writeFile(file, json, 'utf8', console.log(err)); 
            }});
            console.log(file);
  
            data.errors = errors;
            data.txhash = hash;
            res.render('pages/sending', data);
          }
        });
      });
    });
  }
});
//---------------------------------------------------------------------//

app.get('/wallet/send', (req, res) => {
  var address = req.query.addr;
  var balance = req.query.bal;
  var acount  = req.query.acount;
  var data = {
    'address':address,
    'balance':balance,
    'acount':acount,
  };

  if(req.query.action === "sending"){
    console.log(data);
    data.txhash = req.query.txhash;
    web3.eth.getTransaction(req.query.txhash).then(function(txHash){
      console.log(txHash);
      if(txHash.blockNumber > 0)
        res.redirect(301, '/wallet?action=done&txhash=' + req.query.txhash)
//        res.render('pages/wallet', data);
      else
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

  var code = new Mnemonic(config.myNKey);
  var hdPrivateKey = code.toHDPrivateKey();
  var xpriv =  hdPrivateKey.xprivkey;
  var xpub  =  hdPrivateKey.xpubkey;
  var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
  myRootAddr = xpriv_pkey.getAddress().toString('hex');
  myRootPKey = xpriv_pkey.getPrivateKey().toString('hex');

  console.log("Addr: " + xpriv_pkey.getAddress().toString('hex'));
  console.log("Pri: " + xpriv_pkey.getPrivateKey().toString('hex'));
  console.log("Pub: " + xpriv_pkey.getPublicKey().toString('hex'));
  console.log("xPub: " + xpub);
  //console.log(xpriv_pkey);

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

  for(var i=0; i<count; i++) {
    var hdpk = hdPrivateKey.derive(44, true).derive(60,true).derive(0,true).derive(0).derive(i);
//    var path = "m/44'/60'/0'/0/" + i;
//    var hdpk = hdPrivateKey.derive(path);
    var address = hdpk.privateKey.toAddress().toString('hex');
    var pkey = hdpk.privateKey.toString('hex');
    var pubkey = hdpk.publicKey.toString('hex');

    var xpriv =  hdpk.xprivkey;
    var xpriv_pkey = eth_wallet.fromExtendedPrivateKey(xpriv);
    console.log("\n" + i);
//    console.log("Pub:  " + xpriv_pkey.getPublicKey().toString('hex'));
    console.log("Pri:  " + xpriv_pkey.getPrivateKey().toString('hex'));
    console.log("Addr: " + xpriv_pkey.getAddress().toString('hex'));
    keys.push({  
                 count:i,
                 address:web3.utils.toChecksumAddress(xpriv_pkey.getAddress().toString('hex')),
                 pubkey:xpriv_pkey.getPublicKey().toString('hex'),
                 prikey:xpriv_pkey.getPrivateKey().toString('hex'),
              });
    var this_address = xpriv_pkey.getAddress().toString('hex');
//console.log(this_address + " :: " + "\n");
    promise.push(getBalance(this_address));
  }

//  res.send('Wallet Page');

  var this_balance = 0;

  var this_address = myRootAddr;

  promise.push(getBalance(this_address));

  Promise.all(promise)
  .then(results => {

    var data = {
      'address':web3.utils.toChecksumAddress(myRootAddr),
      'pkey':myRootPKey,
      'phrase':myNKey,
      'keys':keys,
      'balance':'this_balance',
    };

    for(var i=0; i<results.length; i++) {
      var tmp = results.length-1;
      if(i == (results.length-1)) {
        console.log(results.length-1);
        data.balance = results[i];
      } else {
        keys[i].balance = results[i];
      }
    }
    console.log(results);

    var done_txhash = [];
    if(req.query.action == 'done'){
      web3.eth.getTransaction(req.query.txhash).then(function(txHash){
        done_txhash.push({'label':"Transaction", 'value':txHash.hash});
        done_txhash.push({'label':"From", 'value':txHash.from});
        done_txhash.push({'label':"To", 'value':txHash.to});
        done_txhash.push({'label':"Value", 'value':web3.utils.fromWei(txHash.value, 'ether') + " ETH"});
        data.done_txhash = done_txhash;
console.log(done_txhash);
        res.render('pages/wallet', data);
      });
//        res.render('pages/wallet', data);
    } else
      res.render('pages/wallet', data);
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
        console.log(balance_addr + " :: " + balance);
        resolve(balance);
      }
    });
  });
};

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
//--------------------------------------------------------------------// 
//--------------------------------------------------------------------// 
//--------------------------------------------------------------------// 
//--------------------------------------------------------------------// 
