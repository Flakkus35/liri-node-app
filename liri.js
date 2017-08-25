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
var param1 = process.argv[2];

if (param1 == 'my-tweets') {
	client.get('statuses/user_timeline', function(err, tweets, response) {
		if (!err) {
			tweets.forEach(function(element) {
				console.log(element.text + ': ' + element.created_at);
			})
		} else {
			console.log(err);
		}
	});
};

if (param1 == 'spotify-this-song') {
	var songName = '';
	for (var i = 3; i < process.argv.length; i++) {
		songName += process.argv[i] + ' ';
	}
	if (songName == undefined) {
		spot.search({type: 'track', query: 'The Sign'}, function(err, data) {
			if(!err) {
				console.log(data.tracks.items[5].artists[0].name);
				console.log(data.tracks.items[5].name);
				console.log(data.tracks.items[5].preview_url);
				console.log(data.tracks.items[5].album.name);
				debugger;
			} else {
				console.log(err);
			}
		});
	} else {
		spot.search({type: 'track', query: songName}, function(err,data) {
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
};