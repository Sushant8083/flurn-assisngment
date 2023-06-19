const SeatModel = require("../models/seats");
const PriceModel = require("../models/prices");
const BookingModel = require("../models/booking");

exports.getBookingAmount = async function (selectedSeats) {
  let amount = 0;

  for (let i = 0; i < selectedSeats.length; i++) {
    const seat = await SeatModel.findOne({ id: selectedSeats[i] });

    const { seat_class } = seat;
    const priceBasedOnClass = await PriceModel.findOne({ seat_class });
    const allSeatsInClass = await SeatModel.find({ seat_class });

    const SeatsPreviouslyBooked = allSeatsInClass.filter(
      (seat) => seat?.isBooked === true
    );
    const total_seats = allSeatsInClass.length;
    const bookings_count = SeatsPreviouslyBooked.length;

    const occupancy_percentage = (bookings_count / total_seats) * 100;
    var seatAmount = 0;

    if (occupancy_percentage < 40) {
      if (priceBasedOnClass?.min_price.trim().length > 0) {
        seatAmount = priceBasedOnClass?.min_price;
      } else {
        seatAmount = priceBasedOnClass?.normal_price;
      }
    } else if (occupancy_percentage >= 40 && occupancy_percentage <= 60) {
      if (priceBasedOnClass?.normal_price.trim().length > 0) {
        seatAmount = priceBasedOnClass?.normal_price;
      } else {
        seatAmount = priceBasedOnClass?.max_price;
      }
    } else {
      if (priceBasedOnClass?.max_price.trim().length > 0) {
        seatAmount = priceBasedOnClass?.max_price;
      } else {
        seatAmount = priceBasedOnClass?.normal_price;
      }
    }
    seat.isBooked = true
    await seat.save()
    seatAmount = Number(seatAmount.split("$")[1]);
    amount += seatAmount;
  }

  return amount;
};
