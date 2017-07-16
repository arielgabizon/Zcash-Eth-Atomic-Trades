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

});