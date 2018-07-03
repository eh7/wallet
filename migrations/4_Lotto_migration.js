var LottoFactory = artifacts.require("./LottoFactory.sol");

module.exports = function(deployer) {
  deployer.deploy(LottoFactory);
};
