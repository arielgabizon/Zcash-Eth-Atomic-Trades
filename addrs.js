var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');

var password = 'insecure pw'
var network = 'testnet'

function genPrivKey(password, network){
  console.log("In genprivkey", password, network)
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  var hdPrivateKey = code.toHDPrivateKey(password, network);
  // do we want to store the hdPrivateKey in localstorage?
  return {"code": code, "privkey": hdPrivateKey}
}

function recoverPrivKey(code, password, network){
  var hdPrivateKey = new Mnemonic(code).toHDPrivateKey(password, network);
  return hdPrivateKey
}

// for per-trade public keys. Necessary?
var tradeId = 3;
function newPubKey(hdPrivateKey, tradeId){
  if(typeof(hdPrivateKey) === 'string'){
    hdPrivateKey = new zcore.HDPrivateKey(hdPrivateKey)
  }
  var derived = hdPrivateKey.derive(tradeId)
  var hdPublicKey = hdPrivateKey.hdPublicKey;
  var address = derived.privateKey.toAddress();
  return {"pubkey": hdPublicKey, "address": address}
}

// var res = genPrivKey("test", 'testnet')
// var privkey = new zcore.HDPrivateKey("tprv8ZgxMBicQKsPdodJxDwnM6WNHGW6LrXr4krCKxRnrqLnmRBPxAgDRqDNrNVhqqh5Xpqvk8TXUgncW8dsc3FPDeK1wWshap6Rrmf68WQvQG5");
// console.log(privkey)
// var derived = privkey.derive(2)
// console.log(derived.privateKey.toAddress())

module.exports.genPrivKey = genPrivKey;
module.exports.recoverPrivKey = recoverPrivKey;
module.exports.newPubKey = newPubKey;
