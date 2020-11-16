// Global Variables 
var _lastFMKey = '663a3ee09f7ef3aad14740b3ac162ca0'; 
var _lastFMSearchLimit = 5; 

// Call this function to send the parameter to the console for debugging. 
function log(message) {
	console.log(message);
}

// This function is called if the ajax request for information from Last.fm fails. 
function failureCallBack() {
	log('The attempt to request information from Last.fm failed.!');
}

// Event listener for ENTER/RETURN on text field. 
$(document).ready(function() {
	$("#userInput").keypress(checkForEnterOnMusicSearch);
});

// Check for ENTER/RETURN key press to initiate music search. 
function checkForEnterOnMusicSearch(event) {
	if (event.keyCode === 13) {
		event.preventDefault();
		validateLastFMForm();
	}
}

// Validates that the user has provided text to search. And then queries API's for results. 
function validateLastFMForm() {
	// Grab the user's input.
	let userInput = $('#userInput').val();
	
	// Check to see if the user's input is null.
	if (userInput==null || userInput=="") {
  		$('#searchMessage').html('Must specify an artist/album/track to search.').css('color','red');
		
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
		userInput = encodeURIComponent(userInput);
		
		// Get Last.fm data for the user's input.
		getLastFMInfo(userInput);
	}
}

// Prepare the urls to query LastFM for Artist/Album/Track. 
function getLastFMInfo(userInput) {
	let url;
	url = 'http://ws.audioscrobbler.com/2.0/?method=artist.search&artist='+userInput+'&api_key='+_lastFMKey+'&limit='+_lastFMSearchLimit+'&format=json';
	getLastFMJSON(url, successArtistCallBack);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=album.search&album='+userInput+'&api_key='+_lastFMKey+'&limit='+_lastFMSearchLimit+'&format=json';
	getLastFMJSON(url, successAlbumCallBack);
	
	url = 'http://ws.audioscrobbler.com/2.0/?method=track.search&track='+userInput+'&api_key='+_lastFMKey+'&limit='+_lastFMSearchLimit+'&format=json';
	getLastFMJSON(url, successTrackCallBack);
}

// Get JSON from LastFM. 
function getLastFMJSON(url, successCallBack) {
	$.ajax({
		url: url,
		type: 'POST',
		dataType: 'jsonp',
		success: successCallBack,
		failure: failureCallBack
	});
}

// This function is called if the AJAX request for Artist information from last.fm succeeds. 
function successArtistCallBack(artist) {
	let artistName;
	let artistUrl;
	let numberOfArtistsReturned;
	
	// Get the number of artists returned.
	numberOfArtistsReturned = artist.results.artistmatches.artist.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfArtistsReturned > _lastFMSearchLimit) {
		numberOfArtistsReturned = _lastFMSearchLimit;
	}
	
	$('#lastFMArtistResults').append('<b>Artist Results:</b><br>')
	
	// Check to make sure there were artists in the results.
	if(numberOfArtistsReturned > 0) {
		// Get artist information for the first 5 artists returned from Last.fm.
		for(var i = 0; i < numberOfArtistsReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfArtistsReturned == 1) {
				artistName = artist.results.artistmatches.artist.name;
				artistUrl = artist.results.artistmatches.artist.url;
			}
			else {
				artistName = artist.results.artistmatches.artist[i].name;
				artistUrl = artist.results.artistmatches.artist[i].url;
			}
			
			// Artist buttons
			$('<button/>', {
				text: artistName,
				id: artistName,
				click: artistButtonClicked,
			}).appendTo($('#lastFMArtistResults'));
			
			$('#lastFMArtistResults').append(' <br> ');
		}
	}
	else
	{
		$('#lastFMArtistResults').append('No Artist By That Name');
	}
}

// This function is called if the AJAX request for Album information from last.fm succeeds. 
function successAlbumCallBack(album) {
	let albumName;
	let albumUrl;
	let numberOfAlbumsReturned;
	let artistName;
	
	// Get the number of artists returned.
	numberOfAlbumsReturned = album.results.albummatches.album.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfAlbumsReturned > _lastFMSearchLimit) {
		numberOfAlbumsReturned = _lastFMSearchLimit;
	}
	
	$('#lastFMAlbumResults').append('<b>Album Results:</b><br>')
	
	// Check to make sure there were albums in the results.
	if(numberOfAlbumsReturned > 0) {
		// Get album information for the first 5 albums returned from Last.fm.
		for(var i = 0; i < numberOfAlbumsReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfAlbumsReturned == 1) {
				albumName = album.results.albummatches.album.name;
				albumUrl = album.results.albummatches.album.url;
				artistName = album.results.albummatches.album.artist;
			}
			else {
				albumName = album.results.albummatches.album[i].name;
				albumUrl = album.results.albummatches.album[i].url;
				artistName = album.results.albummatches.album[i].artist;
			}
			
			// Album buttons
			$('<button/>', {
				text: albumName,
				id: albumName,
				click: albumButtonClicked,
				'data-artistName': artistName
			}).appendTo($('#lastFMAlbumResults'));

			$('#lastFMAlbumResults').append('<br>');
		}
	}
	else {
		$('#lastFMAlbumResults').append('No Album By That Name');
	}
}

