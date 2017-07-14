var express = require('express')
var contract = require("truffle-contract");
var Web3 = require('web3');
var bodyParser = require('body-parser');

var app = express();

var json = require("./build/contracts/hashlock.json");
var HashLockContract = contract(json);

// this will let us get the data from a POST
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
HashLockContract.setProvider(provider);

HashLockContract.deployed().then(function(instance){

	app.get('/contract', function (req, res) {
		res.send({
			address: instance.address,
		});
	});

	app.post('/contract/lock', function(req, res){
		var hash = req.body.hash
		var redeemer = req.body.redeemer
		var sender = req.body.sender
		var expiry = req.body.expiry
		var amount = req.body.amount
		// how to handle gas?
		instance.lock(hash, redeemer, expiry, {from: web3.eth.defaultAccount, value: amount, gas: 1248090, function(txhash){
			// use fromBlock of when instance was deployed
			var events = instance.allEvents({fromBlock: 0, toBlock: 'latest'})
			console.log(events)
			res.send({
				{"trade_id": id, "hash": hash, "redeemer": redeemer}
			});
		}})
	});

	app.listen(3000,function(){
		console.log("http://localhost:3000");
	});

});
