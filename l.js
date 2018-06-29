var abi = [ { "constant": true, "inputs": [ { "name": "", "type": "address" } ], "name": "hash", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "newOwner", "type": "address" } ], "name": "transferOwnership", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "hash", "type": "bytes32" } ], "name": "NewUser", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "sender", "type": "address" }, { "indexed": false, "name": "hash", "type": "bytes32" } ], "name": "UpdateUser", "type": "event" }, { "anonymous": false, "inputs": [ { "indexed": true, "name": "previousOwner", "type": "address" }, { "indexed": true, "name": "newOwner", "type": "address" } ], "name": "OwnershipTransferred", "type": "event" }, { "constant": false, "inputs": [ { "name": "_data", "type": "string" } ], "name": "updateUser", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "_data", "type": "string" }, { "name": "_hash", "type": "bytes32" } ], "name": "validateUserData", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "pure", "type": "function" } ];
//var address = "0xfde641085b523520d2793b4e15c2f525fc8d9002";
var address = "0x147f6ce7e903068adef5e6f4337faa2699cfa348";

var User = web3.eth.contract(abi).at(address);

var event = User.allEvents();
event.watch(function(error, result){
  if (!error)
  {
    str = JSON.stringify(result)
    console.log(str);
  }
});


