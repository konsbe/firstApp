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
    const { username, firstName, lastName, email, password, birthDay } = req.body;
    const user = new User({ username, firstName, lastName, email, birthDay });
    const registerUser = await User.register(user, password);
    console.log(registerUser)
    req.flash('success', 'Welcome to kitecenter!');
    
    
    res.redirect('/kitesurf');
}))



module.exports = router;