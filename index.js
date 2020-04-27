const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoClient = require('mongodb');
const url = "mongodb+srv://Niharrika:Mymongoatlas@cluster0-jmoet.mongodb.net/test?retryWrites=true&w=majority";

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

app.get('/list', function (req, res) {
	mongoClient.connect(url, function (err, client) {
		if (err) throw err;
		var db = client.db("urlshortener");
		var a = db.collection("url").find().toArray();
		a.then(function (data) {
			client.close();
			res.json(data)
		}).catch(function (err) {
			client.close();
			res.status(400).json({
				message: "Error"
			})
		})
	})
})

app.post('/create', function (req, res) {
	console.log(req.body.URL);
	mongoClient.connect(url, function (err, client) {
		if (err) throw err;
		var db = client.db("urlshortener");
		db.collection("url").insertOne({
			long: req.body.URL, short: shortURL()}, function(err, data) {
				if (err) throw err;
				client.close();
				console.log("data stored")
				res.send(data)
		})
	})
})

function shortURL() {
	var short = "";
	var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	var charLen = characters.length;
	for (var i = 0; i < 7; i++) {
		short += characters.charAt(
			Math.floor(Math.random() * charLen)
		);
	}
	return short;
}
app.listen(process.env.PORT, function () {
})