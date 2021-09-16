const Joi = require('joi');

module.exports.kitesurfSchema = Joi.object({
    kiteproduct: Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        category: Joi.string().required(),
        subcategory: Joi.string().required(),
        size: Joi.string().required(),
        company: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});
module.exports.usedSchema = Joi.object({
    kiteproduct: Joi.object({
        name: Joi.string().required(),
        date: Joi.number().required(),
        image: Joi.string().required(),
        category: Joi.string().required(),
        subcategory: Joi.string().required(),
        size: Joi.string().required(),
        company: Joi.string().required(),
        price: Joi.string().required(),
        description: Joi.string().required()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required(),
        nickname: Joi.string().required()
    }).required()
})


