var crypto = require('crypto');
var express = require('express')
var contract = require("truffle-contract");
var Web3 = require('web3');
var bodyParser = require('body-parser');

var app = express();

var json = require("./build/contracts/hashlock.json");
var HashLockContract = contract(json);

// serve up static files from
app.use(express.static('./node_modules'));
// serve up static files from public
app.use(express.static('./public'));

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
var web3 = new Web3(provider);
HashLockContract.setProvider(provider);

try{
	HashLockContract.deployed().then(function(instance){

		/**
		 * info about swap contract
		 */
		app.get('/api/swap', function (req, res) {
			res.send({
				address: instance.address,
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
		 * Creates a "hash lock contract" between Alice and Bob
		 */
		app.post('/api/swap/lock', function(req, res){
			var hash = req.body.hash
			var redeemer = req.body.redeemer
			var sender = req.body.sender
			var expiry = req.body.expiry
			var amount = req.body.amount
			// how to handle gas?
			instance.lock(hash, redeemer, expiry, {
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
		});

		app.listen(3000,function(){
			console.log("http://localhost:3000");
		});

	});
}catch(e){
	console.log(e);
	console.log("Try running truffle migrate.");
}
