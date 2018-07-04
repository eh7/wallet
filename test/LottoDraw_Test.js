var assert = require('assert');
var LottoDraw = artifacts.require("LottoDraw");

contract('LottoDraw', async(accounts) => {

  let owner = accounts[2];
  let non_owner = accounts[0];

  var lottoDraw;
  var ballot = [];
  var option;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  beforeEach('setup contract before each test', async function () {
//    console.log(1);
  });

  before('setup contract for each test', async function () {
    lottoDraw = await LottoDraw.new({from:owner});
    assert.equal(await lottoDraw.owner.call(), owner);
  });

  it("owner correct", async() => {
    let owner  = await lottoDraw.owner.call();
    assert.equal(owner,owner, "not equal");
  });

  it("check newLotto", async() => {

    var thisLottoGame = await lottoDraw.newLotto("data",{from:owner});

//    console.log(thisLottoGame.logs[0].args);

    var count = await lottoDraw.lottoCount.call(owner);

//    console.log(thisLottoGame.logs[0].args.count.toNumber());
//    console.log(count.toNumber());

    assert.equal(count.toNumber() ,thisLottoGame.logs[0].args.count.toNumber(), "No tequal");

  });

  it("check name newLotto", async() => {

    var name = "this is the lotto name";
    var thisLottoGame = await lottoDraw.newLotto(name,{from:owner});
    assert.equal(name, thisLottoGame.logs[0].args.name, "not equal");

  });

  it("check timestamp from newLotto", async() => {
    var name = "this is the lotto name 321";
    var thisLottoGame = await lottoDraw.newLotto(name,{from:owner});
    var count = thisLottoGame.logs[0].args.lottoId.toNumber();
    var logsTimestamp = thisLottoGame.logs[0].args.timestamp.toNumber();
    var lotto = await lottoDraw.lottos.call(count);
    var lottoTimestamp = lotto[1].toNumber();
    assert.equal(logsTimestamp, lottoTimestamp, "timestamps not equal");
//    console.log(logsTimestamp);
//    console.log(lottoTimestamp);
  });

  it("check name from newLotto", async() => {
    var name = "test name lottoDraw";
    var thisLottoGame = await lottoDraw.newLotto(name,{from:owner});
    var lottoId = thisLottoGame.logs[0].args.lottoId.toNumber();
    var lotto = await lottoDraw.lottos.call(lottoId);
    var lottoName = lotto[0];
    assert.equal(name, lottoName, "name not equal");
  });

  it("check number from newLotto endTime", async() => {
    var name = "this is the lotto name";
    var thisLottoFactory = await lottoDraw.newLotto(name,{from:owner});
    var lottoId = thisLottoFactory.logs[0].args.lottoId.toNumber();
    var duration = 60 * 10; // 10 minutes
    var thisLottoSetup = await lottoDraw.lottoSetup(lottoId, duration);
    var thisLottoDraw = await lottoDraw.doLottoDraw(lottoId);
console.log(thisLottoDraw.logs[0].args);
//    assert.equal(thisLottoDraw.logs[0].args.timestamp.toNumber()+duration,thisLottoDraw.logs[0].args.endTime.toNumber(),"endTime's not equal");
//    assert.equal(thisLottoDraw.logs[0].args.timestamp.toNumber()+duration,thisLottoDraw.logs[0].args.endTime.toNumber(),"endTime's not equal");
  });

/*
  it("check doLottoDraw", async() => {
    var name = "doLottoDraw test name";
    var thisLottoFactory = await lottoDraw.newLotto(name,{from:owner});
    var lottoId = thisLottoFactory.logs[0].args.lottoId.toNumber();
    var duration = 60 * 10; // 10 minutes
    var thisLottoGame = await lottoDraw.playLottoGame(lottoId, duration);
  });
*/
});
