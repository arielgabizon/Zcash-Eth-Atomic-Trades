$(function(){

	var m = window.location.search.match(/\??tradeId=(\d+)&?/);
	var tradeId = m[1];

	function onContractReady(instance){
		console.log("trade 1")
		instance.trades(tradeId,function(err,data){console.log(data);})
		
		populateTradeData(instance,tradeId);

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
						amt: $("#zecAmount").text()
					}
				}).then(function(data, status, jqXHR){
					  	console.log("data.amt", data.amt);
						var p2sh = $("#p2sh").text();
						console.log("p2sh", data.p2sh);
						console.log("data", data);

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
						console.log(data);
						for(var key in data){
							console.log(data);
							$("#"+key).text(data[key]);
						}
					}
			});
	}


	// get address of hashlock contract
    // $.ajax({
    //     method: 'GET',
    //     url: '/api/swap'
    // }).then(function(data,status,jqXHR){

    //     var hashlockContract = web3.eth.contract(data.abi);

    //     var instance = hashlockContract.at(data.address);

    //     onContractReady(instance);

    // });
    getContract(onContractReady);

});
