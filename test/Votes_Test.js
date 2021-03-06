var assert = require('assert');
var BallotFactory = artifacts.require("BallotFactory");

//contract('BallotFactory', function(accounts) {
contract('BallotFactory', async(accounts) => {

  let owner = accounts[2];

  var ballotFactory;
  var ballot = [];
  var option;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  before('setup contract for each test', async function () {
    ballotFactory = await BallotFactory.new({from:owner});
    assert.equal(await ballotFactory.owner.call(), owner);
  })

//  it("contract deployed", async() => {
//    console.log("Contract Address: " + BallotFactory.address);
//    ballotFactory = await BallotFactory.deployed();
//  });

  it("owner correct", async() => {
    let owner  = await ballotFactory.owner.call();
    assert.equal(owner,owner, "not equal");
  });

  it("check newBallot", async() => {
    for(i=0;i<4;i++) {
      ballot.push(await ballotFactory.newBallot("Ballot description " + i,{from:owner}));
//      console.log(ballot[i].logs[0].args);

      ballots = await ballotFactory.ballots.call(i);

      assert.equal(owner,accounts[2]);

//      console.log(ballots);

   }
//    assert.equal(owner,accounts[2], "not equal");
  });

  it("check addOptions", async() => {
    for(i=0;i<4;i++){
      for(j=0;j<4;j++){
        option = await ballotFactory.addOption("option " + i, j,{from:owner});
        assert.equal(option.logs[0].args._optionId.toNumber(),i);
//        console.log(option.logs[0].args);
      }
    }
  });

  it("check getOption ", async() => {
    let ballotId = 3;
    let count = 2;
    ballots = await ballotFactory.ballots.call(ballotId);
    option = await ballotFactory.getOption(ballotId,count,{from:owner});
    assert.equal(option,"option " + count);
//    console.log("option = " + option);
//    console.log("ballots = " + ballots);
  });

  it("check castVote ", async() => {
    let ballotId = 1;
    let vote = await ballotFactory.castVote(ballotId, 1, {from:owner});
    let votes = await ballotFactory.votes.call(ballotId,owner);
    
    console.log("vote = " + JSON.stringify(vote.logs[0], null, 2));
    console.log("votes = " + JSON.stringify(votes, null, 2));
  });
/*
  it("Check count is 0", function() {

    return Votes.deployed().then(function(instance) {

      return instance.count.call();

    }).then(function(count) {

      assert.equal(count, 0, " count == 0 ");

    });

  });


  it("owner was " + accounts[0], function() {

    return Votes.deployed().then(function(instance) {

      return instance.owner.call();

    }).then(function(owner) {

      assert.equal(owner, accounts[0], accounts[0] + " wasn't owner");

    });

  });


  it("add vote then check count incrmented", function() {

    var instance;

    return Votes.deployed().then(function(instance) {

      thisInstance = instance;
      return instance.vote(1);

    }).then(function(status) {

//      console.log(status);

      return thisInstance.count.call();

    }).then(function(count) {

      console.log(count);   

      return thisInstance.vote(1,{from:accounts[1]});

    }).then(function(status) {

      console.log(status);

      return thisInstance.count.call();

    }).then(function(count) {

      console.log(count);   

    });
  });

  it("last",function(){
    console.log("Contract Address: " + Votes.address);
  });
*/
});
