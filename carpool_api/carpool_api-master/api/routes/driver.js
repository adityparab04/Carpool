const express = require('express');
const driver_controller = require('../controllers/driver_controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', driver_controller.check);

router.post('/register', driver_controller.register);

router.post('/create_ride', checkAuth , driver_controller.create_ride);

router.post('/delete_create_ride', checkAuth, driver_controller.delete_create_ride);

router.get('/created_ride/:id', checkAuth, driver_controller.get_created_ride_driver);

router.post('/accept_ride', checkAuth, driver_controller.accept_ride);

router.post('/delete_accept_ride', checkAuth, driver_controller.delete_accept_ride);

router.get('/accepted_ride/:id', checkAuth, driver_controller.get_accepted_ride_driver);

router.get('/:id', checkAuth, driver_controller.get_all_information_driver);

module.exports = router;
