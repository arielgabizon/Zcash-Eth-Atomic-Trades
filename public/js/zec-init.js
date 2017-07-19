$(function(){

	var m = window.location.search.match(/\??tradeId=(\d+)&?/);
	var tradeId = m[1];

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

		$("#signBtn").on('click',function(){

				// TODO: sign raw tx
				var p2sh = $("#p2sh").text();
				console.log(p2sh)

				// TODO: submit tx
				$.ajax({
					method: 'POST',
					url: '/api/zec/tx/fund',
					data: {
						p2sh: p2sh,
						amount: $("#zecAmount").text()
					}
				}).then(function(data, status, jqXHR){
					  console.log("data.tx", data.tx)
						var p2sh = $("#p2sh").text();
						console.log("p2sh", p2sh)
						console.log('tradeId', tradeId)
						$("#fundSuccessMessage").addClass("hidden");
						$("#txHash").text("");

						instance.update(tradeId, p2sh , data.tx , data.redeemScript, function(err,txHash){
								if(err){
									console.log("ERROR", err)
										$("#lockMessage")
												.addClass("alert")
												.addClass("alert-danger")
												.text(err.toString());
								}else{
									console.log("Successfully updated instance with fundTx: ", data.tx)
									$("#txHash").text(data.tx);
									$("#fundTx").text(data.tx);
									$("#fundSuccessMessage").removeClass("hidden");
								}
						});

				});

		});

		// get trade info from Ethereum contract
			// $.ajax({
			// 	method: 'GET',
			// 	url: '/api/swap/get/' + tradeId
			// }).then(function(data,status,jqXHR){
			// 		if(data.error){
			// 			console.log("ERROR:", data.error)
			// 		}else{
			// 			for(var key in data){
			// 				console.log(data)
			// 				$("#"+key).text(data[key]);
			// 			}
			// 		}
			// })

			// get data for funding transaction (ZEC)
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
						$('#zecAmount').val(data['zecAmount']);

						for(var key in data){
							console.log(data)
							$("#"+key).text(data[key]);
						}
					}
			});
	}


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
