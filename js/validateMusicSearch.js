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

// Check for ENTER/RETURN keypress to initiate music search.
function CheckForEnterOnMusicSearch(event) {
	if (event.keyCode === 13) {
		validateForm();
	}
}

// Validates that the user has provided text to search. And then queries API's for results.
function validateForm() {
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

		// Get GrooveShark data for the user's input.
		//getGrooveSharkInfo(userInput);
	}
}

// Prepare the urls to query LastFM for Artist/Album/Track.
function getLastFMInfo(userInput) {
	var url;

	url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	getLastFMArtistJSON(url);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	getLastFMAlbumJSON(url);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+userInput+'&api_key='+lastFMKey+'&limit='+lastFMSearchLimit+'&format=json';
	log(url);
	getLastFMTrackJSON(url);
}

// Get the artist json from LastFM.
function getLastFMArtistJSON(url) {
	$.ajax({
		url:url,
		type:'POST',
		dataType: 'jsonp',
		success:successArtistCallBack,
		failure:failureArtistCallBack
	});
}

// Get the album json from LastFM.
function getLastFMAlbumJSON(url) {
	$.ajax({
		url:url,
		type:'POST',
		dataType: 'jsonp',
		success:successAlbumCallBack,
		failure:failureAlbumCallBack
	});
}

// Get the track json from LastFM.
function getLastFMTrackJSON(url) {
	$.ajax({
		url:url,
		type:'POST',
		dataType: 'jsonp',
		success:successTrackCallBack,
		failure:failureTrackCallBack
	});
}

// This function is called if the AJAX request for Artist information from last.fm succeeds.
function successArtistCallBack(object) {
	// log(object);  For Debugging
	
	// Local variables.
	var artistName;
	var artistUrl;
	var artistImage;
	var numberOfArtistsReturned;
	
	// Get the number of artists returned.
	numberOfArtistsReturned = object.results['opensearch:totalResults'];
	
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
				log(artistName);
				artistUrl = object.results.artistmatches.artist.url;
			}
			else {
				artistName = object.results.artistmatches.artist[i].name;
				log(artistName);
				artistUrl = object.results.artistmatches.artist[i].url;
			}
			
			//log(artistImage);
			
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
function successAlbumCallBack(object) {
	log(object);  //For Debugging
	
	// Local variables.
	var albumName;
	var albumUrl;
	var albumImage;
	var numberOfAlbumsReturned;
	
	// Get the number of artists returned.
	numberOfAlbumsReturned = object.results['opensearch:totalResults'];
	
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
				log(albumName);
				albumUrl = object.results.albummatches.album.url;
			}
			else {
				albumName = object.results.albummatches.album[i].name;
				log(albumName);
				albumUrl = object.results.albummatches.album[i].url;
			}
			
			//log(albumImage);
			
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
function successTrackCallBack(object) {
	log(object);  //For Debugging
	
	// Local variables.
	var trackName;
	var trackUrl;
	var trackImage;
	var numberOfTracksReturned;
	
	// Get the number of tracks returned.
	numberOfTracksReturned = object.results['opensearch:totalResults'];
	
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
				log(trackName);
				trackUrl = object.results.trackmatches.track.url;
			}
			else {
				trackName = object.results.trackmatches.track[i].name;
				log(trackName);
				trackUrl = object.results.trackmatches.track[i].url;
			}
			
			//log(trackImage);
			
			// Track links
			$('<i><a href="'+trackUrl+'" target="_blank">'+trackName+'</a></i>').appendTo($('#lastFMTrackResults'));
			$('#lastFMTrackResults').append(' <br> ');
		}
	}
	else {
		$('#lastFMTrackResults').append('No Track By That Name');
	}
}

// This function is called if the ajax request for artist information from last.fm fails.
function failureArtistCallBack() {
	log('The attempt to request ARTIST information from Last.fm failed.!');
}

// This function is called if the ajax request for album information from last.fm fails.
function failureAlbumCallBack() {
	log('The attempt to request ALBUM information from Last.fm failed.!');
}

// This function is called if the ajax request for track information from last.fm fails.
function failureTrackCallBack() {
	log('The attempt to request TRACK information from Last.fm failed.!');
}
