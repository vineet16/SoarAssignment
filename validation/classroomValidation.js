const Joi = require('joi');

const classroomValidation = {
  create: Joi.object({
    name: Joi.string().required(),
    capacity: Joi.number().required().min(1),
    school: Joi.string().required(),
    resources: Joi.array().items(Joi.string())
  }),

  update: Joi.object({
    name: Joi.string(),
    capacity: Joi.number().min(1),
    resources: Joi.array().items(Joi.string())
  }),

  updateCapacity: Joi.object({
    capacity: Joi.number().required().min(1),
    reason: Joi.string()
  }),

  addResource: Joi.object({
    resource: Joi.string().required(),
    quantity: Joi.number().default(1)
  }),

  bulkCreate: Joi.object({
    classrooms: Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        capacity: Joi.number().required().min(1),
        school: Joi.string().required(),
        resources: Joi.array().items(Joi.string())
      })
    ).min(1).required()
  })
};

module.exports = classroomValidation;