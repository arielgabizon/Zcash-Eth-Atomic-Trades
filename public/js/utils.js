function getTrades(){
	var data = localStorage.getItem("txs");
	var trades = [];
	if(data){
		trades = JSON.parse(data);
	}
	return trades;
}

function nextTradeId(){
	var id = localStorage.getItem("nextTradeId");
	if(!id){
		id = 1;
	}else{
		id = parseInt(id);
	}
	localStorage.setItem("nextTradeId",id+1);
	return id;
}

// get address of hashlock contract
function getContract(onReady){
	
    $.ajax({
        method: 'GET',
        url: '/api/swap'
    }).then(function(data,status,jqXHR){

        var hashlockContract = web3.eth.contract(data.abi);

        var instance = hashlockContract.at(data.address);

        onReady(instance);

    });
}

function populateTradeData(instance,tradeId){
	instance.trades(tradeId,function(err,tradeData){
        console.log(tradeData);
        $("#sender").text(tradeData[0]);
        $("#redeemer").text(tradeData[1]);
        $("#senderZAddr").text(tradeData[2]);
        $("#redeemerZAddr").text(tradeData[3]);
        $("#hash").text(tradeData[4]);
        $("#amount").text(tradeData[5]);
        $("#timeoutBlock").text(tradeData[6]);
        $("#fundTx").text(tradeData[7]);
    //  $("#p2sh").text(tradeData[8]);
        $("#redeemScript").text(tradeData[9]);
        $("#zecAmount").text(tradeData[10]);
    });
}