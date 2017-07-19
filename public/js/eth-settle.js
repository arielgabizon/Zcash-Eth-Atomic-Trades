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

        instance.trades(tradeId,function(err,tradeData){
            console.log(tradeData)
            $("#sender").text(tradeData[0]);
            $("#redeemer").text(tradeData[1]);
            $("#senderZAddr").text(tradeData[2]);
            $("#redeemerZAddr").text(tradeData[3]);
            $("#hash").text(tradeData[4]);
            $("#amount").text(tradeData[5]);
            $("#timeoutBlock").text(tradeData[6]);
            $("#fundTx").text(tradeData[7]);
            $("#p2sh").text(tradeData[8]);
            $("#redeemScript").text(tradeData[9]);
            $("#zecAmount").text(tradeData[10]);
        });

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

                instance.unlock(tradeId, preimage, {
                    from: $("#redeemer").val(),
                    gas: 1248090
                },function(err,txHash){

                    submittingUnlock = false;
                    $("#unlockBtn").removeAttr("disabled");

                    if(err){
                        $("#unlockMessage")
                            .addClass("alert")
                            .addClass("alert-danger")
                            .text(err.toString());
                    }else{
                        var events = instance.allEvents();

                        events.get(function(err2,log){

                            for(var i = log.length-1; i >= 0; i--){
                                // check transaction hash matches
                                var entry = log[i];
                                if(entry.transactionHash == txHash){

                                    removeTrade(tradeId);

                                    $("#unlockMessage")
                                        .addClass("alert")
                                        .addClass("alert-success")
                                        .text("Successfully unlocked funds (tx: " + txHash + ")");

                                    break;
                                }
                            }

                        });

                    }

                });

            }
        });
    }

    // get trade info from Ethereum contract
    // $.ajax({
    //     method: 'GET',
    //     url: '/api/swap/get/' + tradeId
    // }).then(function(data,status,jqXHR){
    //     console.log("Data from api/swap", data)
    //     for(var key in data){
    //         $("#"+key).text(data[key]);
    //     }

    // });

    // get address of hashlock contract
    $.ajax({
        method: 'GET',
        url: '/api/swap'
    }).then(function(data,status,jqXHR){

        var hashlockContract = web3.eth.contract([{"constant":true,"inputs":[{"name":"","type":"uint256"}],"name":"trades","outputs":[{"name":"sender","type":"address"},{"name":"redeemer","type":"address"},{"name":"senderZAddr","type":"string"},{"name":"redeemerZAddr","type":"string"},{"name":"hash","type":"bytes32"},{"name":"amount","type":"uint256"},{"name":"timeoutBlock","type":"uint256"}],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"}],"name":"refund","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"_hash","type":"bytes32"},{"name":"_redeemer","type":"address"},{"name":"_expires_in","type":"uint256"},{"name":"_sender_zaddr","type":"string"},{"name":"_redeemer_zaddr","type":"string"}],"name":"lock","outputs":[],"payable":true,"type":"function"},{"constant":false,"inputs":[{"name":"_trade_id","type":"uint256"},{"name":"_preimage","type":"string"}],"name":"unlock","outputs":[],"payable":false,"type":"function"},{"inputs":[],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":false,"name":"sender","type":"address"},{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"hash","type":"bytes32"},{"indexed":false,"name":"redeemer","type":"address"}],"name":"newHashlock","type":"event"},{"anonymous":false,"inputs":[{"indexed":false,"name":"trade_id","type":"uint256"},{"indexed":false,"name":"preimage","type":"string"}],"name":"unlockHash","type":"event"}]);

        var instance = hashlockContract.at(data.address);

        onContractReady(instance);

    });

});
