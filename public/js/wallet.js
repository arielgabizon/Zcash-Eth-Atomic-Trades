$(function(){

    $("#createBtn").on('click',function(){

        // generate 
        var hdWallet = keys.genPrivKey($("#password").val(),$("#network").val());

        // save private key to local Storage
        var cipher = keys.encrypt(hdWallet.privkey,$("#password").val());
        localStorage.setItem($("#network").val(),cipher);

        $("#seedPhrase").text(hdWallet.code);

        $("#setupSuccessMessage").removeClass("hidden");
    });
	
	$("#newAddressBtn").on('click',function(){
		var cipherText = localStorage.getItem($("#newAddressNetwork").val());
    	var hdPrivKey = keys.decrypt(cipherText,$("#newAddressPassword").val());
		var tradeId = nextTradeId();
		console.log("new trade id:", tradeId)
    	var info = keys.newPubKey(hdPrivKey,tradeId);
    	$("#newAddressMessage")
    		.addClass("alert")
    		.addClass("alert-success")
    		.html('Successfully, generated new address: ' + info.address.toString());
	});

});