var keys = require('./key.js');
var twitter = require('twitter');
var client = new twitter({
		consumer_key: keys.twitterKeys.consumer_key,
		consumer_secret: keys.twitterKeys.consumer_secret,
		access_token_key: keys.twitterKeys.access_token_key,
		access_token_secret: keys.twitterKeys.access_token_secret
	});
var spotify = require('node-spotify-api');
var spot = new spotify({
		id: keys.spotifyKeys.client_id,
		secret: keys.spotifyKeys.client_secret
	});
var request = require('request');
var fs = require('fs');
var param1 = process.argv[2];
var songParam = '';
for (var i = 3; i < process.argv.length; i++) {
	songParam += process.argv[i] + ' ';
} 
var movieParam = process.argv.slice(3).join('+');

if (param1 == 'spotify-this-song') {
	spotMusic(songParam);
} else if (param1 == 'movie-this') {
	findMovie(movieParam);
} else if (param1 == 'my-tweets') {
	getTweets();
} else if (param1 == "do-what-it-says") {
	fs.readFile('random.txt', 'utf8', function(err, data) {
		if (err) {
			return console.log(err);
		}
		var splitData = data.split(',');
		if (splitData[0] == 'spotify-this-song') {
			spotMusic(splitData[1]);
		} else if (splitData[0] == 'movie-this') {
			var splitMovie = splitData[1].split(' ');
			movieParam = splitMovie.join('+');
			findMovie(movieParam);
		} else if (splitData[0] == 'my-tweets') {
			getTweets();
		}
	});
}

function spotMusic(name) {
	if (name == undefined) {
		spot.search({type: 'track', query: 'The Sign'}, function(err, data) {
			if(!err) {
				console.log(data.tracks.items[5].artists[0].name);
				console.log(data.tracks.items[5].name);
				console.log(data.tracks.items[5].preview_url);
				console.log(data.tracks.items[5].album.name);
			} else {
				console.log(err);
			}
		});
	} else {
		spot.search({type: 'track', query: name}, function(err,data) {
			if (!err) {
				console.log(data.tracks.items[0].artists[0].name);
				console.log(data.tracks.items[0].name);
				console.log(data.tracks.items[0].preview_url);
				console.log(data.tracks.items[0].album.name);
			} else {
				console.log(err);
			}
		});
	}
}

function getTweets() {
	client.get('statuses/user_timeline', function(err, tweets, response) {
		if (!err) {
			tweets.forEach(function(element) {
				console.log(element.text + ': ' + element.created_at);
			})
		} else {
			console.log(err);
		}
	});
}

function findMovie(name) {
	var title = 'http://www.omdbapi.com/?apikey=40e9cece&t=' + name;
	if (movieParam == '') {
		request('http://www.omdbapi.com/?apikey=40e9cece&t=Mr+Nobody', function(err, response, body) {
			if (!err) {
				console.log('Title: ' + JSON.parse(body).Title);
				console.log('Year: ' + JSON.parse(body).Year);
				console.log('Imdb Rating: ' + JSON.parse(body).Ratings[0].Value);
				console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
				console.log('Country: ' + JSON.parse(body).Country);
				console.log('Language: ' + JSON.parse(body).Language);
				console.log('Plot: ' + JSON.parse(body).Plot);
				console.log('Actors: ' + JSON.parse(body).Actors);
			} else {
				console.log(err);
			}
		});
	} else {
		request(title, function(err, response, body) { 
			if (!err) {
				console.log('Title: ' + JSON.parse(body).Title);
				console.log('Year: ' + JSON.parse(body).Year);
				console.log('Imdb Rating: ' + JSON.parse(body).Ratings[0].Value);
				if (JSON.parse(body).Ratings[1] !== undefined) {
					console.log('Rotten Tomatoes Rating: ' + JSON.parse(body).Ratings[1].Value);
				}
				console.log('Country: ' + JSON.parse(body).Country);
				console.log('Language: ' + JSON.parse(body).Language);
				console.log('Plot: ' + JSON.parse(body).Plot);
				console.log('Actors: ' + JSON.parse(body).Actors);
			} else {
				console.log(err);
			}
		});
	}
}