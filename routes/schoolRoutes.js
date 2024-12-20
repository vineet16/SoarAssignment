const express = require('express');
const router = express.Router();
const SchoolController = require('../controllers/SchoolController');
const auth = require('../middleware/auth');

router.post('/', auth(['superadmin']), SchoolController.create);
router.get('/', auth(['superadmin', 'school_admin']), SchoolController.getAll);

module.exports = router;