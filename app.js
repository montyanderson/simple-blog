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
var posts = 5 /* Posts per page */

var page = function(req, res) {
	if(req.params.n) {
		var pageNumber = req.params.n;
	} else {
		var pageNumber = 0;
	}

	var data = config;
	data.next = parseInt(pageNumber) + 1;

	db.posts.find().skip(posts * pageNumber).sort({"_id": -1}).limit(posts, function(err, docs) {
		data.posts = docs;
		res.render("index", data);
	});
}

app.get("/", page);
app.get("/page/:n", page);

var port = 4000;

app.listen(port);
console.log("blog running on port " + port + ".");