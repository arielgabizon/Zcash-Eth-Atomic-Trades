$(function(){

	var m = window.location.search.match(/\??tradeId=(\d+)&?/);
	var tradeId = m[1];

	// get trade info from Ethereum contract
	$.ajax({
		method: 'GET',
		url: '/api/swap/get/' + tradeId
	}).then(function(data,status,jqXHR){

		for(var key in data){
			$("#"+key).text(data[key]);
		}

	});

	// Populate Ethereum contract transaction hash if available
	var trades = getTrades();
	for(var i = 0; i < trades.length; i++){
		var t = trades[i];
		if(t.tradeId == tradeId){
			$("#ethContractTx").text(t.tx);
			break;
		}
	}

});