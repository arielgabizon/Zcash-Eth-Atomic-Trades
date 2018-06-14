var crypto = require('crypto');
var express = require('express')
var contract = require("truffle-contract");
var Web3 = require('web3');
var bodyParser = require('body-parser');
//var uuidv4 = require('uuid/v4');
var Mnemonic = require('bitcore-mnemonic');

var zcash = require('./ZBXCAT/zcash');
var addrs = require('./addrs');

var app = express();

var json = require("./build/contracts/hashlock.json");
var HashLockContract = contract(json);

// use ejs template engine
app.set('view engine', 'ejs');

// serve up static files from
app.use('/static',express.static('./node_modules'));
// serve up static files from public
app.use('/static',express.static('./public'));

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
HashLockContract.setProvider(provider);
var web3 = new Web3(provider);


/*****************************************************************
 * API
 *****************************************************************/

/*app.post('/setup', function(req, res){
    var pw = req.body.password
    var genpriv = addrs.genPrivKey(pw, 'testnet')
                console.log("genpriv.privkey", typeof(genpriv.privkey))
                // increment the num of keys generated
                var rand = Math.floor(Math.random() * 200);
                var genpub = addrs.newPubKey(genpriv.privkey, rand)
    // this is bad. get working on client side with browserify
    res.send({
        code: genpriv.code.toString(),
        privkey: genpriv.privkey.toString(),
                        pubkey: genpub.pubkey.toString(),
                        address: genpub.address.toString()
    });
});

app.post('/wallet', function(req, res){
        var privkey = req.body.privkey;
        console.log("privkey", privkey)
        var rand = Math.floor(Math.random() * 200);
        var genpub = addrs.newPubKey(privkey, rand)
        res.send({
                address: genpub.address.toString()
        });
});*/


/**
 * Generates a random UUID
 */
app.get('/api/random', function(req, res){
  var code = new Mnemonic(Mnemonic.Words.ENGLISH);
  var arr = code.toString().split(/\s/)
  res.send({
      random: arr.slice(0,3).join('')
  });
});

/**
 * Computes sha256 hash of data
 */
app.post('/api/hash', function(req, res){
    if(req.body['data']){
        var hash = crypto.createHash('sha256');
        hash.update(req.body.data);
        res.send({
            hash: "0x"+hash.digest('hex')
        });
    }else{
        res.send({
            error: 'data is not defined'
        });
    }
});

var abi = [{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"trades","outputs":[{"name":"sender","type":"address"},{"name":"redeemer","type":"address"},{"name":"senderZAddr","type":"string"},{"name":"redeemerZAddr","type":"string"},{"name":"hash","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"timeoutBlock","type":"uint256"},{"name":"zecTx","type":"string"},{"name":"zecP2SH","type":"bytes32"},{"name":"zecRedeemScript","type":"string"},{"name":"zecAmount","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"},{"name":"_preimage","type":"string"}],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"},{"name":"_p2sh","type":"bytes32"},{"name":"_tx","type":"string"},{"name":"_zec_redeem_script","type":"string"}],"name":"update","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_redeemer","type":"address"},{"name":"_expires_in","type":"uint256"},{"name":"_sender_zaddr","type":"string"},{"name":"_redeemer_zaddr","type":"string"},{"name":"_zec_amount","type":"uint256"}],"name":"lock","outputs":[],"payable":true,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"redeemer","type":"address"}],"name":"newHashlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"preimage","type":"string"}],"name":"unlockHash","type":"event"}];

//  hashlock contract address -- update it here
var contractAddress = "0x79ea41367db32c8cac772803b2074df9738e4f6c";
/**
 * info about swap contract
 */
app.get('/api/swap', function (req, res) {
    res.send({
        abi: abi,
        address: contractAddress,
    });
});

/**
 * Get Swap info
 */
/*app.get('/api/swap/get/:id', function(req, res){

    if(!req.params.id){
        res.send({
            error: "Invalid parameters"
        });
    }
    // else if(/^0x/.test(req.params.id)){
    //     // id is a transaction hash
    //     var txId = req.params.id;
    //     web3.eth.getTransactionReceipt(txId,function(err,result){
    //         if(err == null || result == null){
    //             res.send({
    //                 error: "tx: " + txId + " was not found."
    //             });
    //         }
    //         else if(err){
    //             res.send({
    //                 error: err.toString()
    //             });
    //         }else{
    //             // TODO: get trade id
    //             getTrade(txId,res);
    //         }
    //     });
    // }
    else if(/\d+/.test(req.params.id)){
        // id is the trade id
        var hashlockContract = web3.eth.contract(abi);
        var instance = hashlockContract.at(contractAddress);
        var tradeId = req.params.id;
        instance.trades(tradeId,function(err,tradeData){
            console.log(tradeData)
            res.send({
                id: tradeId,
                sender: tradeData[0],
                redeemer: tradeData[1],
                senderZAddr: tradeData[2],
                redeemerZAddr: tradeData[3],
                hash: tradeData[4],
                amount: tradeData[5],
                timeoutBlock: tradeData[6],
                fundTx: tradeData[7],
                p2sh: tradeData[8],
                redeemScript: tradeData[9],
                zecAmount: tradeData[10]
            });
        });
    }else{
        res.send({
            error: "Invalid parameters"
        });
    }

});*/

/**
 * Gets just the zcash redeemscript/p2sh
 */
