var HashLock = artifacts.require("./HashLock.sol");

contract('HashLock', function(accounts) {

  var sender = accounts[0], 
    redeemer = accounts[1],
    // sha256('cats')
    hash = "0xD936608BAAACC6B762C14B0C356026FBA3B84E77D5B22E86F2FC29D3DA09C675",
    tradeId;

  it("should not be able to create lock with zero ether", function() {

    return HashLock.deployed().then(function(instance) {
      instance.lock(hash,redeemer,4,{
        from: sender,
        value: 0
      }).then(function(result){
        assert.fail("should have reverted");
      }).catch(function(e){
        assert.isOk(e);
      });
    });

  });

  
  it("should be able to create lock with nonzero ether", function() {

    return HashLock.deployed().then(function(instance) {
      instance.lock(hash,redeemer,4,{
        from: sender,
        value: 100
      }).then(function(result){

        // check log was generated for trade
        assert.isArray(result.logs);
        assert.isTrue(result.logs.length > 0);
        assert.equal(result.logs[0].event, "newHashlock");
        var entry = result.logs[0].args;
        tradeId = entry.trade_id;
        assert.equal(entry.hash, hash.toLowerCase());
        assert.equal(entry.sender, sender);
        assert.equal(entry.redeemer, redeemer);

        // check data was stored in trades mapping
        instance.trades.call(tradeId,{ from: sender }).then(function(tradedata){
          assert.equal(tradedata[0],sender);
          assert.equal(tradedata[1],redeemer);
          assert.equal(tradedata[2],hash.toLowerCase());
          assert.equal(tradedata[3],100);
          assert.equal(tradedata[4].toNumber(),result.receipt.blockNumber+4);
        });

      });
    });

  });

  it("should be not be able to unlock if provided wrong preimage", function() {
    
    return HashLock.deployed()
      .then(function(instance){
        return instance.unlock(tradeId,'dogs');
      })
      .then(function(){
        assert.fail("should not enter here");
      })
      .catch(function(err){
        assert.isOk(err);
      });

  });
  
  it("should be not be able to unlock before block timeout", function() {

    return HashLock.deployed().then(function(instance){
      instance.unlock(tradeId,'cats').then(function(result){
        console.log(result);
        assert.isOk(result);
      });
    });

  });

  /*it("should not be able to refund before block timeout",function(){
    return HashLock.deployed().then(function(instance){
      instance.unlock(tradeId,'cats').then(function(result){
        console.log(result);
        assert.isOk(result);
      });
    });
  });*/

});