const Razorpay = require("razorpay");

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLIC_KEY,
  key_secret: process.env.RAZORPAY_PRIVATE_KEY,
});

async function initialBookingController(req, res) {
  try {
    const { productId } = req.body;
    const userId = req.userId;
    if (!productId) {
      return res.status(201).json({
        message: "please provide productId",
      });
    }
    const product = await ProductModel.findById(productId);
    if (!product) {
      return res.status(401).json({
        message: "payment not valid",
      });
    }
    const { price } = product;
    const bookingObject = {
      priceAtThatTime: price,
      userDetails: userId,
      productDetails: productId,
      status: "pending",
    };
    const booking = await BookingModel.create(bookingObject);
    const user = await UserModel.findById(userId);
    user.bookings.push(booking["_id"]);
    await user.save();
    const amount = booking.priceAtThatTime;
    const currency = "INR";
    const payment_capture = 1;
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: booking["_id"],
      payment_capture: payment_capture,
    };
    const orderObject = await razorpayInstance.orders.create(options);
    booking.payment_order_id = orderObject.id;
    await booking.save();
    res.status(200).json({
      status: "success",
      message: orderObject,
      booking: booking,
    });
  } catch (err) {}
}

async function paymentVerificationcontroller(req, res) {
  try {
    const razorPaySign = req.headers["x-razorpay-signature"];
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    shasum.update(JSON.stringify(req.body));
    const freshSignature = shasum.digest("hex");
    if (freshSignature === razorPaySign) {
      const orderId = req.body.payload.payment.entity.order_id;
      const order = await BookingModel.findOne({ payment_order_id: orderId });
      order.status = "confirmed";
      await order.save();
      res.status(200).json({ message: "ok" });
    } else {
      res.status(403).json({ message: "invalid" });
    }
  } catch (err) {}
}

async function allBookings(req, res) {
  try {
    const bookings = await BookingModel.find()
      .populate({ path: "product", select: "name price category" })
      .populate({ path: "user", select: "name email" });
    res.status(200).json({
      bookings: bookings,
      status: "success",
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
}

module.exports = {
  initialBookingController,
  paymentVerificationcontroller,
  allBookings,
};
