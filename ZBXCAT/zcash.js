var child_process = require("child_process");
var Promise = require('promise');

// takes Alice and Bob's Zcash addrs
// Wrap the Zcash functions

function spawn(cmds){
  var promise = new Promise(function (resolve, reject) {
    var p = child_process.spawn('python3',cmds);
    var output = "";
    p.stderr.on('data',function(data){
      reject(data.toString());
    });
    p.stdout.on('data',function(data){
      output += data.toString();
    });
    p.on('close',function(code){
      resolve(output);
    });
  });
  return promise;
}

module.exports = {
  makeContract: function(contract){
    return spawn(["ZBXCAT/eth.py", "make", JSON.stringify(contract)]);
    //return spawn(["ZBXCAT/test.py"]);
  },
  fundContract: function (contract){
    return spawn(["ZBXCAT/eth.py", "fund", JSON.stringify(contract)]);
    //return spawn(["ZBXCAT/test.py"]);
  },
  getSecret: function(contract){
    return spawn(["ZBXCAT/eth.py", "getsecret", JSON.stringify(contract)]);
    //return spawn(["ZBXCAT/test.py"]);
  },
  redeem: function(contract){
    return spawn(["ZBXCAT/eth.py", "redeem", JSON.stringify(contract)]);
    //return spawn(["ZBXCAT/test.py"]);
  },
  refund: function(contract){
    return spawn(["ZBXCAT/eth.py", "refund", JSON.stringify(contract)]);
    //return spawn(["ZBXCAT/test.py"]);
  }
};
