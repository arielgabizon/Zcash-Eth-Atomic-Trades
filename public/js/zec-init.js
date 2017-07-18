$(function(){

	var m = window.location.search.match(/\??tradeId=(\d+)&?/);
	var tradeId = m[1];

	function onContractReady(instance){

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
				amount: $("#zecAmount").val()
			}
		}).then(function(data, status, jqXHR){
			
			$("#fundSuccessMessage").addClass("hidden");
			$("#txHash").text("");

			// TODO: submit tx
			$.ajax({
				method: 'POST',
				url: '/api/zec/tx/fund',
				data: {
					p2sh: $("#p2sh").text(),
					amount: $("#zecAmount").val()
				}
			}).then(function(data, status, jqXHR){

				instance.update(tradeId,$("#p2sh").text(),data.tx,function(err,txHash){

					$("#txHash").text(data.tx);

					$("#fundSuccessMessage").removeClass("hidden");

				});

			});

		});

		// get trade info from Ethereum contract
			$.ajax({
				method: 'GET',
				url: '/api/swap/get/' + tradeId
			}).then(function(data,status,jqXHR){
				if(data.error){
					console.log("ERROR:", data.error)
				}else{
					for(var key in data){
						console.log(data)
						$("#"+key).text(data[key]);
					}
			}

			// get raw funding transaction (ZEC)
			$.ajax({
				method: 'POST',
				url: '/api/zec/tx',
				data: {
					tradeId: tradeId
				}
			}).then(function(data,status,jqXHR){

				if(data.error){
					console.log("ERROR:", data.error)
				}else{
					for(var key in data){
						console.log(data)
						$("#"+key).text(data[key]);
					}
				}

			});

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
