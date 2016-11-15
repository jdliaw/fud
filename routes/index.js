var express = require('express');
var path = require('path');

var key = 'b9c44af68bbaf60823b99f9cb586aa26d2c455b';
var Geocodio = require('geocodio');
var config = {
  api_key: key
}
var geocodio = new Geocodio(config);

var app = express();
var mongodb = require('mongodb');
var uri = 'mongodb://test:test@ds011705.mlab.com:11705/fud_map';

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

router.get('/mapdata', function (req, res, next) {
  mongodb.MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var restaurants = db.collection('restaurants');
    var mapdata = restaurants.find().toArray(function (err, docs) {
      if (err) {
        throw err;
      }
      res.send(docs);
    });
  });
});

/* GET a restaurant from the database */
router.get('/restaurants/:id', function (req, res, next) {
  mongodb.MongoClient.connect(uri, function (err, db) {
    if (err) {
      throw err;
    }
    var restaurants = db.collection('restaurants');
    //console.log(req.params.id);
    var restaurant = restaurants.findOne({ "title": req.params.id }, function (err, doc) {
      if (err) {
        throw err;
      }
      res.send(doc);
    });
  });
})

router.get('/add', function (req, res, next) {
  res.render('add');
});

/* POST a restaurant to the Database */
router.post('/add/restaurant', function (req, res, next) {

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

  //if formatted correctly.... add to database
  if (isFilledOut) {
    mongodb.MongoClient.connect(uri, function (err, db) {
      if (err) {
        throw err;
      }
      //Using the 'restaurant' collection
      var restaurants = db.collection('restaurants');

      // var client = new MapboxClient('pk.eyJ1IjoiamRsaWF3IiwiYSI6ImNpcjAzZHdsMzAycjVmc2txZHp6M2JtOHEifQ.S03POBe5nKC1CDRnJANxdw');
      // var addr = req.body["address"];
      // client.geocodeForward(addr, function (err, res) {
      //   console.log(res["geometry"]);
      // });
      //Some more formatting for Restaurants.
      let pr = "";
      let rt = "";

      for (let i = 0; i < req.body["price-input"]; i++) {
        pr += '$';
      }
      for (let i = 0; i < req.body["rating-input"]; i++) {
        rt += '✮';
      }
      req.body["price-input"] = pr;
      req.body["rating-input"] = rt;

      var address = req.body["address"];
      var loc = "";
      geocodio.get('geocode', { q: address }, function (err, response) {
        if (err) throw err;
        var jsonobj = JSON.parse(response);
        // console.log(jsonobj);
        console.log(jsonobj);
        loc = jsonobj.results[0].location
        req.body["location"] = loc;

        // console.log(req.body);

        // Note that the insert method can take either an array or a dict.
        restaurants.insert(req.body, function (err, result) {
          if (err) {
            throw err;
          }
        });
      });
    });
    res.send("Thanks for submitting! Click <a href='/'>here</a> to go back.");
  }
});



module.exports = router;


