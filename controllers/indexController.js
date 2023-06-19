const SeatModel = require("../models/seats");
const PriceModel = require("../models/prices");
const BookingModel = require("../models/booking");
const { getBookingAmount } = require("../utils/utils");

exports.homePage = function (req, res) {
  try {
    res.status(200).json({
      status: "SUCCESS",
      message: "Welcome to Homepage",
    });
  } catch (error) {
    res.status(400).json({
      status: "FAILURE",
      message: error?.message,
    });
  }
};

exports.getAllSeats = async function (req, res) {
  try {
    const allSeats = await SeatModel.find()
      .collation({ locale: "en", strength: 2 })
      .sort({ seat_class: 1 });
    res.status(200).json({
      status: "SUCCESS",
      data: allSeats,
    });
  } catch (error) {
    res.status(400).json({
      status: "FAILURE",
      message: error?.message,
    });
  }
};

exports.getSeatPricing = async function (req, res) {
  try {
    const seat = await SeatModel.findOne({ id: req.params.id });
    const { seat_class } = seat;
    const priceBasedOnClass = await PriceModel.findOne({ seat_class });
    const allSeatsInClass = await SeatModel.find({ seat_class });

    const SeatsPreviouslyBooked = allSeatsInClass.filter(
      (seat) => seat?.isBooked === true
    );
    const total_seats = allSeatsInClass.length;
    const bookings_count = SeatsPreviouslyBooked.length;

    const occupancy_percentage = (bookings_count / total_seats) * 100;

    let seatDetails = {
      id: seat?.id,
      seat_class: seat_class,
    };

    if (occupancy_percentage < 40) {
      if (priceBasedOnClass?.min_price.trim().length > 0) {
        seatDetails.price = priceBasedOnClass?.min_price;
      } else {
        seatDetails.price = priceBasedOnClass?.normal_price;
      }
    } else if (occupancy_percentage >= 40 && occupancy_percentage <= 60) {
      if (priceBasedOnClass?.normal_price.trim().length > 0) {
        seatDetails.price = priceBasedOnClass?.normal_price;
      } else {
        seatDetails.price = priceBasedOnClass?.max_price;
      }
    } else {
      if (priceBasedOnClass?.max_price.trim().length > 0) {
        seatDetails.price = priceBasedOnClass?.max_price;
      } else {
        seatDetails.price = priceBasedOnClass?.normal_price;
      }
    }
    res.status(200).json({
      status: "SUCCESS",
      data: seatDetails,
    });
  } catch (error) {
    res.status(400).json({
      status: "FALSE",
      message: error?.message,
    });
  }
};

exports.createBooking = async function (req, res) {
  const bookedSeats = await SeatModel.find({
    isBooked: true,
    id: { $in: req.body.selectedSeats },
  }).select("-seat_identifier -seat_class -isBooked -_id");
  if (bookedSeats.length > 0) {
    return res.json({
      status: "FALSE",
      message: `Seat No : ${bookedSeats.toString()} are already booked. Please select some other seats`,
    });
  }
  const Obj = {
    seats: req.body.selectedSeats,
    userName: req.body.username,
    phoneNumber: req.body.number,
    email:req.body.email
  };

  const CreatedBooking = await BookingModel.create(Obj);
  const bookingAmount = await getBookingAmount(req.body.selectedSeats);

  res.status(200).json({
    status: "SUCCESS",
    data: {
      bookingId: CreatedBooking?.id,
      totalAmount: bookingAmount,
    },
  });
};

exports.retrieveBooking = async function (req, res) {
  try {
    const { userIdentifier } = req.query;

    let allBookings = [];

    if(!userIdentifier){
      res.status(500).json({
        status: "FAIL",
        message: "Please provide either phone number or email",
      });
    }

    allBookings = await BookingModel.find({email:userIdentifier})

    if(allBookings.length === 0) {
      allBookings = await BookingModel.find({phoneNumber:userIdentifier});
    }
    

    if (allBookings) {
      return res.status(200).json({
        status: "SUCCESS",
        data: allBookings,
      });
    }
   
  } catch (error) {
    res.status(400).json({
      status: "FALSE",
      message: error?.message,
    });
  }
};
