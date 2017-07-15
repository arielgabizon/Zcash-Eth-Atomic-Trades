$(function(){

    function saveTx(obj){
        var data = localStorage.getItem("txs"), arr = [];
        if(data){
            arr = JSON.parse(data);
        }
        arr.push(obj);
        localStorage.setItem("txs",JSON.stringify(arr));
    }

    function createP2SH(tradeId){

        $.ajax({
            method: 'POST',
            url: '/api/zec/lock',
            data: {
                tradeId: tradeId.toString()
            }
        }).then(function(data,status,jqXHR){
            
            if(data.error){
                $("#lockMessage")
                    .addClass("alert")
                    .addClass("alert-danger")
                    .text(data.error);
            }else{
                var url = encodeURI('/trade/review?tradeId='+ tradeId+'&p2sh=' + data.address);
                $("#lockMessage")
                    .addClass("alert")
                    .addClass("alert-success")
                    .html("Successfully locked funds (tradeId: " +  tradeId + '). Send <a target="_blank" href="'+ url +'">link</a> to Bob.');
            }
        
        });

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
                senderZAddr = $("#senderZAddr").val(),
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

                        events.watch(function(err,log){

                            // check transaction hash matches
                            if(log.transactionHash == txHash){
                                saveTx({
                                    tx: txHash,
                                    tradeId: log.args.trade_id
                                });

                                events.stopWatching();

                                createP2SH(log.args.trade_id, txHash);
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

    // prepopulate X with a random value
    $.ajax({
        method: 'GET',
        url: '/api/random'
    }).then(function(data,status,jqXHR){
        $("#randomX").val(data.random);
        updateHash();
    });

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