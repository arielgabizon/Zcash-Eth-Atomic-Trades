pragma solidity ^0.4.13;

contract hashlock {

      struct tradeData {
        address redeemer;
        bytes32 hash;
        uint amount;
        uint timeoutBlock;
      }

      event newHashlock(string, bytes32);
      event unlockHash(string, string);

      mapping (address => tradeData) public trades;

      function lock(bytes32 _hash, address _redeemer) payable {
          trades[msg.sender].redeemer = _redeemer;
          trades[msg.sender].hash = _hash;
          trades[msg.sender].amount = msg.value;
          trades[msg.sender].timeoutBlock = block.number + 4;

          newHashlock("New hashlock initiated:", _hash);
      }

      /* must know who initiator was, trade is saved under their address */
      function unlock(string _preimage, address _initiator) public {

          if (sha256(_preimage) == trades[_initiator].hash) {
            /* can only withdraw before timeoutBlock set at lock */
            if (block.number < trades[_initiator].timeoutBlock ) {
              /* only address specified as redeemer in trades[_initiator] can withdraw */
              if (msg.sender == trades[_initiator].redeemer) {
                  msg.sender.transfer(trades[_initiator].amount);
                  unlockHash("Hash successfully unlocked with preimage: ", _preimage);
              }
            }
          }
      }

      /* can only refund to msg sender, after timeout */
      function refund() {

          if (block.number >= trades[msg.sender].timeoutBlock ) {
            /* if timeout has passed, refund initiator */
            msg.sender.transfer(trades[msg.sender].amount);
            /* delete the trades[msg.sender] from the mapping */
            delete trades[msg.sender];
          }
      }
}
