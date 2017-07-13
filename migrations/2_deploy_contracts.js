var HashLock = artifacts.require("./HashLock.sol");

module.exports = function(deployer) {
  deployer.deploy(HashLock);
};
