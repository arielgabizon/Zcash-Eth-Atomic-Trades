$(function(){

	var m = window.location.search.match(/\??tradeId=(\d+)&?/);
	var tradeId = m[1];

	$("#signBtn").on('click',function(){
		
		$("#fundSuccessMessage").addClass("hidden");
		$("#txHash").text("");

		// TODO: sign raw tx

		// TODO: submit tx
		$.ajax({
			method: 'POST',
			url: '/api/zec/tx/fund',
			data: {
				p2sh: $("#p2sh").text(),
				amount: $("#zecAmount").val()
			}
		}).then(function(data, status, jqXHR){

			$("#txHash").text(data.tx);

			$("#fundSuccessMessage").removeClass("hidden");

		});

	});

	// get trade info from Ethereum contract
	$.ajax({
		method: 'GET',
		url: '/api/swap/get/' + tradeId
	}).then(function(data,status,jqXHR){

		for(var key in data){
			$("#"+key).text(data[key]);
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

			}else{
				for(var key in data){
					$("#"+key).text(data[key]);
				}
			}

		});	

	});

});