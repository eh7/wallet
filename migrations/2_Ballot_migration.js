var BallotFactory = artifacts.require("./BallotFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(BallotFactory);
};
