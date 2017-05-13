// Global Variables 
var lastFMKey = '663a3ee09f7ef3aad14740b3ac162ca0'; 
var lastFMSearchLimit = 5; 

// Call this function to send the parameter to the console for debugging. 
function log(message) {
	console.log(message);
}

// Event listener for ENTER/RETURN on text field. 
$(document).ready(function() {
	$("#userInput").keypress(CheckForEnterOnMusicSearch);
});

// Check for ENTER/RETURN key press to initiate music search. 
function CheckForEnterOnMusicSearch(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		ValidateLastFMForm();
	}
}

// Validates that the user has provided text to search. And then queries API's for results. 
function ValidateLastFMForm() {
	// Grab the user's input.
	var userInput = $('#userInput').val();
	
	// Check to see if the user's input is null.
	if (userInput==null || userInput=="") {
  		$('#searchMessage').html('Must specify an artist/album/track to search.')//.css('color','red');
		$('#userInput').css('background-color', 'FFB2B2');
		// Clear any previous results.
		$('#lastFMArtistResults').empty();
		$('#lastFMAlbumResults').empty();
		$('#lastFMTrackResults').empty();
  	}
	else {
		// Clear the search message from the screen.
		$('#searchMessage').empty();
		$('#userInput').css('background-color', 'FFFFFF');
		
		// Clear any previous results.
		$('#lastFMArtistResults').empty();
		$('#lastFMAlbumResults').empty();
		$('#lastFMTrackResults').empty();
		
		// Encode the users input to handle escape characters.
		userInput = encodeURI(userInput);
		
		// Get Last.fm data for the user's input.
		getLastFMInfo(userInput);
	}
}

// Prepare the urls to query LastFM for Artist/Album/Track. 
function getLastFMInfo(userInput) {
	var url;
	url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	GetLastFMJSON(url, SuccessArtistCallBack);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	GetLastFMJSON(url, SuccessAlbumCallBack);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	GetLastFMJSON(url, SuccessTrackCallBack);
}

// Get JSON from LastFM. 
function GetLastFMJSON(url, SuccessCallBack) {
	$.ajax({
		url:url,
		type:'POST',
		dataType: 'jsonp',
		success:SuccessCallBack,
		failure:FailureCallBack
	});
}

// This function is called if the AJAX request for Artist information from last.fm succeeds. 
function SuccessArtistCallBack(object) {
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
				click: LastFMButtonClicked
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

// This function is called if the AJAX request for Album information from last.fm succeeds. 
function SuccessAlbumCallBack(object) {
	// Local variables.
	var albumName;
	var albumUrl;
	var albumImage;
	var numberOfAlbumsReturned;
	
	// Get the number of artists returned.
	numberOfAlbumsReturned = object.results.albummatches.album.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfAlbumsReturned > lastFMSearchLimit) {
		numberOfAlbumsReturned = lastFMSearchLimit;
	}
	
	$('#lastFMAlbumResults').append('<b>Album Results:</b><br>')
	
	// Check to make sure there were albums in the results.
	if(numberOfAlbumsReturned > 0) {
		// Get album information for the first 5 albums returned from Last.fm.
		for(var i = 0; i < numberOfAlbumsReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfAlbumsReturned == 1) {
				albumName = object.results.albummatches.album.name;
				albumUrl = object.results.albummatches.album.url;
			}
			else {
				albumName = object.results.albummatches.album[i].name;
				albumUrl = object.results.albummatches.album[i].url;
			}
			
			// Album buttons
			$('<button/>', {
				text: albumName,
				id: albumName,
				click: LastFMButtonClicked
			}).appendTo($('#lastFMAlbumResults'));

			// Album links
			$('<i><a href="'+albumUrl+'" target="_blank">'+albumName+'</a></i>').appendTo($('#lastFMAlbumResults'));
			$('#lastFMAlbumResults').append(' <br> ');
		}
	}
	else {
		$('#lastFMAlbumResults').append('No Album By That Name');
	}
}

// This function is called if the AJAX request for Track information from last.fm succeeds. 
function SuccessTrackCallBack(object) {
	// Local variables.
	var trackName;
	var trackUrl;
	var trackImage;
	var numberOfTracksReturned;
	
	// Get the number of tracks returned.
	numberOfTracksReturned = object.results.trackmatches.track.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfTracksReturned > lastFMSearchLimit) {
		numberOfTracksReturned = lastFMSearchLimit;
	}
	
	$('#lastFMTrackResults').append('<b>Track Results:</b><br>')
	
	// Check to make sure there were tracks in the results.
	if(numberOfTracksReturned > 0) {
		// Get track information for the first 5 tracks returned from Last.fm.
		for(var i = 0; i < numberOfTracksReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfTracksReturned == 1) {
				trackName = object.results.trackmatches.track.name;
				trackUrl = object.results.trackmatches.track.url;
			}
			else {
				trackName = object.results.trackmatches.track[i].name;
				trackUrl = object.results.trackmatches.track[i].url;
			}

			// Track buttons
			$('<button/>', {
				text: trackName,
				id: trackName,
				click: LastFMButtonClicked
			}).appendTo($('#lastFMTrackResults'));
			
			// Track links
			$('<i><a href="'+trackUrl+'" target="_blank">'+trackName+'</a></i>').appendTo($('#lastFMTrackResults'));
			$('#lastFMTrackResults').append(' <br> ');
		}
	}
	else {
		$('#lastFMTrackResults').append('No Track By That Name');
	}
}

// This function is called if the ajax request for information from last.fm fails. 
function FailureCallBack() {
	log('The attempt to request information from Last.fm failed.!');
}

function LastFMButtonClicked() {
	alert('Works!');
}
