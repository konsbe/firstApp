const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');


router.get('/', catchAsync( async(req, res)=> {
    
    res.locals.title = "Log In";
    res.render('loginSignin/logIn')
}))

router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), catchAsync(async (req, res) => {
    req.flash('success', 'You have succesfully log in');
    res.redirect('/kitesurf')
}))



module.exports = router;