app.post('/api/zec/p2sh', function(req, res){
    var ethBlocks = req.body.ethBlocks
    var zecBlocks = Math.ceil(ethBlocks / 20)
    console.log('zecblocks', zecBlocks)

    var contractData = {
        initiator: req.body.initiator,    // B
        fulfiller: req.body.redeemer,     // A
        timeLock: zecBlocks,
        hash: req.body.hash,
        secret: req.body.secret
      }
    console.log("CONTRACTDATA", contractData)

    zcash.call('make', contractData)
      .then(function(contract){
        console.log("Response from make func:", contract)
        console.log("p2sh", contract['p2sh'])
        res.send({
          redeemblocknum: contract['redeemblocknum'],
          redeemScript: contract['redeemScript'],
          p2sh: contract['p2sh']
          // rawTx: rawTx
        });
      }).catch(function(err){
          res.send({
              error: err.toString()
          });
      });;
})

/**
 * Gets funding data transaction P2SH
 */
app.post('/api/zec/txdata', function(req, res){
    var tradeId = req.body.tradeId

    if(!tradeId){
        res.send({
            error: 'tradeId is required'
        });
    }

    zcash.call('getdata', '')
        .then(function(contract){
           console.log("Response from getdata:", contract)
           var data = {};
           for(var key in contract){
             data[key] = contract[key];
           }
           res.send(data);
        }).catch(function(err){
              res.send({
                  error: err.toString()
              });
        });
});

/**
 * Submits Bob's funding transaction
 */
app.post('/api/zec/tx/fund', function(req, res){
    var data = {
      p2sh: req.body.p2sh,
      amt: req.body.amt
    }

    zcash.call('fund', data)
        .then(function(contract){
           console.log("Contract returning from call", contract)
           console.log("Fund txid returning from call", contract['fund_tx'])

            res.send({
                tx: contract['fund_tx'],
                redeemScript: contract['redeemScript']
            });
        }).catch(function(err){
            res.send({
                error: err.toString()
            });
        });;
});

/**
 * Submits Alice's redeem transaction
 */
app.post('/api/zec/tx/redeem', function(req, res){
  var data = {
    preimage: req.body.preimage,
    fundTx: req.body.fundTx,
    p2sh: req.body.p2sh,
    redeemer: req.body.redeemer
  }

  zcash.call('redeem', data)
      .then(function(contract){
         console.log("Contract returning from redeem call", contract)
         console.log("Redeem contract returning from call", contract['redeem_tx'])
          res.send({
              tx: contract['redeem_tx']
          });
      }).catch(function(err){
          res.send({
              error: err.toString()
          });
      });;
});

/**
 * Submits Bob's refund transaction
 */
app.post('/api/zec/tx/refund', function(req, res){
  zcash.call('refund')
    .then(function(contract){
        console.log("Contract returning from refund call", contract)
        console.log("Redeem txid returning from call", contract['refund_tx'])
         res.send({
             tx: contract['refund_tx']
         });
     }).catch(function(err){
         res.send({
             error: err.toString()
         });
     });
})

app.post('/api/zec/address', function(req, res){
  var data = {
    role: req.body.role
  }
  zcash.call('getaddr', data)
    .then(function(contract){
        console.log("Getting contract", contract)
        res.send({
          address: contract[data['role']]
        });
    }).catch(function(err){
        res.send({
            error: err.toString()
        });
    });
})

/**
 * Creates a "hash lock ETH contract" between Alice and Bob
 */
/*app.post('/api/eth/lock', function(req, res){
    var hash = req.body.hash;
    var redeemer = req.body.redeemer;
    var sender = req.body.sender;
    var senderZAddr = req.body.senderZAddr;
    var redeemerZAddr = req.body.redeemerZAddr;
    var expiry = req.body.expiry;
    var amount = req.body.amount;
    instance.lock(hash, redeemer, expiry, senderZAddr, redeemerZAddr, {
        from: sender,
        value: amount,
        gas: 1248090
    }).then(function(result){
        res.send({
            tradeId: result.logs[0].args.trade_id,
            tx: result.tx
        });
    }).catch(function(err){
        res.send({
            error: err.toString()
        });
    });
});*/

/*app.post('/api/eth/unlock', function(req, res){
    var tradeId = req.body.tradeId;
    var preimage = req.body.preimage;
    var redeemer = req.body.redeemer;
    // can the redeemer be just the address, or must be accessed through web3?
    instance.unlock(tradeId, preimage, {
        from: redeemer,
        gas: 1248090
    }).then(function(result){
        res.send({
            tx: result.tx
        });
    }).catch(function(err){
        res.send({
            error: err.toString()
        });
    });
});*/

/*****************************************************************
 * pages
 *****************************************************************/
app.get('/',function(req,res){
    res.render('pages/index',{
        title: "Home"
    });
});

app.get('/wallet', function(req, res){
    res.render('pages/wallet',{
        title: "Wallet"
    });
});

app.get('/trade/eth/init',function(req,res){
  res.render('pages/trade/eth-init',{
    title: "Init ETH HLC"
  });
});

app.get('/trade/zec/init',function(req,res){
  res.render('pages/trade/zec-init',{
    title: "Init ZEC HLC"
  });
});

app.get('/trade/zec/settle',function(req,res){
  res.render('pages/trade/zec-settle',{
    title: "Settle ZEC HLC"
  });
});

app.get('/trade/eth/settle',function(req,res){
  res.render('pages/trade/eth-settle',{
    title: "Settle ETH HLC"
  });
});

app.listen(3000,function(){
  console.log("http://localhost:3000");
});
