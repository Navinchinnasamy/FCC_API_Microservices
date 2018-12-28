var mongo = require('mongodb');
var mongoose = require('mongoose');

/* Connect to mongo db (in mLab) */
mongoose.connect(process.env.MONGOLAB_URI);

/* Schema for Short URL document */
var ShortUrlsSchema = new mongoose.Schema({
  orginalUrl: String,
  shortUrl: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: Date
});

/* Create a model */
var ShortUrls = mongoose.model('ShortUrls', ShortUrlsSchema);

/* Create and save Short URL */
var createAndSaveShortURL = function(data, done){
  var shortUrl = new ShortUrls(data);
  shortUrl.save(function(err, data){
    if(err){
      done(err);
    }
    done(null, data);
  });
};

/* Find the original URL from short URL */
var findOriginalURL = function(data, done){
  ShortUrls.findOne(data, function(err, shortUrl){
    if(err){
      console.log(err);
      done(err)
    }
    done('', shortUrl);
  });
};



/** Export each variable as modules to import it into server.js file **/
exports.ShortUrlsModel = ShortUrls;
exports.createAndSaveShortURL = createAndSaveShortURL;
exports.findOriginalURL = findOriginalURL;