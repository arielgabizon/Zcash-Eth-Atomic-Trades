$(function(){

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

		// remove option from UI
		$("#tradeId option[value=" + tradeId + "]").remove();
	}

	function onContractReady(instance){

		var submittingUnlock = false;
		$("#unlockBtn").on('click',function(){
			$("#unlockMessage")
				.removeClass("alert")
				.removeClass("alert-danger")
				.removeClass("alert-success");
			if(!submittingUnlock){
				submittingUnlock = true;
				$(this).attr("disabled","disabled");

				var tradeId = $("#tradeId").val();
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
						$("#unlockMessage")
							.addClass("alert")
							.addClass("alert-success")
							.text("Successfully unlocked funds (tx: " + txHash + ")");

						removeTrade(tradeId);
					}
					
				});

			}
		});
	}

	function getTrades(){
		var data = localStorage.getItem("txs");
		var trades = [];
		if(data){
			trades = JSON.parse(data);
		}
		return trades;
	}

	$("#tradeId").on('change',function(){
		var trades = getTrades();
		for(var i = 0; i < trades.length; i++){
			var t = trades[i];
			if(t.tradeId == $(this).val()){

				$("#tradeTx").text(t.tx);

				// get trade info from Ethereum contract
				$.ajax({
					method: 'GET',
					url: '/api/swap/get/' + t.tradeId
				}).then(function(data,status,jqXHR){

					for(var key in data){
						$("#"+key).text(data[key]);
					}

				});
				break;
			}
		}
	});

	// toggle details link with appropriate text
    $("#tradeDetailsLink").on('click',function(){
        if($(this).text().indexOf("View") >= 0){
            $(this).text("Hide Details");
        }else{
            $(this).text("View Details");
        }       
    });

	// populate outstanding trades 
	var trades = getTrades();
	for(var i = 0; i < trades.length; i++){
		var t = trades[i];
		$("#tradeId").append('<option value="' + t.tradeId + '">' + t.tradeId + '</option>');
	}
	$("#tradeId").trigger('change');

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