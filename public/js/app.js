$(function(){

	// console.log("Testing browserify to gen password", code.toString())

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

	// prepopulate X with a random value
	$.ajax({
		method: 'GET',
		url: hostname + '/api/random'
	}).then(function(data,status,jqXHR){
		$("#randomX").val(data.random);
		updateHash();
	});

	// toggle details link with appropriate text
	$("#senderDetailsLink").on('click',function(){
		if($(this).text().indexOf("View") >= 0){
			$(this).text("Hide Details");
		}else{
			$(this).text("View Details");
		}
	});

	$("#redeemerDetailsLink").on('click',function(){
		if($(this).text().indexOf("View") >= 0){
			$(this).text("Hide Details");
		}else{
			$(this).text("View Details");
		}
	});

	$("#enterPassword").on('click', function(){
		var pw = $("#password").val();
		console.log("password", pw)
		$.ajax({
			method: 'POST',
			url: hostname + '/setup',
			data: {
				password: pw
			}
		}).then(function(data,status,jqXHR){
			if(data.error){
				console.log("ERROR")
			}else{
				console.log("SUCCESS", data)
				window.localStorage.setItem('privkey', data.privkey);
				$("#setupSuccessMessage")
					.addClass("alert")
					.addClass("alert-success")
					.text("Successfully generated wallet. Write down this seed and put it in a safe place: \n" + data.code + "\n" +
				"\n Here is a new address you can send money to in order to fund a trade: " + data.address);
			}
		}).fail(function(err){
			console.log("Fail")
		});
	})

	$("#newAddress").on('click', function(){
		var privkey = localStorage.getItem('privkey')
		console.log('privkey', privkey)
		$.ajax({
			method: 'POST',
			url: hostname + '/wallet',
			// this is bad, don't send privkey to server. bad enough to have in localstorage.
			// should move towards generating it on the fly
			data: {
				privkey: privkey
			}
		}).then(function(data,status,jqXHR){
			if(data.error){
				console.log("ERROR")
			}else{
				console.log("SUCCESS", data)
				// window.localStorage.setItem('privkey', data.privkey);
				$("#setupSuccessMessage")
					.addClass("alert")
					.addClass("alert-success")
					.text("Successfully generated a new address! \n" + data.address);
			}
		}).fail(function(err){
			console.log("Fail")
		});
	})

	var submittingLock = false;
	$("#lockBtn").on('click',function(){
		$("#lockMessage")
			.removeClass("alert")
			.removeClass("alert-danger")
			.removeClass("alert-success");
		if(!submittingLock){
			submittingLock = true;
			$(this).attr("disabled","disabled");
			$.ajax({
				method: 'POST',
				url: hostname + '/api/swap/lock',
				data: {
					sender: $("#senderAccount").val(),
					redeemer: $("#redeemerAccount").val(),
					senderZAddr: $("#senderZAddr").val(),
					redeemerZAddr: $("#redeemerZAddr").val(),
					hash: $("#hashRandomX").text(),
					amount: $("#amount").val(),
					expiry: $("#blocksToWait").val()
				}
			}).then(function(data,status,jqXHR){
				submittingLock = false;
				if(data.error){
					$("#lockMessage")
						.addClass("alert")
						.addClass("alert-danger")
						.text(data.error);
				}else{
					$("#lockMessage")
						.addClass("alert")
						.addClass("alert-success")
						.text("Successfully created hashlock contract (" + data.tradeId + ", tx: " + data.tx + ")");
				}
				$("#lockBtn").removeAttr("disabled");
			}).fail(function(err){
				$("#lockMessage")
						.addClass("alert")
						.addClass("alert-danger")
						.text(err.toString());
				submittingLock = false;
				$("#lockBtn").removeAttr("disabled");
			});
		}
	});

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
				url: hostname + '/api/swap/unlock',
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

});
