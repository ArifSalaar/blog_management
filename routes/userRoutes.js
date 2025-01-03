const express = require('express');
const { signup, login } = require('../controllers/userController');
const { signupValidation } = require('../middleware/validateMiddleware');
const { validate } = require('../middleware/validateMiddleware');
const { uploadProfileImage } = require('../controllers/userController');
const {multiUpload} = require('../middleware/uploadHandler')





const router = express.Router();

router.post('/signup', signupValidation, validate, signup);
router.post('/login', login);
router.post("/upload/profile-image/:id", multiUpload, uploadProfileImage);


module.exports = router;
