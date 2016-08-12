var express = require('express');
var router = express.Router();

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

module.exports = router;
