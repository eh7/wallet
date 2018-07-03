var assert = require('assert');
var LottoFactory = artifacts.require("LottoFactory");

contract('LottoFactory', async(accounts) => {

  let owner = accounts[2];
  let non_owner = accounts[0];

  var lottoFactory;
  var ballot = [];
  var option;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  beforeEach('setup contract before each test', async function () {
//    console.log(1);
  });

  before('setup contract for each test', async function () {
    lottoFactory = await LottoFactory.new({from:owner});
    assert.equal(await lottoFactory.owner.call(), owner);
  });

  it("owner correct", async() => {
    let owner  = await lottoFactory.owner.call();
    assert.equal(owner,owner, "not equal");
  });

  it("check createLotto", async() => {

    var thisLottoFactory = await lottoFactory.createLotto("data",{from:owner});

//    console.log(thisLottoFactory.logs[0].args);

    var count = await lottoFactory.lottoCount.call(owner);

//    console.log(thisLottoFactory.logs[0].args.count.toNumber());
//    console.log(count.toNumber());

    assert.equal(count.toNumber() ,thisLottoFactory.logs[0].args.count.toNumber(), "No tequal");

  });

  it("check name createLotto", async() => {

    var name = "this is the lotto name";
    var thisLottoFactory = await lottoFactory.createLotto(name,{from:owner});
    assert.equal(name, thisLottoFactory.logs[0].args.name, "not equal");

  });

  it("check timestamp from createLotto", async() => {
    var name = "this is the lotto name 321";
    var thisLottoFactory = await lottoFactory.createLotto(name,{from:owner});
    var count = thisLottoFactory.logs[0].args.lottoId.toNumber();
    var logsTimestamp = thisLottoFactory.logs[0].args.timestamp.toNumber();
    var lotto = await lottoFactory.lottos.call(count);
    var lottoTimestamp = lotto[1].toNumber();
    assert.equal(logsTimestamp, lottoTimestamp, "timestamps not equal");
//    console.log(logsTimestamp);
//    console.log(lottoTimestamp);
  });

/*
  it("check number from createLotto", async() => {
    var name = "this is the lotto name";
    var thisLottoFactory = await lottoFactory.createLotto(name,{from:owner});
    var numbner = await lottoFactory.lottos[0].call();
  });
*/
});
