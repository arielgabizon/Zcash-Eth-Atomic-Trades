var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');

var password = 'insecure pw';
var network = 'testnet';
var tradeId = 3;

'use strict';

module.exports = {
  genPrivKey: function(password, network){
    //console.log("In genprivkey")
    var code = new Mnemonic(Mnemonic.Words.ENGLISH);
    var hdPrivateKey = code.toHDPrivateKey(password, network);
    // do we want to store the hdPrivateKey in localstorage?
    return {"code": code.toString(), "privkey": hdPrivateKey.toString()}
  },
  recoverPrivKey: function(code, password, network){
    var hdPrivateKey = new Mnemonic(code).toHDPrivateKey(password, network);
    return hdPrivateKey
  },
  // for per-trade public keys. Necessary?
    newPubKey: function(hdPrivateKey, tradeId){
    var derived = hdPrivateKey.derive(tradeId)
    var hdPublicKey = hdPrivateKey.hdPublicKey;
    var address = derived.privateKey.toAddress();
    return {"pubkey": hdPublicKey, "address": address};
  }
};