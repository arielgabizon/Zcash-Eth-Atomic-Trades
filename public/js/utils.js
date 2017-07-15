function getTrades(){
	var data = localStorage.getItem("txs");
	var trades = [];
	if(data){
		trades = JSON.parse(data);
	}
	return trades;
}