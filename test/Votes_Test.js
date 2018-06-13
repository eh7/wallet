var assert = require('assert');
var BallotFactory = artifacts.require("BallotFactory");

//contract('BallotFactory', function(accounts) {
contract('BallotFactory', async(accounts) => {

  var ballotFactory;

  console.log(accounts)
  console.log(web3.eth.getBalance(accounts[0]).toNumber());

  beforeEach('setup contract for each test', async function () {
    ballotFactory = await BallotFactory.new({from:accounts[2]});
  })

  it("contract deployed", async() => {
    console.log("Contract Address: " + BallotFactory.address);
//    ballotFactory = await BallotFactory.deployed();
  });

  it("owner correct", async() => {
    let owner  = await ballotFactory.owner.call();
    assert.equal(owner,accounts[2], "not equal");
  });

  it("check newBallot", async() => {
    let ballot = await ballotFactory.newBallot("description 1",{from:accounts[2]});
    console.log(ballot.logs[0].args);
    ballot = await ballotFactory.newBallot("description 2",{from:accounts[1]});
    console.log(ballot.logs[0].args);
    ballot = await ballotFactory.newBallot("description 3",{from:accounts[1]});
    console.log(ballot.logs[0].args);
    let ballots;
    for(i=0;i<3;i++) {
      ballots = await ballotFactory.ballots.call(i);
      console.log(ballots);
   }
//    assert.equal(owner,accounts[2], "not equal");
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
