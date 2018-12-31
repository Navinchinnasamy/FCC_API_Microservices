'use strict';

const fileUpload = require('express-fileupload');
var express = require('express');
var cors = require('cors');


// require and use "multer"...

var app = express();

app.use(cors());
app.use(fileUpload());
app.use('/public', express.static(process.cwd() + '/public'));

app.get('/', function (req, res) {
     res.sendFile(process.cwd() + '/views/index.html');
  });

app.get('/hello', function(req, res){
  res.json({greetings: "Hello, API"});
});

app.post('/api/fileanalyse', function(req, res){
  if (Object.keys(req.files).length == 0) {
    return res.status(400).send('No files were uploaded.');
  }
  let upfile = req.files.upfile;
  res.json({
    "name": upfile.name,
    "type": upfile.mimetype,
    "size": upfile.data.length
  });
});

app.listen(process.env.PORT || 3000, function () {
  console.log('Node.js listening ...');
});
