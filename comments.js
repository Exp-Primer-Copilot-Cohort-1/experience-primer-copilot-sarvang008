// Create web server

var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var Comment = require('./comment.model');
var db = 'mongodb://localhost/comments';

mongoose.connect(db);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));

app.get('/', function(req, res){
	res.send('happy to be here');
});

app.get('/comments', function(req, res){
	console.log('getting all comments');
	Comment.find({})
	.exec(function(err, comments){
		if(err){
			res.send('error has occured');
		} else {
			console.log(comments);
			res.json(comments);
		}
	});
});

app.get('/comments/:id', function(req, res){
	console.log('getting one comment');
	Comment.findOne({
		_id: req.params.id
	})
	.exec(function(err, comment){
		if(err){
			res.send('error has occured');
		} else {
			console.log(comment);
			res.json(comment);
		}
	});
});

app.post('/comment', function(req, res){
	var newComment = new Comment();

	newComment.author = req.body.author;
	newComment.text = req.body.text;

	newComment.save(function(err, comment){
		if(err){
			res.send('error saving comment');
		} else {
			console.log(comment);
			res.send(comment);
		}
	});
});

app.put('/comment/:id', function(req, res){
	Comment.findOneAndUpdate({
		_id: req.params.id
	},
	{$set: {author: req.body.author, text: req.body.text}},
	{upsert: true},
	function(err, newComment){
		if(err){
			res.send('error updating ');
		} else {
			console.log(newComment);
			res.send(newComment);
		}
	});
});

app.delete('/comment/:id', function(req, res){
	Comment.findOneAndRemove({
		_id: req.params.id
	},
	function(err, comment){
		if(err){
			res.send('error deleting');
		} else {
			console.log(comment);
			res.status(204);
		}
	});
});

app.listen(3000, function(){
	console.log('listening on port 3000');
});