var spawn = require("child_process").spawn;

// takes Alice and Bob's Zcash addrs
// Wrap the Zcash functions
module.exports = Zcash_fund
module.exports = Zcash_getaddr
module.exports = Zcash_make_contract
module.exports = Zcash_get_secret
module.exports = Zcash_redeem
module.exports = Zcash_refund

function Zcash_getaddr(){
  var str = 'bla'
  var process = spawn('python',["ZBXCAT/eth.py", "0"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_make_contract(){
  var process = spawn('python',["ZBXCAT/eth.py", "1","contract.json"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_fund(){
  var process = spawn('python',["ZBXCAT/eth.py", "2", "contract.json"]);
  console.log("in Zcash_fund js")
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}
function Zcash_get_secret(){
  var str = 'bla'
  var process = spawn('python',["ZBXCAT/eth.py", "3", "contract.json"]);
  console.log('in fund 3')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_redeem(){
  var process = spawn('python',["ZBXCAT/eth.py", "4","contract.json"]);
  console.log('in redeem js')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_refund(){
  var process = spawn('python',["ZBXCAT/eth.py", "5","contract.json"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}


Zcash_fund()
// Zcash_getaddr()
// Zcash_redeem()  