const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Kitesurf = require('../models/kitesurf');
const { reviewSchema } = require('../schemas.js');
const Review = require('../models/review');


const session = require('express-session');
const flash = require('connect-flash')

const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.post('/', validateReview, catchAsync(async (req, res) => {
    const { id } = req.params;
    const kiteProduct = await Kitesurf.findById(id);
    const review = new Review(req.body.review);
    kiteProduct.reviews.push(review);
    await review.save();
    await kiteProduct.save();
    req.flash('success', 'Review post successfully');
    res.redirect(`/kitesurf/${kiteProduct._id}`)

}))

router.delete('/:reviewId', catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Kitesurf.findByIdAndUpdate(id, {$pull: {reviews: reviewId}})
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review post deleted successfully');
    res.redirect(`/kitesurf/${id}`);
}))


module.exports = router;