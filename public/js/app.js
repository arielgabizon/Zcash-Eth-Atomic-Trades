$(function(){

	var hostname = 'http://localhost:3000';

	function updateHash(){
		if($("#randomX").val()){
			$.ajax({
				method: 'POST',
				url: hostname + '/api/hash',
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

	$("#startBtn").on('click',function(){
		$.ajax({
			method: 'POST',
			url: hostname + '/api/swap/lock',
			data: {
				sender: $("#senderAccount").val(),
				redeemer: $("#redeemerAccount").val(),
				hash: $("#hashRandomX").text(),
				amount: $("#amount").val(),
				expiry: $("#blocksToWait").val()
			}
		}).then(function(data,status,jqXHR){
			if(data.error){
				$("#startMessage")
					.addClass("alert")
					.addClass("alert-danger")
					.text(data.error);
			}else{
				$("#startMessage")
					.addClass("alert")
					.addClass("alert-success")
					.text("Success! Look out for trade (" + data.tradeId + ", tx: " + data.tx + ")");
			}
		});
	});

});