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
            let count = rows.size;
            const writerIds = rows.map(r => r.writerId);
            User.getUserByIdentifiers(writerIds, (err, urows) => {
                console.log(err);
                console.log(urows);
                rows.forEach(r => {
                    const user = urows.filter(u => u.identifier === r.writerId)[0];
                    r.writer = user;
                })
                res.json({success : true, data : rows});
            })

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

router.get('/comments', function (req, res, next) {
    const parentId = +req.query.parentId;

    Article.getArticleByParentId(parentId, (err, rows) => {
        console.log(err);
        console.log(rows);
        if(err) {
            res.json({success : false});
        } else {
            let count = rows.size;
            const writerIds = rows.map(r => r.writerId);
            User.getUserByIdentifiers(writerIds, (err, urows) => {
                console.log(err);
                console.log(urows);
                rows.forEach(r => {
                    const user = urows.filter(u => u.identifier === r.writerId)[0];
                    r.writer = user;
                })
                rows.sort((a,b) => {
                    const f = a.o - b.o;
                    if(f !== 0) {
                        return f;
                    } else {
                        return a.oo - b.oo;
                    }
                })
                res.json({success : true, data : rows});
            })

        }
    })

});

router.post('/comment', function (req, res, next) {
    console.log('post comment');
    const token = req.query.token;
    const user = store.get(token);
    if(!user) {
        res.json({success : false, errorMsg : 'token invalid'});
        return;
    }

    const contents = req.body.contents;

    const parentId = +req.query.parentId;

    Article.getNextO(parentId, (err, rows) => {
        console.log('getNextO');
        console.log(err);
        console.log(rows);
        if(err) {
            res.json({success : false, errorMsg : err});
        } else {
            let nextO = rows[0]['max(o)+1'];
            console.log(nextO);
            if(!nextO) {
                nextO = 1;
            }
            const date = Math.floor(Date.now());
            console.log(date);
            const article = {
                'title' : '',
                'contents' : contents,
                commentCount: 0,
                viewCount: 0,
                parent : parentId,
                o : nextO,
                oo : -1,
                tableId: -1};

            Article.addArticle(article, user, (aerr, arows) => {
                console.log(aerr);
                console.log(arows);
                if(err) {
                    res.json({success : false, err : err});
                } else {
                    res.json({success : true, newId : arows.insertId});
                }
            })
        }
    })

});

router.post('/comment/comment', function (req, res, next) {
    console.log('post comment');
    const token = req.query.token;
    const user = store.get(token);
    if(!user) {
        res.json({success : false, errorMsg : 'token invalid'});
        return;
    }

    const contents = req.body.contents;

    const parentId = +req.query.parentId;
    const o = +req.query.o;

    Article.getNextOO(parentId, o, (err, rows) => {
        console.log('getNextOO');
        console.log(err);
        console.log(rows);
        if(err) {
            res.json({success : false, errorMsg : err});
        } else {
            let nextOO = rows[0]['max(oo)+1'];
            console.log(nextOO);
            if(!nextOO) {
                nextOO = 1;
            }
            const date = Math.floor(Date.now());
            console.log(date);
            const article = {
                'title' : '',
                'contents' : contents,
                commentCount: 0,
                viewCount: 0,
                parent : parentId,
                o : o,
                oo : nextOO,
                tableId: -1};

            Article.addArticle(article, user, (aerr, arows) => {
                console.log(aerr);
                console.log(arows);
                if(err) {
                    res.json({success : false, err : err});
                } else {
                    res.json({success : true, newId : arows.insertId});
                }
            })
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
