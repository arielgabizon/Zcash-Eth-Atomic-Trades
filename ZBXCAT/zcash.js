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
      var contract = JSON.parse(fs.readFileSync(xcat_dir + 'contract.json', 'utf8'));
      resolve(contract);
    });
  })
  return promise;
}


function call(arg, data){
  console.log("Data in zcash call", data)
  return spawn(["ZBXCAT/eth.py", arg, JSON.stringify(data)])
}

module.exports.call = call

// getsecret method?