// This function is called if the AJAX request for Track information from last.fm succeeds. 
function successTrackCallBack(track) {
	let trackName;
	let trackUrl;
	let numberOfTracksReturned;
	let artistName;
	
	// Get the number of tracks returned.
	numberOfTracksReturned = track.results.trackmatches.track.length;
	
	// We're only interested in the first (lastFMSearchLimit) number of items returned.
	if(numberOfTracksReturned > _lastFMSearchLimit) {
		numberOfTracksReturned = _lastFMSearchLimit;
	}
	
	$('#lastFMTrackResults').append('<b>Track Results:</b><br>')
	
	// Check to make sure there were tracks in the results.
	if(numberOfTracksReturned > 0) {
		// Get track information for the first 5 tracks returned from Last.fm.
		for(var i = 0; i < numberOfTracksReturned; i++) {
			// If I only got one result, the result isn't an array so I can't access it with the [i] subscript.
			if(numberOfTracksReturned == 1) {
				trackName = track.results.trackmatches.track.name;
				trackUrl = track.results.trackmatches.track.url;
				artistName = track.results.trackmatches.track.artist;
			}
			else {
				trackName = track.results.trackmatches.track[i].name;
				trackUrl = track.results.trackmatches.track[i].url;
				artistName = track.results.trackmatches.track[i].artist;
			}

			// Track buttons
			$('<button/>', {
				text: trackName,
				id: trackName,
				click: trackButtonClicked,
				'data-artistName': artistName
			}).appendTo($('#lastFMTrackResults'));
			
			$('#lastFMTrackResults').append(' <br> ');
		}
	}
	else {
		$('#lastFMTrackResults').append('No Track By That Name');
	}
}

function artistButtonClicked() {
	let artistName = encodeURIComponent($(this).text());
	let url = 'http://ws.audioscrobbler.com/2.0/?method=artist.getinfo&artist='+artistName+'&api_key='+_lastFMKey+'&format=json'
	getLastFMJSON(url, getArtistInfo);
}

function getArtistInfo(artistInfo) {
	const mbid = artistInfo.artist.mbid;
	let imageUrl = artistInfo.artist.image[2]['#text'];

	if (mbid) {
		const url = 'https://musicbrainz.org/ws/2/artist/' + mbid + '?inc=url-rels&fmt=json';
		 fetch(url)
			 .then(res => res.json())
			 .then((out) => {
				 const relations = out.relations;

				 // Find image relation
				 for (let i = 0; i < relations.length; i++) {
					 if (relations[i].type === 'image') {
						 imageUrl = relations[i].url.resource;
						 if (imageUrl.startsWith('https://commons.wikimedia.org/wiki/File:')) {
							 const filename = imageUrl.substring(imageUrl.lastIndexOf('/') + 1);
							 imageUrl = 'https://commons.wikimedia.org/wiki/Special:Redirect/file/' + filename;
						 }
						 //success(imageUrl);
					 }
				 }
			 })
			 .catch(err => { throw console.log(err) });
	 }

	$(".card").css('visibility', 'visible');
	$(".cardImage").attr("src", imageUrl);
	$('.selectedName').html($('<a href="'+artistInfo.artist.url+'" target="_blank">'+artistInfo.artist.name+'</a>'));
	$(".cardDescription").text(artistInfo.artist.bio.summary);
}

function albumButtonClicked() {
	var albumName = encodeURIComponent($(this).text());
	var artistName = encodeURIComponent($(this).data().artistname);
	var url = 'http://ws.audioscrobbler.com/2.0/?method=album.getinfo&api_key='+_lastFMKey+'&artist='+artistName+'&album='+albumName+'&format=json'
	getLastFMJSON(url, getAlbumInfo);
}

function getAlbumInfo(albumInfo) {
	$(".card").css('visibility', 'visible');
	$(".cardImage").attr("src", albumInfo.album.image[5]['#text']);
	$('.selectedName').html($('<a href="'+albumInfo.album.url+'" target="_blank">'+albumInfo.album.name+'</a>'));
	$(".cardDescription").empty();
	
	if (albumInfo.album.wiki) {
		$(".cardDescription").append(albumInfo.album.wiki.summary).append('<br>');
	}
	
	if (albumInfo.album.tracks) {
		$(".cardDescription").append('<b>Song List:</b>').append('<br>');
		for (var i = 0; i < albumInfo.album.tracks.track.length; i++) {
			if (albumInfo.album.tracks.track[i].name !== 'Unknown') {
				$(".cardDescription").append(albumInfo.album.tracks.track[i].name).append('<br>');
			}
		}
	}
}

function trackButtonClicked() {
	var trackName = encodeURIComponent($(this).text());
	var artistName = encodeURIComponent($(this).data().artistname);
	var url = 'http://ws.audioscrobbler.com/2.0/?method=track.getInfo&api_key='+_lastFMKey+'&artist='+artistName+'&track='+trackName+'&format=json'
	getLastFMJSON(url, getTrackInfo);
}

function getTrackInfo(trackInfo) {
	$(".card").css('visibility', 'visible');
	$(".cardImage").attr("src", trackInfo.track.album.image[3]['#text']);
	$('.selectedName').html($('<a href="'+trackInfo.track.url+'" target="_blank">'+trackInfo.track.name+'</a>'));	
	$(".cardDescription").empty();
	
	if (trackInfo.track.wiki) {
		$(".cardDescription").append(trackInfo.track.wiki.summary);
	}
}


















