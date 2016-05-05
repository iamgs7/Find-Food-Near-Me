"use strict";

var express = require("express"),
    bodyParser = require("body-parser"),
    http = require("http"),
    Yelp = require("yelp"),
    mongoose = require("mongoose"),
    app = express();

app.use(express.static("."));

app.use(bodyParser.json({ type: 'application/*+json' }));
app.use(bodyParser.urlencoded({ extended: false }));

var yelp = new Yelp({
    consumer_key: 's3gu-bz_UZutWssFUF9__A',
    consumer_secret: 'AbufbsNUygX6nu2NV9m97VhnBms',
    token: 'iwd171pcfzkoUB4reb7CYD6fDPsFG9CI',
    token_secret: '113LEtBcwCcKuCtD9m2U3Q9XrkA',
});

app.get('/', function(req,res){
   res.sendFile(__dirname+"/index.html"); 
});

http.createServer(app).listen(3000);

mongoose.connect("mongodb://localhost/url");

var db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", function() {
    //good to go
});

var reviewSchema = mongoose.Schema({
    restaurant: String,
	rating: Number,
	written: String,
	restaurantID: String,
	date: String
});

var reviews = mongoose.model("reviews", reviewSchema);

app.get('/find', function(req,res) {
    console.log("Latitude = " + req.query.latitude);
    console.log("Longitude = " + req.query.longitude);
    
    var swLat = parseFloat(req.query.latitude) - 0.0075;
    var swLong = parseFloat(req.query.longitude) - 0.0075;
    var neLat = parseFloat(req.query.latitude) + 0.0075;
    var neLong = parseFloat(req.query.longitude) + 0.0075;
    
    yelp.search({
        term: "food",
        bounds: swLat + "," + swLong + "|" + neLat + "," + neLong
    })
    .then(function(data) {
        res.json(data);
    })
    .catch(function(err) {
        console.log(err); 
    });
});

app.post('/review', function(req,res) {
	var tempReview = new reviews({
		restaurant: req.body.restaurant,
		rating: req.body.rating,
		written: req.body.written,
		restaurantID: req.body.restaurantID,
		date: req.body.date
	});
	console.log(tempReview);
	
	tempReview.save(function(err, tempReview) {
        if (err) {
            return console.log(err);
        }
		console.log("Review Successfully Saved!");
        res.json(tempReview);
    });
});

app.get('/review', function(req,res) {
	reviews.find({ restaurant: req.query.restaurant }, function (err, obj) {
		if(err) {
			return console.log(err);
		}
		res.json(obj);
	});
});