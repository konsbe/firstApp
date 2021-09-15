const express = require('express');
const router = express.Router({ mergeParams: true });
const catchAsync = require('../utils/catchAsync');
const ExpressError = require('../utils/ExpressError');
const Kitesurf = require('../models/kitesurf');
// const { reviewSchema } = require('../schemas.js');
// const Review = require('../models/review');
const Firm = require('../models/firms');

const { isLoggedIn, isAdmin, decideMiddleware } = require('../middleware');

const session = require('express-session');
const flash = require('connect-flash')



router.get('/', catchAsync(async (req, res) => {
    res.locals.title = "Firms";
    const firms = await Firm.find({})
    res.render('firms/index', { firms })
}))

router.get('/new', isAdmin, catchAsync((req, res) => {
    res.locals.title = "Add a new Company";
    res.render('firms/new')
}))
router.post('/', catchAsync(async (req, res) => {
    const firm = new Firm(req.body)
    await firm.save();
    req.flash('success', 'Succesfully made new firm');
    res.redirect('/firms')
}))

router.get('/:id', catchAsync(async (req, res) => {
    const firm = await Firm.findById(req.params.id).populate('products');
    res.locals.title = firm.name;
    if (!firm) {
        req.flash('error', 'No Firm Found')
        return res.redirect('/firms')
    }
    res.render('firms/show', { firm })
}));

router.get('/:id/kitesurf/new', isAdmin, catchAsync (async (req, res) => {
    res.locals.title = "Add a new Product";
    const { id } = req.params;
    const kiteproducts = await Kitesurf.find({})
    const firm = await Firm.findById(id)
    res.render('kiteproducts/new', { kiteproducts, firm })
}))

router.post('/:id/kitesurf', catchAsync(async (req, res) => {
    const { id } = req.params;
    const firm = await Firm.findById(id).populate('products');
    const { name, image, company, category, subcategory, size, price, description } = req.body.kiteproduct
    const newProduct = new Kitesurf({ name, image, company, category, subcategory, size, price,  description })
    firm.products.push(newProduct);
    newProduct.firm = firm;
    await firm.save();
    await newProduct.save();



    req.flash('success', 'Succesfully made new product');
    res.redirect(`/firms/${id}`)
}))

router.get('/:id/edit', isAdmin, catchAsync(async (req, res) => {
    const { id } = req.params;
    const firms = await Firm.find({});
    const firm = await Firm.findById(id);
    res.locals.title = `Edit: ${firm.name}`;
    res.render('firms/edit', { firm, firms })
}))


router.put('/:id', catchAsync(async (req, res) => {
    const { id } = req.params;
    // const kiteProduct = await Kitesurf.findById(id)
    const firm = await Firm.findByIdAndUpdate(id, { ...req.body });
    req.flash('success', 'Succesfully edit product');
    res.redirect(`/firms/${firm._id}`)
}))


router.delete('/:id', isAdmin, catchAsync(async (req, res) => {
    const firm = await Firm.findByIdAndDelete(req.params.id)
    req.flash('success', 'Firm was deleted successfully');
    res.redirect('/firms')
}))



module.exports = router;