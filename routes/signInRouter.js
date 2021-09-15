const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

router.get('/', catchAsync( async(req, res)=> {
    
    res.locals.title = "Log In";
    res.render('loginSignin/signin')
}))

router.post('/', catchAsync(async (req, res) => {
    try {
    const { username, firstName, lastName, email, password, birthDay } = req.body;
    const user = new User({ username, firstName, lastName, email, birthDay });
    const registerUser = await User.register(user, password);
    console.log(registerUser)
    req.login(registerUser, err => {    
        if (err) return next(err)
        req.flash('success', 'Welcome to kitecenter!');
        res.redirect('/kitesurf');
        })
    } catch (e) {
        req.flash('error', e.message);
        res.redirect('/login')
    }
    
    
}))



module.exports = router;