const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const User = require('../models/user');

router.get('/', catchAsync( async(req, res)=> {
    
    res.locals.title = "Log In";
    res.render('loginSignin/signin')
}))

module.exports = router;