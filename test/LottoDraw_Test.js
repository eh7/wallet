var assert = require('assert');
var LottoDraw = artifacts.require("LottoDraw");
var LottoPlay = artifacts.require("LottoPlay");

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
    assert.equal(thisLottoSetup.logs[0].args.timestamp.toNumber()+duration,thisLottoSetup.logs[0].args.endTime.toNumber(),"endTime's not equal");
    assert.equal(thisLottoSetup.logs[0].args.timestamp.toNumber()+duration,thisLottoSetup.logs[0].args.endTime.toNumber(),"endTime's not equal");

//    lottoPlay = await LottoPlay.new({from:owner});

    var lastNumber = 6;
    var thisLottoPlay = await lottoDraw.playLotto(lottoId, [1,2,3,4,5,lastNumber]);
    assert.equal(thisLottoPlay.logs[0].args.numbers.length, 6,"length of numbers not equal 6");
    assert.equal(thisLottoPlay.logs[0].args.numbers[5].toNumber(), lastNumber,"lastNumber ie. numbers[5] not equal " + lastNumber);

    var a = await lottoDraw.playLotto(lottoId, [2,2,3,4,5,lastNumber]);
    var b = await lottoDraw.playLotto(lottoId, [3,2,3,4,5,lastNumber]);
    var c = await lottoDraw.playLotto(lottoId, [3,2,3,4,5,lastNumber],{from:accounts[1]});
    assert.equal(a.logs[0].args.numbers[0].toNumber(), 2,"LottoGame number[0][0]=2  not equal");
    assert.equal(a.logs[0].args.numbers[2].toNumber(), 3,"LottoGame number[0][2]=3  not equal");
    assert.equal(b.logs[0].args.numbers[0].toNumber(), 3,"LottoGame number[2][0]=3  not equal");

    var thisLottoDraw = await lottoDraw.doLottoDraw(lottoId);
    assert.equal(thisLottoDraw.logs[0].args.lottoId.toNumber(), lottoId,"LottoDraw Id's not equal");
    assert.equal(thisLottoDraw.logs[1].args.numbers.length, 6, "LottoDraw number not equal 6");
    var winnerCount = await lottoDraw.winningTurnCount.call(lottoId);
    var winners = [];
    for(i=0;i<winnerCount;i++) {
      var winner = await lottoDraw.winningTurns.call(lottoId,i);
      winners.push(winner); 
    }
console.log("winnerCount: " + winnerCount);
console.log(winners);

    try{
    var tmp = await lottoDraw.doLottoDraw(lottoId);
    } catch(error) { 
      const revet = error.message.search('VM Exception while processing transaction: revert');// >= 0;
      if(revet >= 0) {
//        console.log(error.message);
        assert.equal(error.message, "VM Exception while processing transaction: revert", "checking require in doLottoDraw, should trigger error on second call");
      }
    };

//    var thisLottoDraw = await lottoDraw.doLottoDraw(lottoId);
//console.log(thisLottoDraw);
    
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
