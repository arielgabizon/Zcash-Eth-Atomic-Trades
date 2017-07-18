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

        $('#prepTrade').on('click', function(){

            var hash = $("#hashRandomX").text();

            if(hash.length == 0 || $("#randomX").val().length == 0){
                $("#preimageRequiredError").removeClass("hidden");
                return;
            }

            $.ajax({
                method: 'POST',
                url: '/api/zec/p2sh',
                data: {
                    ethBlocks: $("#blocksToWait").val(),
                    initiator: $("#senderZAddr").val(),
                    fulfiller: $("#redeemerZAddr").val(),
                    hash: hash
                }
            }).then(function(data,status,jqXHR){
                if(data.error){
                  console.log("ERROR", data.error)
                }else{
                  console.log("Success", data.p2sh)
                  $("#lockMessage")
                      .addClass("alert")
                      .addClass("alert-success")
                      .html("Generated Zcash p2sh: <pre>" + data.redeemScript + "</pre>");
                }
            });
        })

        var submittingLock = false;
        $("#lockBtn").on('click',function(){

            var hash = $("#hashRandomX").text();

            if(hash.length == 0 || $("#randomX").val().length == 0){
                $("#preimageRequiredError").removeClass("hidden");
                return;
            }

            $("#lockMessage")
                .removeClass("alert")
                .removeClass("alert-danger")
                .removeClass("alert-success");
            if(!submittingLock){
                submittingLock = true;
                $(this).attr("disabled","disabled");

                var redeemer = $("#redeemerAccount").val(),
                expiry = $("#blocksToWait").val(),
                amount = $("#amount").val(),
                zecRedeemScript = $('#lockMessage pre').text(),
                zecAmount = $('#zecAmount').val(),
                redeemerZAddr = $("#redeemerZAddr").val(),
                senderZAddr = $("#senderZAddr").val(),
                sender = $("#senderAccount").val();

                instance.lock(
                    hash,
                    redeemer,
                    expiry,
                    senderZAddr,
                    redeemerZAddr,
                    zecRedeemScript,
                    zecAmount,
                {
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
        $.ajax({
            method: 'POST',
            url: '/api/zec/address',
            data: {
                role: 'initiator'
            }
        }).then(function(data,status,jqXHR){
            if(data.error){
                console.log("ERROR:", data.error)
            } else{
                $("#senderZAddr").val(data['address']);
            }
        });
    });

    // prepopulate X with a random value
    $("#newPreimageBtn").on('click',function(){
        $.ajax({
            method: 'GET',
            url: '/api/random'
        }).then(function(data,status,jqXHR){
            $("#randomX").val(data.random);
            updateHash();
        });
    });

    // get address of hashlock contract
    $.ajax({
        method: 'GET',
        url: '/api/swap'
    }).then(function(data,status,jqXHR){

        var hashlockContract = web3.eth.contract(data.abi);

        var instance = hashlockContract.at(data.address);

        onContractReady(instance);

        // default to metamask default account
        $("#senderAccount").val(web3.eth.defaultAccount);

        // prepopulate preimage
        $("#newPreimageBtn").trigger('click');
    });

});
