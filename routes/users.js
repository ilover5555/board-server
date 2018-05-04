var express = require('express');
var router = express.Router();
var store = require('../store')

/* GET users listing. */
router.get('/', function(req, res, next) {
  const token = req.query.token;
  res.json(store.get(token));
});

module.exports = router;
