var LottoDraw = artifacts.require("./LottoDraw.sol");

module.exports = function(deployer) {
  deployer.deploy(LottoDraw);
};
