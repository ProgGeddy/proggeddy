// Global Variables
var geddyCount = 0;
var chrisCount = 0;
var gPageNum = 1;
var cPageNum = 1;
var curTime = new Date().getTime() / 1000;
var weekago = new Date();
weekago.setDate(weekago.getDate() - 7);
weekago = Math.round(weekago / 1000);

// Document is the top level. This says wait til the site is completely loaded before executing.
$(document).ready(function() {
	getUserInfo("Geddy");
	getUserInfo("Chris");
});

function getUserInfo(name) {
	if (name == "Geddy")
		getJSON("Geddy","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=Eclisiast&artist=Rush&starttimestamp="+weekago+"&page="+gPageNum+"&endtimestamp="+curTime+"&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
	else if (name == "Chris")
		getJSON("Chris","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=raylinth&artist=Rush&starttimestamp="+weekago+"&page="+cPageNum+"&endtimestamp="+curTime+"&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
}

function getJSON(name,url) {
	$.ajax({
		url:url,
		type:'GET',
		dataType: 'jsonp', 
		success:function(object){
			console.log(object);
			callback(object, name);
		},
		async:false
	});
}

// Sums up the total number of times Rush has been listened to.
function callback(object, name){
	playCount = 0;
	for(index in object.artisttracks.track){
		if(object.artisttracks.track[index].date.uts <= curTime && object.artisttracks.track[index].date.uts >= weekago)
		{
			playCount++;
			if(name == "Geddy")
				geddyCount++;
			else if(name == "Chris")
				chrisCount++;
			if(playCount == 50) {		// If true, need to check the next pages's data returned from Last.fm
				if(name == "Geddy")
					gPageNum++;
				else if(name == "Chris")
					cPageNum++;

				getUserInfo(name);
			}
		}
	}
	
	if(name == "Geddy")
	{
		$("#" + name + "PlayCount").text(geddyCount);
		determineWinner();
	}
	else if(name == "Chris")
	{
		$("#" + name + "PlayCount").text(chrisCount);
		determineWinner();
	}
}

function determineWinner(){
	if(geddyCount > chrisCount)
		winner = "Geddy is the winner.";
	else if(chrisCount > geddyCount)
		winner = "Chris is the winner.";
	else if(geddyCount == chrisCount)
		winner = "We'll call it a draw then."
	$("#lastFMWinner").text(winner);
}

function execCSS(){
	$("body").css("visibility","visible");
}