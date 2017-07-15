var spawn = require("child_process").spawn;

// takes Alice and Bob's Zcash addrs
// Wrap the Zcash functions
module.exports = zcashFund
module.exports = Zcash_getaddr
module.exports = Zcash_make_contract

function zcashFund(){
  var str = 'bla'
  var process = spawn('python',["test.py", str]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_getaddr(){
  var process = spawn('python',["ZBXCAT/eth.py", "0"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

function Zcash_make_contract(){
  var process = spawn('python',["ZBXCAT/eth.py", "1", "contract.json"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}


// zcashFund()
// Zcash_getaddr()
Zcash_make_contract()  