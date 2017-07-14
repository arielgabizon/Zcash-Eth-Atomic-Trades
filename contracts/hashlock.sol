pragma solidity ^0.4.11;

contract hashlock {

    struct tradeData {
        address sender;
        address redeemer;
        bytes32 hash;
        uint amount;
        uint timeoutBlock;
    }
      
    uint nextTradeId;

    event newHashlock(address sender, uint trade_id, bytes32 hash, address redeemer);
    event unlockHash(uint trade_id, string preimage);

    mapping (uint => tradeData) public trades;
      
    function hashlock(){
        nextTradeId = 0;
    }

    function lock(bytes32 _hash, address _redeemer, uint _expires_in) payable {
        
        if(msg.value <= 0){
            throw;
        }

        nextTradeId++;
        trades[nextTradeId].sender = msg.sender;
        trades[nextTradeId].redeemer = _redeemer;
        trades[nextTradeId].hash = _hash;
        trades[nextTradeId].amount = msg.value;
        trades[nextTradeId].timeoutBlock = block.number + _expires_in;
        
        newHashlock(msg.sender, nextTradeId, _hash, trades[nextTradeId].redeemer);
    }

    function unlock(uint _trade_id, string _preimage) public {

        if (sha256(_preimage) != trades[_trade_id].hash) {
            // can only withdraw if has correct preimage
            throw;
        }
        if (block.number >= trades[_trade_id].timeoutBlock ) {
            // can only withdraw before block timeout
            throw;
        }
        trades[_trade_id].redeemer.transfer(trades[_trade_id].amount);
        unlockHash(_trade_id, _preimage);
    }

      /* can only refund to msg sender, after timeout */
    function refund(uint _trade_id) {

        if (block.number < trades[_trade_id].timeoutBlock ) {
            // can only withdraw after block timeout
            throw;
        }
        // if timeout has passed, refund initiator 
        trades[_trade_id].sender.transfer(trades[_trade_id].amount);
        // delete the trades[msg.sender] from the mapping 
        delete trades[_trade_id];
      }
}