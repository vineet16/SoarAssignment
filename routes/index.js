const express = require('express');
const router = express.Router();
const schoolRoutes = require('./schoolRoutes');
const classroomRoutes = require('./classroomRoutes');
const studentRoutes = require('./studentRoutes');
const AuthController = require('../controllers/AuthController');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const authValidation = require('../validation/authValidation');

router.use('/schools', schoolRoutes);
router.use('/classrooms', classroomRoutes);
router.use('/students', studentRoutes);

router.post( '/auth/register', validate(authValidation.register), AuthController.register);
  
router.post( '/auth/login', validate(authValidation.login), AuthController.login);
  
router.post( '/auth/refresh-token', validate(authValidation.refreshToken), AuthController.refreshToken);
  
router.post( '/auth/forgot-password', validate(authValidation.forgotPassword), AuthController.forgotPassword);
  
router.post( '/auth/logout', auth(['superadmin', 'school_admin', 'teacher', 'student']), AuthController.logout);
  

module.exports = router;