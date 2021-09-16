const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Used = require('../models/used');
const { reviewUsedSchema } = require('../schemas.js');
const ReviewUsed = require('../models/reviewUsed');

const { isLoggedIn } = ('../middleware')

const session = require('express-session');
const flash = require('connect-flash')

const validateReview = (req, res, next) => {
    const { error } = reviewUsedSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/',  validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const usedProduct = await Used.findById(id);
    const review = new ReviewUsed(req.body.reviewused);
    usedProduct.reviews.push(review);
    await review.save();
    await usedProduct.save();
    req.flash('success', 'Review post successfully');
    res.redirect(`/used/${usedProduct._id}`)

}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Used.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await ReviewUsed.findByIdAndDelete(reviewId);
    req.flash('success', 'Review post deleted successfully');
    res.redirect(`/used/${id}`);
}))


module.exports = router;