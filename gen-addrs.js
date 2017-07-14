var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');

var password = 'insecure pw'
var network = 'testnet'

function genPrivKey(password, network){
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  var hdPrivateKey = code.toHDPrivateKey(password, network);
  // do we want to store the hdPrivateKey in localstorage?
  return {"code": code.toString(), "privkey": hdPrivateKey}
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

// var res = genPrivKey(password, network)
// console.log(res)
// var recovered = recoverPrivKey("brass merry satoshi choose winner protect example better sign eyebrow wink nasty", password, network)
// console.log(recovered)
// console.log(newPubKey(res['privkey'], tradeId))
