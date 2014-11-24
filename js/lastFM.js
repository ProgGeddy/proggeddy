// Document is the top level. This says wait til the site is completely loaded before executing.
// Global Variables
var geddyCount = 0;
var chrisCount = 0;
var gPageNum = 1;
var cPageNum = 1;
var curTime = new Date().getTime() / 1000;
var weekago = new Date();
weekago.setDate(weekago.getDate() - 7);
weekago = Math.round(weekago / 1000);

$(document).ready(function() {
	getUserInfo("Geddy");
	getUserInfo("Chris");
});

function getUserInfo(name) {
	if (name == "Geddy")
		getJSON("Geddy","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=Eclisiast&artist=Rush&starttimestamp="+weekago+"&page="+gPageNum+"&endtimestamp="+curTime+"&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
	else if (name == "Chris")
		getJSON("Chris","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=raylinth&artist=Rush&starttimestamp="+weekago+"&page="+cPageNum+"&endtimestamp="+curTime+"&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
/*
	if (name == "Geddy")
		getJSON("Geddy","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=Eclisiast&artist=Rush&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
	else if (name == "Chris")
		getJSON("Chris","http://ws.audioscrobbler.com/2.0/?method=user.getartisttracks&user=raylinth&artist=Rush&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
*/
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
	playCount = 0;
	for(index in object.artisttracks.track){
		if(object.artisttracks.track[index].date.uts <= curTime && object.artisttracks.track[index].date.uts >= weekago)
		{
			playCount++;
			if(name == "Geddy")
				geddyCount++;
			else if(name == "Chris")
				chrisCount++;
			if(playCount == 50)		// If true, need to check the next pages's data returned from Last.fm
			{
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
	//if (geddyCount != 0 && chrisCount != 0)   - Originally worked but failed when Chris hadn't listened to Rush at all.
	//{
		if(geddyCount > chrisCount)
			winner = "Geddy";
		else if(chrisCount > geddyCount)
			winner = "Chris";
		else if(geddyCount == chrisCount)
			winner = "No one"
		$("#winner").text(winner);
	//}
}

function execCSS(){
	$("body").css("visibility","visible");
}

/*
function getUserInfo(name) {
	if (name == "Geddy")
		getJSON("Geddy","http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=Eclisiast&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
	else if (name == "Chris")
		getJSON("Chris","http://ws.audioscrobbler.com/2.0/?method=user.getweeklyartistchart&user=raylinth&api_key=663a3ee09f7ef3aad14740b3ac162ca0&format=json");
}

function callback(object,name) {	
	for (index in object.weeklyartistchart.artist) {
		var band = object.weeklyartistchart.artist[index];
		if (band.name == "Rush")
		{
			$("#" + name + "PlayCount").text(band.playcount);
			if(name == "Geddy")
			{
				geddyCount = band.playcount;
				determineWinner();
			}
			else if(name == "Chris")
			{
				chrisCount = band.playcount;
				determineWinner();
			}
		}
	}
}
*/
