
var express = require('express')
var contract = require("truffle-contract");
var Web3 = require('web3');

var app = express();

var json = require("./build/contracts/hashlock.json");
var HashLockContract = contract(json);

var provider = new Web3.providers.HttpProvider("http://localhost:8545");
HashLockContract.setProvider(provider);

HashLockContract.deployed().then(function(instance){

	app.get('/contract', function (req, res) {
		res.send({
			address: instance.address
		});
	});

	app.listen(3000,function(){
		console.log("http://localhost:3000");
	});

});