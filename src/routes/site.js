const express = require('express');
const router = express.Router();

const siteController = require('../Controllers/SiteController');

const {isLoggined} = require('../ulti/login')
var cookieParser = require('cookie-parser')
router.use(cookieParser())


// ---------------------------------
// LOGIN BY FACEBOOK 
// ---------------------------------
const User = require('../models/User');
const passport = require('passport');
const session = require('express-session');
const jwt = require('jsonwebtoken');

const FacebookStrategy = require('passport-facebook').Strategy;

const CLIENT_ID_FB = 765569407777260
const CILENT_SECRET_FB = '468465969100895e177b723045ed0a69';

router.use(session({ 
    secret: 'dustinsecret',
    resave: true,
    saveUninitialized: true 
}));
router.use(passport.initialize());
router.use(passport.session()); 
router.use(cookieParser());

passport.use(new FacebookStrategy({
    clientID: CLIENT_ID_FB,
    clientSecret: CILENT_SECRET_FB,
    callbackURL: "http://localhost:5000/auth/facebook/callback",
    profileFields: ["id", "displayName", "name", "gender", "email", "photos"]
  },
  function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their facebook id
        User.findOne({ 'facebookId' : profile.id }, function(err, user) {
            console.log(profile)
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                    // if there is no user found with that facebook id, create them
                    var newUser = new User();
                    newUser.email = profile.emails[0].value
                    // set all of the facebook information in our user model
                    newUser.facebookId    = profile.id; // set the users facebook id           
                    newUser.name  = profile.displayName // look at the passport user profile to see how names are returned
                    // newUser.email = profile.emails[0].value;
                    newUser.money = 0
                    newUser.gender = profile.gender
                    newUser.avatar = profile.photos[0].value
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.get('/auth/facebook', passport.authenticate('facebook', { scope : 'email' }));
 
router.get('/auth/facebook/callback', passport.authenticate('facebook', {
    successRedirect: '/social-login-success',
    failureRedirect: '/login'
  }))

router.get('/social-login-success', function(req, res) {
    var token = jwt.sign({ _id: req.user.id }, 'secretpasstoken', {})
    res.cookie('token', token);
    res.redirect('/')
})

// ---------------------------------


// ---------------------------------
// LOGIN BY GOOGLE 
// ---------------------------------
const GoogleStrategy = require('passport-google-oauth2').Strategy;

const CLIENT_ID_GG = '324350435117-0t20qgbopolsmdrcgft8792l2thi311h.apps.googleusercontent.com'
const CILENT_SECRET_GG = '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';
passport.use(new GoogleStrategy({
    clientID: CLIENT_ID_GG,
    clientSecret: CILENT_SECRET_GG,
    callbackURL: "http://localhost:5000/auth/google/callback",
    // profileFields: ["id", "displayName", "name", "gender", "email", "photos"]
  },
  function(token, refreshToken, profile, done) {

    // asynchronous
    process.nextTick(function() {

        // find the user in the database based on their google id
        User.findOne({ 'googleId' : profile.id }, function(err, user) {
            // if there is an error, stop everything and return that
            // ie an error connecting to the database
            if (err)
                return done(err);

            // if the user is found, then log them in
            if (user) {
                return done(null, user); // user found, return that user
            } else {
                    // if there is no user found with that google id, create them
                    var newUser = new User();
                    
                    newUser.email = profile.email;
                    // set all of the google information in our user model
                    newUser.googleId    = profile.id; // set the users google id           
                    newUser.name  = profile.displayName; // look at the passport user profile to see how names are returned
                    // newUser.email = profile.emails[0].value;
                    newUser.money = 0;
                    newUser.gender = profile.gender;
                    newUser.avatar = profile.photos[0].value;
                    // save our user to the database
                    newUser.save(function(err) {
                        if (err)
                            throw err;

                        // if successful, return the new user
                        return done(null, newUser);
                    });
                }
            });
        })
    }
));

passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// used to deserialize the user
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
        done(err, user);
    });
});

router.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
 
router.get('/auth/google/callback', passport.authenticate('google', {
    successRedirect: '/social-login-success',
    failureRedirect: '/login'
  }))

router.get('/social-login-success', function(req, res) {
    var token = jwt.sign({ _id: req.user.id }, 'secretpasstoken', {})
    res.cookie('token', token);
    res.redirect('/')
})
// ---------------------------------



// [GET] /forgotps
router.get('/forgotps', siteController.forgotps);
// [POST] /forgotps
router.post('/forgotps', siteController.forgotpsRequest);

// [GET] /cart/
router.get('/cart', isLoggined, siteController.cart)

// [POST] /checkout/
router.post('/checkout-by-card', isLoggined, siteController.checkoutByCard)
// [POST] /checkoutByWallet
router.post('/checkout-by-wallet', isLoggined, siteController.checkoutByWallet)
// [POST] /checkoutByMomo
router.post('/checkout-by-momo', isLoggined, siteController.checkoutByMomo)
    // [GET] /checkout-by-momo-success
    router.get('/checkout-by-momo-success', isLoggined, siteController.checkoutByMomoSuccess)
// [POST] /checkout-by-paypal
router.post('/checkout-by-paypal', isLoggined, siteController.checkoutByPaypal)
    // [GET] /checkout-by-paypal-success
    router.get('/checkout-by-paypal-success', siteController.checkoutByPaypalSuccess)
    // [GET] /checkout-by-paypal-error
router.get('/checkout-error', siteController.checkoutByPaypalError)

// [POST] /logout/
router.post('/logout', siteController.logout)

// [GET] /login/
router.get('/login', siteController.login)

// [GET] /register/
router.use('/register', siteController.register)

// [GET] /authonize/
router.use('/authonize', siteController.authonize)

// [POST] /validation
router.post('/validation', siteController.validation)

// [POST] /store
router.post('/store', siteController.store)

// [GET] /error/:slug
router.use('/:slug', siteController.error)

// Index
router.get('/', siteController.index)


module.exports = router;