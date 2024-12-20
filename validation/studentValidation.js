const Joi = require('joi');

const studentValidation = {
  create: Joi.object({
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    dateOfBirth: Joi.date().required(),
    school: Joi.string().required(),
    classroom: Joi.string().required()
  }),

  update: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string(),
    dateOfBirth: Joi.date(),
    classroom: Joi.string()
  }),

  transfer: Joi.object({
    newSchoolId: Joi.string().required(),
    newClassroomId: Joi.string().required(),
    transferDate: Joi.date().default(Date.now),
    reason: Joi.string()
  }),

  enroll: Joi.object({
    classroomId: Joi.string().required(),
    enrollmentDate: Joi.date().default(Date.now)
  }),

  bulkCreate: Joi.object({
    students: Joi.array().items(
      Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        dateOfBirth: Joi.date().required(),
        school: Joi.string().required(),
        classroom: Joi.string().required()
      })
    ).min(1).required()
  }),

  bulkTransfer: Joi.object({
    studentIds: Joi.array().items(Joi.string()).min(1).required(),
    newSchoolId: Joi.string().required(),
    newClassroomId: Joi.string().required(),
    transferDate: Joi.date().default(Date.now),
    reason: Joi.string()
  })
};

module.exports = studentValidation;