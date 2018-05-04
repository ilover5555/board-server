var express = require('express');
const passport = require('passport');
var router = express.Router();
var User = require('../model/User');
var store = require('../store');

const env = {
    AUTH0_CLIENT_ID: 'o64v6_hXYS4Gqrv3HfvyuYOsPi_yczXi',
    AUTH0_DOMAIN: 'wluns32.auth0.com',
    AUTH0_CALLBACK_URL: 'http://localhost:3100/callback'
};

/* GET home page. */
router.get('/', function (req, res, next) {
    res.render('index', {title: 'Express'});
});

// Perform the login
router.get(
    '/login_re',
    function (req, res) {
        req.session.returnTo = req.query.re;
        req.session.save();
        res.redirect('/login');
    }
);

// Perform the login
router.get(
    '/login',
    passport.authenticate('auth0', {
        clientID: env.AUTH0_CLIENT_ID,
        domain: env.AUTH0_DOMAIN,
        redirectUri: env.AUTH0_CALLBACK_URL,
        audience: 'https://' + env.AUTH0_DOMAIN + '/userinfo',
        responseType: 'code',
        scope: 'openid profile email'
    }),
    function (req, res) {
        res.redirect('/');
    }
);

// Perform session logout and redirect to homepage
router.get('/logout', (req, res) => {
    req.logout();
    res.redirect('/');
})
;

// Perform the final stage of authentication and redirect to '/user'
router.get(
    '/callback',
    passport.authenticate('auth0', {
        failureRedirect: '/'
    }),
    function (req, res) {
        const profile = req.session.passport.user;
        const id = profile.id;
        const email = profile.emails[0].value;
        const profileImage = profile.picture;

        User.getUserById(id, function(err, rows) {
            console.log('getUserByIdentifier : ' + id);
            console.log(rows[0]);
            let user = rows[0];
            if(!user) {
                user = {
                    'id' : id,
                'email': email,
                'name': '',
                'nickname': '',
                'profile': profileImage};

                User.addUser(user, function(err, rows) {
                    console.log('addUser')
                    console.log(rows);
                    req.session.user = user;
                    const token = store.add(user);
                    res.redirect(req.session.returnTo+'?token='+token || 'http://localhost:3000?token='+token);
                })
            } else {
                console.log('already user');
                req.session.user = user;
                const token = store.add(user);
                res.redirect(req.session.returnTo+'?token='+token || 'http://localhost:3000?token='+token);
            }
        })

    }
);

module.exports = router;
