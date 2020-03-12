const express = require('express');
const passenger_controller = require('../controllers/passenger_controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

router.get('', passenger_controller.check);

router.post('/register', passenger_controller.register);

router.post('/request_ride', checkAuth, passenger_controller.request_ride);

router.post('/delete_request_ride', checkAuth, passenger_controller.delete_request_ride);

router.get('/requested_ride/:id', checkAuth, passenger_controller.get_requested_ride_passenger);

router.post('/accept_ride', checkAuth, passenger_controller.accept_ride);

router.post('/delete_accept_ride', checkAuth, passenger_controller.delete_accept_ride);

router.get('/accepted_ride/:id', checkAuth, passenger_controller.get_accepted_ride_passenger);

router.get('/:id', checkAuth, passenger_controller.get_all_information_passenger);

module.exports = router;
