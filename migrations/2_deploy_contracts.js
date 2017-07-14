var HashLock = artifacts.require("./hashlock.sol");

module.exports = function(deployer) {
  deployer.deploy(HashLock);
};
