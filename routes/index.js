var express = require('express'); 
var path = require('path'); 
var app = express();   

var bodyParser = require('body-parser');  
app.use(bodyParser.json());  
app.use(bodyParser.urlencoded({ extended: false }));

var router = express.Router();  

app.use(router);  



/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/main', function(req, res, next) {
  res.render('main');
});

router.get('/about', function(req, res, next) {
  res.render('about');
});

router.get('/add', function(req, res, next) {
  res.render('add');
});

router.post('/add/restaurant', function(req, res, next) {
  console.log("Output of req.body from POST:")
  console.log(req.body);
  res.send("Thanks for submitting! Click <a href='/'>here</a> to go back.");
});

module.exports = router;
