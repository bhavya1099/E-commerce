const mongoose = require("mongoose");

const bookingSchemaRules = {
  bookingBy: String,
  bookedAt: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  payment_order_id: {
    type: String,
    required: true,
  },
  priceAtThatTime: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "UserModel",
  },
  status: {
    type: String,
    enum: ["pending", "failed", "success"],
    required: true,
    default: "pending",
  },
};

const bookingSchema = new mongoose.Schema(bookingSchemaRules);
const BookingModel = new mongoose.model("ProductModel", bookingSchema);

module.exports = BookingModel;
