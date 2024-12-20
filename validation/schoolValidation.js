const Joi = require('joi');

const schoolValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    address: Joi.string().required(),
    contactNumber: Joi.string().required(),
    email: Joi.string().email().required()
  })
};

module.exports = schoolValidation;