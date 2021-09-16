const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Used = require('../models/used');
const { usedSchema } = require('../schemas.js');
const { isLoggedIn, isAdmin } = require('../middleware');

const validateUsedKiteproduct = (req, res, next) => {
    const { error } = usedSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400);
    } else {
        next();
    }
}

router.get('/', catchAsync(async (req, res) => {
    const { subcategory } = req.query;
    
    if (subcategory) {
        const usedProducts = await Used.find({ subcategory })
        res.locals.title = "Used Products"; 
        res.render('usedProducts/index', { usedProducts, subcategory })
    } else {
        const usedProducts = await Used.find({})
        res.locals.title = "Used Products"; 
        res.render('usedProducts/index', { usedProducts, subcategory: "ALL" })
    }
    // const kiteProducts = await Kitesurf.find({});
    // res.locals.title = "Kitesurf"; 
    // res.render('kiteproducts/index', { kiteProducts })
}))



router.get('/new',  isLoggedIn, catchAsync(async (req, res) => {
    const usedproducts = await Used.find({})
    res.locals.title = "Add a new Product";
    res.render('usedProducts/new', { usedproducts })
}))




router.post('/', isLoggedIn, catchAsync(async (req, res, next) => {
    


    const newUsedProduct = new Used(req.body.usedproduct);
    await newUsedProduct.save();
    req.flash('success', 'Succesfully made new product');


    
    res.redirect(`used/${newUsedProduct._id}`)

}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const usedProducts = await Used.find({});
    const usedProduct = await Used.findById(id);
    // const product = await Used.findById(id).populate('reviews');
    
    res.locals.title = usedProduct.name;
    
    if (!usedProduct) {
        req.flash('error', 'No Product Found');
        res.redirect('/used');
    }

    res.render('usedProducts/show', { usedProduct, usedProducts })  //, product
}));


router.get('/:id/edit', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params;
    const usedProducts = await Used.find({});
    const usedProduct = await Used.findById(id);
    res.locals.title = `Edit: ${usedProduct.name}`;

    // if (!product && !kiteProduct) {
    //     req.flash('error', 'No Product Found');
    //     res.redirect('/kitesurf');
    // }
    res.render('usedProducts/edit', { usedProduct, usedProducts })
}))


router.put('/:id', isLoggedIn, validateUsedKiteproduct, catchAsync(async (req, res) => {
    const { id } = req.params;
    // const kiteProduct = await Kitesurf.findById(id)
    const usedProduct = await Used.findByIdAndUpdate(id, { ...req.body.usedproduct });
    req.flash('success', 'Succesfully edit product');
    res.redirect(`/used/${usedProduct._id}`)
}))



router.delete('/:id', isLoggedIn, catchAsync(async (req, res) => {
    const { id } = req.params
    const deleteProduct = await Used.findByIdAndDelete(id);
    req.flash('success', 'Product was deleted successfully');
    res.redirect('/used');
}))



module.exports = router;







