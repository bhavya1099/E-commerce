const express = require("express");
const BookingRouter = express.Router();

const { protectRouteMiddleware } = require("../controller/authController");
const {
  initialBookingController,
  paymentVerificationcontroller,
  allBookings,
} = require("../controller/BookingController");

BookingRouter.post(
  "/checkout",
  protectRouteMiddleware,
  initialBookingController
);

BookingRouter.post("/verification", paymentVerificationcontroller);
BookingRouter.get("/:userId", function orderPage(req, res) {});

BookingRouter.get("/", allBookings);

BookingRouter.get(
  "/orders",
  protectRouteMiddleware,
  async function getAllorder() {}
);

module.exports = BookingRouter;
