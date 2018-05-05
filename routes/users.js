var express = require('express');
var router = express.Router();
var store = require('../store');
var User = require('../model/User');

/* GET users listing. */
router.get('/', function(req, res, next) {
  const token = req.query.token;
  res.json(store.get(token));
});

router.get('/set-name', function(req, res, next) {
    console.log('set-name called');
    const token = req.query.token;
    const user = store.get(token);
    if(!user) {
        res.send('Invalid token');
        return;
    }

    const name = req.query.name;
    const nickname = req.query.nickname;

    user.name = name;
    user.nickname = nickname;

    User.updateNameAndNickname(user, function(err, rows) {
        console.log(err);
        console.log(rows);

        if(err) {

            res.send(false);
        } else {
            store.update(token, user);
           res.send(true);
        }
    });


});

module.exports = router;
