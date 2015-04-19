"use strict";

var fs = require("fs"),
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

var config = JSON.parse(fs.readFileSync("blog.json"));

app.get("/", function(req, res) {
	var data = config;

	db.posts.find(function(err, docs) {
		data.posts = docs;
		res.render("index", data);
	});
});

var port = 4000;

app.listen(port);
console.log("blog running on port " + port + ".");