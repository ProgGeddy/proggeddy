// Global Variables 
var gw2Key = 'AC8EDD7B-09E6-564C-AE95-C612C0E080E8E96AA0B7-A423-44BC-9E3C-5BCF0D83DB0E'; 

$(document).ready(function() {
	GetGW2Info();
});

// Call this function to send the parameter to the console for debugging. 
function log(message) {
	console.log(message);
}

// Set up constant GW2 values for URL creation. 
function GetGW2Info() {
	// Constants
	var _TIMEOUT = 4000; // set timeout to 4s
	var _SUPPORTED_LANGUAGES = ["en", "fr", "de", "es"];
	var _USE_JQUERY = false;   // use $.ajax or XHR/XDR directly
	var DEFAULT_LANGUAGE = 'en'; // default language is 'en'
	//var DEFAULT_WORLD = 1009; // Fort Aspenwood as my default world

	// ArenaNet Guild Wars 2 API Constants
	var URL = "https://api.guildwars2.com/v2/";
	var ACCOUNT = "account";
	var ACCOUNT_ID = "";
	
	var encodedURL = encodeURI(URL);
	
	/* var EVENT_API = 'events.json?';
	var WORLD_NAMES_API = 'world_names.json?';
	var MAP_NAMES_API = 'map_names.json?';
	var EVENT_NAMES_API = 'event_names.json?';
	var LANG_PARA = 'lang=';
	var WORLD_ID_PARA = 'world_id=';
	var MAP_ID_PARA = 'map_id=';
	var EVENT_ID_PARA = 'event_id=';

	// member variables
	var _worldNames = _mapNames = _eventNames = null;
	var _data = {};
	var _callback, _callback_obj; */
	
	log(URL);
	HttpGet(URL + ACCOUNT);
}

function HttpGet(arg) {
	$.ajax({
		url:arg
		type:'GET',
		dataType: 'jsonp',
		success:GetAccountInfo,
		failure:FailedToGetAccountInfo
	});
}

// This function gets GW2 account information. 
function GetAccountInfo(object) {
	// Local variables.
	var artistName;
	var artistUrl;
	var artistImage;
	var numberOfArtistsReturned;
	
	// Get the number of artists returned.
	numberOfArtistsReturned = object.results.artistmatches.artist.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfArtistsReturned > lastFMSearchLimit) {
		numberOfArtistsReturned = lastFMSearchLimit;
	}
	
	$('#lastFMArtistResults').append('<b>Artist Results:</b><br>')
	
	// Check to make sure there were artists in the results.
	if(numberOfArtistsReturned > 0) {
		// Get artist information for the first 5 artists returned from Last.fm.
		for(var i = 0; i < numberOfArtistsReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfArtistsReturned == 1) {
				artistName = object.results.artistmatches.artist.name;
				artistUrl = object.results.artistmatches.artist.url;
			}
			else {
				artistName = object.results.artistmatches.artist[i].name;
				artistUrl = object.results.artistmatches.artist[i].url;
			}
			
			// Artist buttons
			$('<button/>', {
				text: artistName,
				id: artistName,
				click: function () { alert('Works!'); }
			}).appendTo($('#lastFMArtistResults'));
			
			// Artist links
			$('<i><a href="'+artistUrl+'" target="_blank">'+artistName+'</a></i>').appendTo($('#lastFMArtistResults'));
			$('#lastFMArtistResults').append(' <br> ');
		}
	}
	else
	{
		$('#lastFMArtistResults').append('No Band By That Name');
	}
}

// This function is called if the ajax request for account information from GW2 fails. 
function FailedToGetAccountInfo() {
	log('The attempt to request ACCOUNT information from GW2 failed.!');
}