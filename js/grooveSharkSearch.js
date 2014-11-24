//Global Variables
var limit = 5;

// Interfaces with GrooveShark's API to return music results.
function getGrooveSharkInfo(userInput)
{
	var url;
	
	url = 'http://tinysong.com/s/Rush?format=json&limit=5&key=web_proggeddy
	
	getGrooveSharkArtistJSON(url);
}

// Get the artist json from GrooveShark.
function getGrooveSharkArtistJSON(url) 
{
	$.ajax({
		url:url,
		type:'GET',
		dataType: 'jsonp',
		success:successArtistCallBack,
		failure:failureArtistCallBack
	});
}