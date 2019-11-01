const express = require('express');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
const router = express.Router();

// const User = require('../models/users');
const UserController = require('../controllers/users')

router.post('/signup', UserController.usersPostSignup);


// Route for login into the app
router.post('/login', UserController.usersPostLogin);

router.delete('/:userUUID', UserController.userDeleteOne);

module.exports = router;
