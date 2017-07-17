var HashLock = artifacts.require("./HashLock.sol");
var request = require('request');
var uuidv4 = require('uuid/v4');

contract('HashLock', function(accounts) {

  var sender = accounts[0],
    redeemer = accounts[1],
    // sha256('cats')
    hash = "0xD936608BAAACC6B762C14B0C356026FBA3B84E77D5B22E86F2FC29D3DA09C675",
    z1 = 'tmPCLufHVCasYhu1uUfrTr9avJGxxWZz2dD',
    z2 = 'tmCuQvGB3RiFBfwveQn5ZX5BbvCxtTh489Z';

  it("should not be able to create lock with zero ether", function() {

    return HashLock.deployed().then(function(instance) {
      instance.lock(hash,redeemer,4,z1,z2,{
        from: sender,
        value: 0,
        gas: 1248090
      }).then(function(result){
        assert.fail("should have reverted");
      }).catch(function(e){
        assert.isOk(e);
      });
    });

  });


  it("should be able to create lock with nonzero ether", function() {

    return HashLock.deployed().then(function(instance) {

      var startBalance = HashLock.web3.eth.getBalance(instance.address);
      assert.equal(startBalance.toNumber(),0);

      return instance.lock(hash,redeemer,4,z1,z2,{
        from: sender,
        gas: 1248090,
        value: 100
      }).then(function(result){

        // check log was generated for trade
        assert.isArray(result.logs);
        assert.isTrue(result.logs.length > 0);
        assert.equal(result.logs[0].event, "newHashlock");
        var entry = result.logs[0].args;
        var tradeId = entry.trade_id;
        assert.equal(entry.hash, hash.toLowerCase());
        assert.equal(entry.sender, sender);
        assert.equal(entry.redeemer, redeemer);

        // check balance of contract has increased by 100
        var endBalance = HashLock.web3.eth.getBalance(instance.address);
        assert.equal(endBalance.sub(startBalance).toNumber(),100);

        // check data was stored in trades mapping
        return instance.trades.call(tradeId,{ from: sender }).then(function(tradedata){
          assert.equal(tradedata[0],sender);
          assert.equal(tradedata[1],redeemer);
          assert.equal(tradedata[2],z1);
          assert.equal(tradedata[3],z2);
          assert.equal(tradedata[4],hash.toLowerCase());
          assert.equal(tradedata[5],100);
          assert.equal(tradedata[6].toNumber(),result.receipt.blockNumber+4);
        });

      });

    });

  });

  it("should be not be able to unlock if provided wrong preimage", function() {

    return HashLock.deployed()
      .then(function(instance){
        return instance.lock(hash,redeemer,4,z1,z2,{
          from: sender,
          gas: 1248090,
          value: 100
        });
      })
      .then(function(result){
        return instance.unlock(tradeId,'dogs');
      })
      .then(function(result){
        assert.fail("should not enter here");
      })
      .catch(function(err){
        assert.isOk(err);
      });

  });

  it("should be able to unlock before block timeout", function() {

    return HashLock.deployed().then(function(instance){

      return instance.lock(hash,redeemer,4,z1,z2,{
        from: sender,
        gas: 1248090,
        value: 100
      }).then(function(result){

        var tradeId = result.logs[0].args.trade_id;
        var startBalance = HashLock.web3.eth.getBalance(instance.address);
        var rStartBalance = HashLock.web3.eth.getBalance(redeemer);

        return instance.unlock(tradeId,'cats').then(function(result){

          // contract pays out 100
          var endBalance = HashLock.web3.eth.getBalance(instance.address);
          var diff = endBalance.sub(startBalance).toNumber();
          assert.equal(diff,-100);

          // redeemer gains 100
          var rEndBalance = HashLock.web3.eth.getBalance(redeemer);
          var diff = rEndBalance.sub(rStartBalance).toNumber();
          assert.equal(diff,100);

        });

      });

    });

  });

  it("should not be able to refund before block timeout",function(){

    return HashLock.deployed().then(function(instance){

      return instance.lock(hash,redeemer,4,z1,z2,{
        from: sender,
        gas: 1248090,
        value: 100
      }).then(function(result){

        var tradeId = result.logs[0].args.trade_id;
        return instance.refund(tradeId).then(function(result2){
          assert.fail("should not enter here");
        }).catch(function(err){
          assert.isOk(err);
        });

      });

    });
  });

  it("should be able to refund after block timeout",function(){

    return HashLock.deployed().then(function(instance){

      return instance.lock(hash,redeemer,1,z1,z2,{
        from: sender,
        gas: 1248090,
        value: 100
      }).then(function(result){

        request.post(HashLock.web3.currentProvider.provider.host,{
          jsonrpc: "2.0",
          method: "evm_mine"
        }, function(err, httpResponse, body) {

          var tradeId = result.logs[0].args.trade_id;
          instance.refund(tradeId).then(function(result2){
            assert.isTrue(result2.receipt.blockNumber-result.receipt.blockNumber >= 1);
          }).catch(function(err){
            assert.fail("should not enter here");
          });
        });
      });

    });

  });

});
