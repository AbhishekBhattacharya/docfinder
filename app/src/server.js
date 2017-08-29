
//imported software packages
var express = require('express');//library used to create the web server i.e express framework
var morgan = require('morgan');//library used to output logs of our server
var path = require('path');
//var crypto = require('crypto'); //Library of NodeJs For Hashing
//var bodyParser = require('body-parser'); //for GETTING username, password as JSON
var session = require('express-session'); //Implement Sessions



var app = express();
app.use(morgan('combined'));
//app.use(bodyParser.json()); //tell express to load JSON in req.body variable whenever see it


app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, 'ui', 'index.html'));//when url path '/' is requested , then picks up ui/index.html and sends it contents ..these are called url handlers
});

app.get('/login.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'login.html'));
});


app.get('/pat.html', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'pat.html'));
});

app.get('/doc/id/:doc_id', function (req, res) {
  res.sendFile(path.join(__dirname, 'ui', 'doc.html'));
});


app.use(express.static(path.join(__dirname, 'ui'))); 



var port = 8080; // Use 8080 for local development because you might already have apache running on 80
app.listen(8080, function () {
  console.log(`DocFinder app listening on port ${port}!`);
});
