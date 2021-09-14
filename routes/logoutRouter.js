const express = require('express');
const passport = require('passport');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');

router.get('/', (req, res) => {
    req.logout();
    req.flash('success', 'You have loggd out')
    res.redirect('/kitesurf')
})



module.exports = router;