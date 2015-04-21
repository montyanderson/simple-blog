"use strict";

var fs = require("fs"),
	request = require("request"),
	bodyParser = require("body-parser"),
	express = require("express"),
	ect = require("ect"),
	mongojs = require("mongojs");

var app = express(),
	db = mongojs("blog", ["posts"]);

app.use(express.static("static"));
app.use(express.static("bower_components"));

var ectRenderer = ect({ 
	watch: true, 
	root: __dirname + "/views", 
	ext: ".ect"
});

app.set("view engine", "ect");
app.engine("ect", ectRenderer.render);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
})); 

var config = JSON.parse(fs.readFileSync("blog.json"));
console.log("- blog config: " + JSON.stringify(config));

var page = function(req, res) {
	var posts = 5 /* Posts per page */

	if(req.params.n) {
		var pageNumber = parseInt(req.params.n);
	} else {
		var pageNumber = 0;
	}
	
	db.posts.find().skip(posts * pageNumber).sort({"_id": -1}).limit(posts, function(err, docs) {
		var data = config;
		data.posts = docs;

		if(docs.length == 0) {
			data.next = pageNumber - 1;
		} else {
			data.next = pageNumber + 1;
		}

		res.render("index", data);
	});
}

app.get("/", page);
app.get("/page/:n", page);

var port = 4000;

app.listen(port);
console.log("- blog running on port " + port + ".");