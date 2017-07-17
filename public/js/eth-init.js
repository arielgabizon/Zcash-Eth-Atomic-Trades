$(function(){

    function saveTx(obj){
        var data = localStorage.getItem("txs"), arr = [];
        if(data){
            arr = JSON.parse(data);
        }
        arr.push(obj);
        localStorage.setItem("txs",JSON.stringify(arr));
    }

    function onContractReady(instance){

        var submittingLock = false;
        $("#lockBtn").on('click',function(){ 
            $("#lockMessage")
                .removeClass("alert")
                .removeClass("alert-danger")
                .removeClass("alert-success");
            if(!submittingLock){
                submittingLock = true;
                $(this).attr("disabled","disabled");

                var hash = $("#hashRandomX").text(),
                redeemer = $("#redeemerAccount").val(),
                expiry = $("#blocksToWait").val(),
                amount = $("#amount").val(),
                redeemerZAddr = $("#redeemerZAddr").val(),
                senderZAddr = $("#senderZAddr").text(),
                sender = $("#senderAccount").val();

                instance.lock(hash, redeemer, expiry, senderZAddr, redeemerZAddr, {
                    from: sender, 
                    value: amount, 
                    gas: 1248090
                },function(err,txHash){
                    if(err){
                        $("#lockMessage")
                            .addClass("alert")
                            .addClass("alert-danger")
                            .text(err.toString());
                    }else{

                        var events = instance.allEvents();

                        events.get(function(err,log){

                            for(var i = log.length-1; i >= 0; i--){
                                // check transaction hash matches
                                var entry = log[i], tradeId = entry.args.trade_id;
                                if(entry.transactionHash == txHash){
                                    saveTx({
                                        tx: txHash,
                                        tradeId: tradeId
                                    });

                                    var url = encodeURI('/trade/zec/init?tradeId='+ tradeId);
                                    $("#lockMessage")
                                        .addClass("alert")
                                        .addClass("alert-success")
                                        .html("Successfully locked funds (tradeId: " +  tradeId + '). Send <a target="_blank" href="'+ url +'">link</a> to counterparty.');
                                    break;
                                }
                            }

                        });
                
                    }
                    submittingLock = false;
                    $("#lockBtn").removeAttr("disabled");
                });
                
            }
        });

    }

    function updateHash(){
        if($("#randomX").val()){
            $.ajax({
                method: 'POST',
                url: '/api/hash',
                data: {
                    data: $("#randomX").val()
                }
            }).then(function(data,status,jqXHR){
                $("#hashRandomX").text(data.hash);
            });
        }else{
            $("#hashRandomX").text("");
        }
    }

    function randomPreimage(){
        $.ajax({
            method: 'GET',
            url: '/api/random'
        }).then(function(data,status,jqXHR){
            $("#randomX").val(data.random);
            updateHash();
        });
    }

    $("#randomX").on('blur',updateHash);
    $("#randomX").on('change',updateHash);

    // toggle details link with appropriate text
    $("#senderDetailsLink").on('click',function(){
        if($(this).text().indexOf("View") >= 0){
            $(this).text("Hide Details");
        }else{
            $(this).text("View Details");
        }       
    });

    // default to metamask default account
    $("#senderAccount").val(web3.eth.defaultAccount);

    $("#newAddressBtn").on('click',function(){
        var cipherText = localStorage.getItem("ZEC");
        var hdPrivKey = keys.decrypt(cipherText,$("#password").val());
        var tradeId = nextTradeId();
        var info = keys.newPubKey(hdPrivKey,tradeId);
        $("#senderZAddr").text(info.address.toString());
    });

    // prepopulate X with a random value
    $("#newPreimageBtn").on('click',randomPreimage);
    randomPreimage();

    // get address of hashlock contract
    $.ajax({
        method: 'GET',
        url: '/api/swap'
    }).then(function(data,status,jqXHR){

        var hashlockContract = web3.eth.contract(data.abi);

        var instance = hashlockContract.at(data.address);

        onContractReady(instance);

    });

});