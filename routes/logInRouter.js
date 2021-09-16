const express = require('express');
const passport = require('passport');
const { findById } = require('../models/user');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user')
const session = require('express-session');

router.get('/', catchAsync( async(req, res)=> {
    
    res.locals.title = "Log In";
    res.render('loginSignin/logIn')
}))

router.post('/', passport.authenticate('local', { failureFlash: true, failureRedirect: '/login'}), catchAsync(async (req, res) => {
    const { id } = req.params
    const lUser = await User.findById(id)
    const currentUser = await req.user.username
    req.flash('success', `${currentUser} you have succesfully log in`);
    const redirectUrl = req.session.returnTo || '/kitesurf';
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}))





module.exports = router;