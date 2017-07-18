var crypto = require('crypto');
var express = require('express')
var contract = require("truffle-contract");
var Web3 = require('web3');
var bodyParser = require('body-parser');
var uuidv4 = require('uuid/v4');

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

try{
    HashLockContract.deployed().then(function(instance){

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
            res.send({
                random: uuidv4()
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

        /**
         * info about swap contract
         */
        app.get('/api/swap', function (req, res) {
            res.send({
                abi: HashLockContract._json.abi,
                address: instance.address,
            });
        });

        /**
         * Get Swap info
         */
        app.get('/api/swap/get/:id', function(req, res){

            function getTrade(tradeId, res){
                instance.trades(tradeId).then(function(tradeData){
                    console.log(tradeData)
                    res.send({
                        id: req.params.id,
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
                }).catch(function(err){
                    res.send({
                        error: err.toString()
                    });
                });
            }

            if(!req.params.id){
                res.send({
                    error: "Invalid parameters"
                });
            }
            /*else if(/^0x/.test(req.params.id)){
                // id is a transaction hash
                var txId = req.params.id;
                web3.eth.getTransactionReceipt(txId,function(err,result){
                    if(err == null || result == null){
                        res.send({
                            error: "tx: " + txId + " was not found."
                        });
                    }
                    else if(err){
                        res.send({
                            error: err.toString()
                        });
                    }else{
                        // TODO: get trade id
                        getTrade(txId,res);
                    }
                });
            }*/else if(/\d+/.test(req.params.id)){
                // id is the trade id
                getTrade(req.params.id, res);
            }else{
                res.send({
                    error: "Invalid parameters"
                });
            }

        });

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

            zcash.call('getdata')
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
              amt: req.body.amount
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
            redeemer: req.body.redeemer,
            tradeid: req.body.tradeId
          }

          zcash.call('redeem', data)
              .then(function(contract){
                 console.log("Contract returning from redeem call", contract)
                 console.log("Redeem txid returning from call", contract['redeem_tx'])
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

    });
}catch(e){
    console.log(e);
    console.log("Contract hasn't been deployed to blockchain. Try running truffle migrate.");
}
