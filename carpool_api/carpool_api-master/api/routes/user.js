const express = require('express');
const user_controller = require('../controllers/user_controller');

const router = express.Router();

router.get('/created_ride', user_controller.getCreatedRide);

router.get('/requested_ride', user_controller.getRequestedRide);

router.post('/login', user_controller.login);

module.exports = router;
