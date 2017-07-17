var child_process = require("child_process");
var Promise = require('promise');
var fs = require('fs');
var appRoot = process.env.PWD;
var xcat_dir = appRoot + '/ZBXCAT/'

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

function call(arg, contract, callback){
  spawn(["ZBXCAT/eth.py", arg, JSON.stringify(contract)]);
  var contract = JSON.parse(fs.readFileSync(xcat_dir + 'contract.json', 'utf8'));
  return callback(contract);
}

module.exports.call = call

//
// module.exports = {
//   makeContract: function(contract){
//     spawn(["ZBXCAT/eth.py", "make", JSON.stringify(contract)]);
//   },
//   fundContract: function (contract){
//     return spawn(["ZBXCAT/eth.py", "fund", JSON.stringify(contract)]);
//   },
//   getSecret: function(contract){
//     return spawn(["ZBXCAT/eth.py", "getsecret", JSON.stringify(contract)]);
//   },
//   redeem: function(contract){
//     return spawn(["ZBXCAT/eth.py", "redeem", JSON.stringify(contract)]);
//   },
//   refund: function(contract){
//     return spawn(["ZBXCAT/eth.py", "refund", JSON.stringify(contract)]);
//   }
// };
