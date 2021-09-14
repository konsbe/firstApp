const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Kitesurf = require('../models/kitesurf');
const { kitesurfSchema } = require('../schemas.js');
const { isLoggedIn, isAdmin } = require('../middleware');


const session = require('express-session');
const flash = require('connect-flash');

const validateKiteproduct = (req, res, next) => {
    const { error } = kitesurfSchema.validate(req.body);
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
        const kiteProducts = await Kitesurf.find({ subcategory })
        res.locals.title = "Kitesurf"; 
        res.render('kiteproducts/index', { kiteProducts, subcategory })
    } else {
        const kiteProducts = await Kitesurf.find({})
        res.locals.title = "Kitesurf"; 
        res.render('kiteproducts/index', { kiteProducts, subcategory: "ALL" })
    }
    // const kiteProducts = await Kitesurf.find({});
    // res.locals.title = "Kitesurf"; 
    // res.render('kiteproducts/index', { kiteProducts })
}))

router.get('/new', isLoggedIn, catchAsync(async (req, res) => {
    const kiteproducts = await Kitesurf.find({})
    res.locals.title = "Add a new Product";
    res.render('kiteproducts/new', { kiteproducts })
}))




router.post('/',  catchAsync(async (req, res, next) => {
    


    const newProduct = new Kitesurf(req.body.kiteproduct);
    await newProduct.save();
    req.flash('success', 'Succesfully made new product');


    
    res.redirect(`kitesurf/${newProduct._id}`)

}))


router.get('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    const kiteProducts = await Kitesurf.find({});
    const kiteProduct = await Kitesurf.findById(id).populate('firm', 'name');
    const product = await Kitesurf.findById(id).populate('reviews');
    
    res.locals.title = kiteProduct.name;
    
    if (!product && !kiteProduct) {
        req.flash('error', 'No Product Found');
        res.redirect('/kitesurf');
    }

    res.render('kiteproducts/show', { kiteProduct, kiteProducts, product })
}));

router.get('/:id/edit', catchAsync(async (req, res) => {
    const { id } = req.params;
    const kiteProducts = await Kitesurf.find({});
    const kiteProduct = await Kitesurf.findById(id);
    res.locals.title = `Edit: ${kiteProduct.name}`;

    // if (!product && !kiteProduct) {
    //     req.flash('error', 'No Product Found');
    //     res.redirect('/kitesurf');
    // }
    res.render('kiteproducts/edit', { kiteProduct, kiteProducts })
}))

router.put('/:id', validateKiteproduct, catchAsync(async (req, res) => {
    const { id } = req.params;
    // const kiteProduct = await Kitesurf.findById(id)
    const kiteProduct = await Kitesurf.findByIdAndUpdate(id, { ...req.body.kiteproduct });
    req.flash('success', 'Succesfully edit product');
    res.redirect(`/kitesurf/${kiteProduct._id}`)
}))



router.delete('/:id', catchAsync(async (req, res) => {
    const { id } = req.params
    const deleteProduct = await Kitesurf.findByIdAndDelete(id);
    req.flash('success', 'Product was deleted successfully');
    res.redirect('/kitesurf');
}))





module.exports = router;