var express = require('express');
const { getAllSeats, getSeatPricing, createBooking, retrieveBooking,homePage } = require('../controllers/indexController');
var router = express.Router();

/* GET home page. */
router.get('/', homePage);

router.get('/seats', getAllSeats);

router.get('/seats/:id', getSeatPricing);

router.post('/booking', createBooking);

router.get('/bookings', retrieveBooking);

module.exports = router;
