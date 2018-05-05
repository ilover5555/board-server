var express = require('express');
var router = express.Router();
var store = require('../store');
var User = require('../model/User');
var Article = require('../model/Article');

/* GET users listing. */
router.get('/list', function (req, res, next) {
    const page = +req.query.p;
    const size = +req.query.s;
    const tableId = +req.query.tableId;

    Article.getAllArticleOfTable(tableId, page, size, (err, rows) => {
        console.log(page);
        console.log(size);
        console.log(tableId);
        console.log(err);
        console.log(rows);
        if(err) {
            res.json({success : false});
        } else {
            res.json({success : true, data : rows});
        }
    })
});

router.post('/', function (req, res, next) {
    console.log('post');
    const token = req.query.token;
    const user = store.get(token);
    if(!user) {
        res.json({success : false, errorMsg : 'token invalid'});
        return;
    }

    const title = req.body.title;
    const contents = req.body.contents;

    const tableId = req.query.tableId;

    const date = Math.floor(Date.now());
    console.log(date);
    const article = {'title' : title,
    'contents' : contents,
    commentCount: 0,
        viewCount: 0,
    parent : -1,
    o : -1,
    oo : -1,
    tableId: tableId};

    Article.addArticle(article, user, (err, rows) => {
        console.log(err);
        console.log(rows);
        if(err) {
            res.json({success : false, err : err});
        } else {
            res.json({success : true, newId : rows.insertId});
        }
    })
});

/* GET users listing. */
router.get('/:id', function (req, res, next) {
    const id = +req.params.id;

    Article.getArticleByIdentifier(id, (err, rows) => {
        if(err) {
            res.json({success: false, error : err});
        } else {
            const article = rows[0];
            User.getUserByIdentifier(article.writerId, (err, urows) => {
                console.log('urows');
                console.log(urows);
                article.writer = urows[0];
                res.json({success: true, data: article});
            })

        }
    });
});

module.exports = router;
