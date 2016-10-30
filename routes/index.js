var express = require('express');
var path = require('path');
var app = express();

var mongodb = require('mongodb');

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var router = express.Router();
app.use(router);



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', function (req, res, next) {
  res.render('main');
});

router.get('/about', function (req, res, next) {
  res.render('about');
});

router.get('/add', function (req, res, next) {
  res.render('add');
});

router.post('/add/restaurant', function (req, res, next) {
  console.log("Output of req.body from POST: in parts:")

  //req.body is the JSON object that looks like a string.
  var isFilledOut = true;
  //Loops through req.body and use req.body[key] to access the input.
  for (var key in req.body) {
    var value = req.body[key];
    //null or empty string
    if (!value || value === "") {
      isFilledOut = false;
    }
    var formattedReview;
    if (key === "review") {
      var rawReview = req.body[key];
      var dealWithNewLines = rawReview.replace(/\r\n/g, "\n");
      var convertToPTags = dealWithNewLines.split("\n").join("</p><p>");
      var formattedReview = "<p>" + convertToPTags + "</p>"
      req.body.review = formattedReview;
    }
  }
  console.log("Here is the data entered: ");
  console.log(req.body);

  //if formatted correctly.... add to database
  if (isFilledOut) {
    //straight from https://github.com/mongolab/mongodb-driver-examples/blob/master/nodejs/nodeSimpleExample.js
    /* mongodb stuff.......... */
    //using our test user, with database fud_map
    var uri = 'mongodb://test:test@ds011705.mlab.com:11705/fud_map';

    mongodb.MongoClient.connect(uri, function (err, db) {
      if (err) {
        throw err;
      }
      
      //Using the 'restaurant' collection
      var restaurants = db.collection('restaurants');
      // Note that the insert method can take either an array or a dict.

      restaurants.insert(req.body, function (err, result) {
        if (err) {
          throw err;
        }
      });
    });


    res.send("Thanks for submitting! Click <a href='/'>here</a> to go back.");
  }
});

module.exports = router;
