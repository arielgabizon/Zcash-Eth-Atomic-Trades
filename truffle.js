var HDWalletProvider = require("truffle-hdwallet-provider");
var mnemonic = "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat";

module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*" // Match any network id
    },
    rinkeby: {
      host: "localhost", // Connect to geth on the specified
      port: 8545,
      network_id: 4,
      gas: 1000000  // Gas limit used for deploys
    },
    kovan: {
      host: "localhost", // Connect to parity on the specified
      port: 8545,
      network_id: 42,
      gas: 2000000 //maybe?
    },
    infuraRinkeby: {
      provider: function() {
        return new HDWalletProvider(mnemonic, "https://rinkeby.infura.io/6fJGuF1HgM6UeapQcMge")
      },
      network_id: 5
    }
  }
};
