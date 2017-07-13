var HashLock = artifacts.require("./HashLock.sol");

contract('HashLock', function(accounts) {
  it("should be able to lock", function() {
    return HashLock.deployed().then(function(balance) {
      // TODO: implement me!
    });
  });

  it("should be not be able to unlock before block timeout", function() {
    // TODO: implement me!
  });

  it("should not be able to refund before block timeout",function(){
    // TODO: implement me!
  });
});
