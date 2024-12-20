const express = require('express');
const router = express.Router();
const ClassroomController = require('../controllers/ClassroomController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const classroomValidation = require('../validation/classroomValidation');

router.post( '/', auth(['school_admin']), validate(classroomValidation.create), ClassroomController.create);

router.get( '/', auth(['school_admin', 'superadmin']), ClassroomController.getAll);

router.get( '/:id', auth(['school_admin', 'superadmin']), ClassroomController.getById);

router.put( '/:id', auth(['school_admin']), validate(classroomValidation.update), ClassroomController.update);

router.delete( '/:id', auth(['school_admin']), ClassroomController.delete);

module.exports = router;