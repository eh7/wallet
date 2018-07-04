var assert = require('assert');
var LottoGame = artifacts.require("LottoGame");

contract('LottoGame', async(accounts) => {

  let owner = accounts[2];
  let non_owner = accounts[0];

  var lottoGame;
  var ballot = [];
  var option;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  beforeEach('setup contract before each test', async function () {
//    console.log(1);
  });

  before('setup contract for each test', async function () {
    lottoGame = await LottoGame.new({from:owner});
    assert.equal(await lottoGame.owner.call(), owner);
  });

  it("owner correct", async() => {
    let owner  = await lottoGame.owner.call();
    assert.equal(owner,owner, "not equal");
  });

  it("check newLotto", async() => {

    var thisLottoGame = await lottoGame.newLotto("data",{from:owner});

//    console.log(thisLottoGame.logs[0].args);

    var count = await lottoGame.lottoCount.call(owner);

//    console.log(thisLottoGame.logs[0].args.count.toNumber());
//    console.log(count.toNumber());

    assert.equal(count.toNumber() ,thisLottoGame.logs[0].args.count.toNumber(), "No tequal");

  });

  it("check name newLotto", async() => {

    var name = "this is the lotto name";
    var thisLottoGame = await lottoGame.newLotto(name,{from:owner});
    assert.equal(name, thisLottoGame.logs[0].args.name, "not equal");

  });

  it("check timestamp from newLotto", async() => {
    var name = "this is the lotto name 321";
    var thisLottoGame = await lottoGame.newLotto(name,{from:owner});
    var count = thisLottoGame.logs[0].args.lottoId.toNumber();
    var logsTimestamp = thisLottoGame.logs[0].args.timestamp.toNumber();
    var lotto = await lottoGame.lottos.call(count);
    var lottoTimestamp = lotto[1].toNumber();
    assert.equal(logsTimestamp, lottoTimestamp, "timestamps not equal");
//    console.log(logsTimestamp);
//    console.log(lottoTimestamp);
  });

  it("check name from newLotto", async() => {
    var name = "test name lottoGame";
    var thisLottoGame = await lottoGame.newLotto(name,{from:owner});
    var lottoId = thisLottoGame.logs[0].args.lottoId.toNumber();
    var lotto = await lottoGame.lottos.call(lottoId);
    var lottoName = lotto[0];
    assert.equal(name, lottoName, "name not equal");
  });

  it("check number from newLotto endTime", async() => {
    var name = "this is the lotto name";
    var thisLottoFactory = await lottoGame.newLotto(name,{from:owner});
    var lottoId = thisLottoFactory.logs[0].args.lottoId.toNumber();
    var duration = 60 * 10; // 10 minutes
    var thisLottoGame = await lottoGame.playLottoGame(lottoId, duration);
    assert.equal(thisLottoGame.logs[0].args.timestamp.toNumber()+duration,thisLottoGame.logs[0].args.endTime.toNumber(),"endTime's not equal");
  });

});
