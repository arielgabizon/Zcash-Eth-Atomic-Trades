$(function(){

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
				$.ajax({
					method: 'POST',
					url: '/api/swap/unlock',
					data: {
						redeemer: $("#redeemerAccount").val(),
						tradeId: $("#tradeId").val(),
						preimage: $("#preimage").val()
					}
				}).then(function(data,status,jqXHR){
					submittingUnlock = false;
					if(data.error){
						$("#unlockMessage")
							.addClass("alert")
							.addClass("alert-danger")
							.text(data.error);
					}else{
						$("#unlockMessage")
							.addClass("alert")
							.addClass("alert-success")
							.text("Successfully unlocked funds (tx: " + data.tx + ")");
					}
					$("#unlockBtn").removeAttr("disabled");
				}).fail(function(err){
					$("#unlockMessage")
							.addClass("alert")
							.addClass("alert-danger")
							.text(err.toString());
					submittingUnlock = false;
					$("#unlockBtn").removeAttr("disabled");
				});
			}
		});
	}


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