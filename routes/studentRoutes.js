const express = require('express');
const router = express.Router();
const StudentController = require('../controllers/StudentController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const studentValidation = require('../validation/studentValidation');

router.post( '/', auth(['school_admin']), validate(studentValidation.create), StudentController.create);

router.get( '/', auth(['school_admin', 'superadmin']), StudentController.getAll);

router.get( '/:id', auth(['school_admin', 'superadmin']), StudentController.getById);

router.put( '/:id', auth(['school_admin']), validate(studentValidation.update), StudentController.update);

router.delete( '/:id', auth(['school_admin']), StudentController.delete);

router.get( '/school/:schoolId', auth(['school_admin', 'superadmin']), StudentController.getAll);

router.post( '/:id/transfer', auth(['school_admin', 'superadmin']), validate(studentValidation.transfer), StudentController.transfer);

module.exports = router;