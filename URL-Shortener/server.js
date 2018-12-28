'use strict';

var express = require('express');
var bodyParser = require('body-parser');
const shortid = require('shortid');

var cors = require('cors');

var app = express();

// Basic Configuration 
var port = process.env.PORT || 3000;

/** this project needs a db !! **/ 
var shortUrl = require('./shortUrl.js');

app.use(cors());

/** this project needs to parse POST bodies **/
// you should mount the body-parser here
app.use(bodyParser.urlencoded({extended: 'false'}));
app.use(bodyParser.json());

app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function(req, res){
  res.sendFile(process.cwd() + '/views/index.html');
});

  
// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});


var shortUrlModel = shortUrl.ShortUrlsModel;

app.post("/api/shorturl/new", function(req, res){
  // Get the URL to be shortened
  var url = req.body.url;
  var shortCode = shortid.generate();
  
  var UrlData = {
    "orginalUrl": url,
    "shortUrl": shortCode
  };
  
  var createShortUrl = shortUrl.createAndSaveShortURL;
  createShortUrl(UrlData, function(err, data){
    if(err){
      return (err);
    }
    res.json(data);
    console.log(data);
  });
});

var findOriginalUrl = shortUrl.findOriginalURL;
app.get("/:shorturl", function(req, res){
  // Fetch original url from MongoDB
  var shortUrl = req.params.shorturl;
  findOriginalUrl({ "shortUrl": shortUrl }, function(err, data){
    if(err){
      return err;
    }
    if(data){
      // URL Found
      res.writeHead(301,
        { Location: data.orginalUrl }
      );
      res.end();
    } else {
      // URL Not Found
      res.json({
        "error":"invalid URL"
      });
    }
  });
});

app.listen(port, function () {
  console.log('Node.js listening ...');
});