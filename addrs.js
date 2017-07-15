var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');

var password = 'insecure pw'
var network = 'testnet'

'use strict';

var genPrivKey = function(password, network){
  console.log("In genprivkey")
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  var hdPrivateKey = code.toHDPrivateKey(password, network);
  // do we want to store the hdPrivateKey in localstorage?
  return {"code": code.toString(), "privkey": hdPrivateKey.toString()}
}

var recoverPrivKey = function(code, password, network){
  var hdPrivateKey = new Mnemonic(code).toHDPrivateKey(password, network);
  return hdPrivateKey
}

// for per-trade public keys. Necessary?
var tradeId = 3;
var newPubKey = function(hdPrivateKey, tradeId){
  var derived = hdPrivateKey.derive(tradeId)
  var hdPublicKey = hdPrivateKey.hdPublicKey;
  var address = derived.privateKey.toAddress();
  return {"pubkey": hdPublicKey, "address": address}
}

exports.genPrivKey = genPrivKey;
exports.recoverPrivKey = recoverPrivKey;
exports.newPubKey = newPubKey;
