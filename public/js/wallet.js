$(function(){
	
	$("#newAddressBtn").on('click',function(){
		var cipherText = localStorage.getItem($("#network").val());
    	var hdPrivKey = keys.decrypt(cipherText,$("#password").val());
    	var tradeId = nextTradeId();
    	var info = keys.newPubKey(hdPrivKey,tradeId);
    	$("#newAddressMessage")
    		.addClass("alert")
    		.addClass("alert-success")
    		.html('Successfully, generated new address: ' + info.address.toString());
	});

});