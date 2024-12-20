const Joi = require('joi');

const authValidation = {
  register: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      .required()
      .messages({
        'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
      }),
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    role: Joi.string().valid('superadmin', 'school_admin', 'teacher', 'student').required(),
    school: Joi.string().when('role', {
      is: Joi.string().valid('school_admin', 'teacher', 'student'),
      then: Joi.required(),
      otherwise: Joi.forbidden()
    })
  }),

  login: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  refreshToken: Joi.object({
    refreshToken: Joi.string().required()
  }),

  forgotPassword: Joi.object({
    email: Joi.string().email().required()
  })
};

module.exports = authValidation;
