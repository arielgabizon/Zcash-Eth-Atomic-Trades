var spawn = require("child_process").spawn;
var fs = require('fs');

var appRoot = process.env.PWD;
var xcat = appRoot + '/ZBXCAT/'

function Zcash_make_contract(callback){
  console.log('in Zcash make contract')
  var process = spawn('python',[xcat + 'eth.py', "make"]);
  process.stdout.on('data', function (data){
    console.log("Printing data in make contract:", data.toString())
  });
  process.on('close', function(code) {
      var contract = JSON.parse(fs.readFileSync(xcat + 'contract.json', 'utf8'));
      console.log("Contract reading in output", contract)
      return callback(contract);
  });
}

function Zcash_fund(){
  var process = spawn('python',[xcat + 'eth.py', "fund"]);
  console.log("in Zcash_fund js")
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}
function Zcash_get_secret(){
  var str = 'bla'
  var process = spawn('python',[xcat + 'eth.py', "getsecret"]);
  console.log('in fund 3')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_redeem(){
  var process = spawn('python',[xcat + 'eth.py', "redeem"]);
  console.log('in redeem js')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_refund(){
  var process = spawn('python',[xcat + 'eth.py', "refund"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}


// Zcash_make_contract()
// Zcash_fund()
// Zcash_redeem()
// Zcash_get_secret()
//Zcash_refund()


// takes Alice and Bob's Zcash addrs
// Wrap the Zcash functions
module.exports.Zcash_fund = Zcash_fund
module.exports.Zcash_make_contract = Zcash_make_contract
module.exports.Zcash_get_secret = Zcash_get_secret
module.exports.Zcash_redeem = Zcash_redeem
module.exports.Zcash_refund = Zcash_refund
