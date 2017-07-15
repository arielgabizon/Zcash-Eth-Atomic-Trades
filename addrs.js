var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');

var password = 'insecure pw'
var network = 'testnet'

function genPrivKey(password, network){
  console.log("In genprivkey")
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  var hdPrivateKey = code.toHDPrivateKey(password, network);
  // do we want to store the hdPrivateKey in localstorage?
  return {"code": code.toString(), "privkey": hdPrivateKey.toString()}
}

function recoverPrivKey(code, password, network){
  var hdPrivateKey = new Mnemonic(code).toHDPrivateKey(password, network);
  return hdPrivateKey
}

// for per-trade public keys. Necessary?
var tradeId = 3;
function newPubKey(hdPrivateKey, tradeId){
  var derived = hdPrivateKey.derive(tradeId)
  var hdPublicKey = hdPrivateKey.hdPublicKey;
  var address = derived.privateKey.toAddress();
  return {"pubkey": hdPublicKey, "address": address}
}

module.exports.genPrivKey = genPrivKey;
module.exports.recoverPrivKey = recoverPrivKey;
module.exports.newPubKey = newPubKey;
