var assert = require('assert');
var User = artifacts.require("User");

//contract('User', function(accounts) {
contract('User', async(accounts) => {

  let owner = accounts[2];
  let non_owner = accounts[0];

  var user;
  var ballot = [];
  var option;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  before('setup contract for each test', async function () {
    user = await User.new({from:owner});
    assert.equal(await user.owner.call(), owner);
  });

  it("owner correct", async() => {
    let owner  = await user.owner.call();
    assert.equal(owner,owner, "not equal");
  });

  it("check updateUser", async() => {

    var thisUser = await user.updateUser("data",{from:owner});

//    console.log(thisUser.logs[0].args);

    var hash = await user.hash.call(owner);

    assert.equal(hash,thisUser.logs[0].args.hash, "not equal");

//    console.log(hash);

  });

  it("check updateUser 2", async() => {

    var thisUser = await user.updateUser("data1",{from:non_owner});

    var hash = await user.hash.call(non_owner);

    var hash = await user.hash.call(owner);

    assert.notEqual(hash,thisUser.logs[0].args.hash, "not equal");

//    console.log(user.abi);
  });

});
