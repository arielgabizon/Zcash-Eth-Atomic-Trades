var zcore = require('bitcore-lib-zcash');
var Mnemonic = require('bitcore-mnemonic');
var crypto = require('crypto');

'use strict';

module.exports = {

  genPrivKey: function(password, network){
    //console.log("In genprivkey")
    var code = new Mnemonic(Mnemonic.Words.ENGLISH);
    var hdPrivateKey = code.toHDPrivateKey(password, network);
    // do we want to store the hdPrivateKey in localstorage?
    return {
      "code": code.toString(),
      "privkey": hdPrivateKey.toString()
    };
  },
  recoverPrivKey: function(code, password, network){
    var hdPrivateKey = new Mnemonic(code).toHDPrivateKey(password, network);
    return hdPrivateKey;
  },
  // for per-trade public keys. Necessary?
  newPubKey: function(hdPrivateKey, tradeId){
    if(typeof(hdPrivateKey) === 'string'){
      hdPrivateKey = new zcore.HDPrivateKey(hdPrivateKey)
    }
    var derived = hdPrivateKey.derive(tradeId)
    var hdPublicKey = hdPrivateKey.hdPublicKey;
    var address = derived.privateKey.toAddress();
    return {
      "pubkey": hdPublicKey,
      "address": address
    };
  },
  encrypt: function(data,password){
    var cipher = crypto.createCipher('aes256',password);
    var encrypted = cipher.update(data,'utf-8','hex');
    return encrypted + cipher.final('hex');
  },
  decrypt: function(ciphertext,password){
    var decipher = crypto.createDecipher('aes256', password);
    var decrypted = decipher.update(ciphertext,'hex','utf-8');
    return decrypted + decipher.final('utf-8');
  }
};
