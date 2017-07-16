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