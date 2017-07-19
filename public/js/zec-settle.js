$(function(){

    var m = window.location.search.match(/\??tradeId=(\d+)&?/);
    var tradeId = m[1];

    function removeTrade(tradeId){

        var trades = getTrades();
        for(var i = 0; i < trades.length; i++){
            var t = trades[i];
            if(t.tradeId == tradeId){
                trades.splice(i,1);
                break;
            }
        }
        localStorage.setItem("txs",JSON.stringify(trades));
    }

    function onContractReady(instance){

        populateTradeData(instance,tradeId);

        var submittingUnlock = false;
        $("#unlockBtn").on('click',function(){
            $("#unlockMessage")
                .removeClass("alert")
                .removeClass("alert-danger")
                .removeClass("alert-success");
            if(!submittingUnlock){
                submittingUnlock = true;
                $(this).attr("disabled","disabled");

                var preimage = $("#preimage").val();
                var fundTx = $("#fundTx").text();
                var p2sh = $("#p2sh").text();
                var senderZAddr = $("#senderZAddr").text();
                // redeem also with redeem script and p2sh in future

                $.ajax({
                    method: 'POST',
                    url: '/api/zec/tx/redeem',
                    data: {
                      preimage: preimage,
                      fundTx: fundTx,
                      p2sh: p2sh,
                      redeemer: senderZAddr,
                      tradeId: tradeId
                    }
                }).then(function(data,status,jqXHR){
                      if(data.error){
            						console.log("ERROR:", data.error)
            					} else {
                          console.log("Data in redeem UI", data)
                          console.log("Data tx", data.tx)
              						// for(var key in data){
                					// 		console.log(data)
                					// 		$("#"+key).text(data[key]);
              						// }

                          $("#unlockMessage")
                              .addClass("alert")
                              .addClass("alert-success")
                              .text("Successfully redeemed ZEC! (Redeem tx: <a href='https://explorer.testnet.z.cash/tx/'>" + data.tx + "</a>)");
            					}
                });

            }
        });
    }

    // get trade info from Ethereum contract
    $.ajax({
        method: 'GET',
        url: '/api/swap/get/' + tradeId
    }).then(function(data,status,jqXHR){
        console.log("Data from api/swap", data)
        for(var key in data){
            $("#"+key).text(data[key]);
        }

    });

    // get data for ZEC
    $.ajax({
      method: 'POST',
      url: '/api/zec/txdata',
      data: {
        tradeId: tradeId
      }
    }).then(function(data,status,jqXHR){
        if(data.error){
          console.log("ERROR:", data.error)
        }else{
          $('pre#fundTx').text(data['fund_tx']);

          for(var key in data){
            console.log(data)
            $("#"+key).text(data[key]);
          }
        }
    });

    // get address of hashlock contract
    // $.ajax({
    //     method: 'GET',
    //     url: '/api/swap'
    // }).then(function(data,status,jqXHR){

    //     var hashlockContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"trades","outputs":[{"name":"sender","type":"address"},{"name":"redeemer","type":"address"},{"name":"senderZAddr","type":"string"},{"name":"redeemerZAddr","type":"string"},{"name":"hash","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"timeoutBlock","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_redeemer","type":"address"},{"name":"_expires_in","type":"uint256"},{"name":"_sender_zaddr","type":"string"},{"name":"_redeemer_zaddr","type":"string"}],"name":"lock","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"},{"name":"_preimage","type":"string"}],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"redeemer","type":"address"}],"name":"newHashlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"preimage","type":"string"}],"name":"unlockHash","type":"event"}]);

    //     var instance = hashlockContract.at(data.address);

    //     onContractReady(instance);

    // });
    getContract(onContractReady);

});
