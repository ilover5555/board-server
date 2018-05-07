var express = require('express');
var router = express.Router();
var store = require('../store');
var User = require('../model/User');
var Board = require('../model/Board');

/* GET users listing. */
router.get('/list', function (req, res, next) {
    Board.getAllBoards((err, rows) => {
        if(err) {
            res.json({success : false});
        } else {
            res.json({success: true, data : rows});
        }
    })
});

/* GET users listing. */
router.get('/list/with/:name', function (req, res, next) {
    const name = req.params.name;
    Board.getBoardByName(name, (err, rows) => {
        if(err) {
            res.json({success : false});
        } else {
            res.json({success: true, data : rows[0]});
        }
    });
});

module.exports = router;
