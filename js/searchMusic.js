function searchMusic(name) {
	getJSON("http://ws.spotify.com/search/1/album.json?q="+);
}

function getJSON(name,url) {
	$.ajax({
		url:url,
		type:'GET',
		dataType: 'jsonp', // this adds &callback=? by design
		//jsonpCallback: callback,
		//crossDomain:true, 
		success:function(object){
			console.log(object);
			callback(object,name);
		},
		async:false
	});
}

// Sums up the total number of times Rush has been listened to.
function callback(object,name){

}