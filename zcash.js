var spawn = require("child_process").spawn;

// takes Alice and Bob's Zcash addrs

module.exports = zcashFund

function zcashFund(){
  var process = spawn('python',["test.py", "tomatoes"]);
  console.log('in fund')
  process.stdout.on('data', function (data){
    console.log("data", data.toString())
  });
}

zcashFund()
