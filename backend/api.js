const dotEnv = require("dotenv"); //to integrate .env creds with this file
dotEnv.config();
const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const promisifiedJWTVerify = promisify(jwt.verify);
const cookieParser = require("cookie-parser");
const express = require("express");
const crypto = require("crypto");
const shortUniqueId = require("short-unique-id");
const {
  protectRouteMiddleware,
} = require("./mvc/controller/authController.js");
const uid = new shortUniqueId({ length: 10 });
const app = express();
const Razorpay = require("razorpay");

const cors = require("cors");
app.use(express.json());
app.use(cors());

const mongoose = require("mongoose"); //used to connect to mongodb database

const UserModel = require("./mvc/model/UserModel.js");

const { DB_USER, DB_PASSWORD } = process.env;
const PORT = process.env.PORT || LOCAL_PORT;

app.listen(3001, function () {
  console.log("server is running at port 3001");
});

console.log("razor pay public key", process.env.RAZORPAY_PUBLIC_KEY);

//connection with the database
const dbUrl = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@projectcluster.mnamope.mongodb.net/?retryWrites=true&w=majority&appName=ProjectCluster`;
mongoose
  .connect(dbUrl)
  .then(function (connection) {
    console.log("mongodb--");
  })
  .catch(function (err) {
    console.log("found error while connnecting");
  });

/***
 * ProductModule ->
 * schema
 *    uniqueID
 *    item name
 *    description
 *    price
 *    discount
 * ****/

/**rules to define an entity***/

app.use(express.json());
app.use(cookieParser());
const appRouter = express.Router();

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_PUBLIC_KEY,
  key_secret: process.env.RAZORPAY_PRIVATE_KEY,
});

app.use("/api/v1", appRouter);

const productRouter = require("./mvc/router/ProductRouter.js");
appRouter.use("/product", productRouter);

const userRouter = require("./mvc/router/UserRouter.js");
appRouter.use("/user", userRouter);

const AuthRouter = require("./mvc/router/AuthRouter.js");
appRouter.use("/auth", AuthRouter);

const BookingRouter = require("./mvc/router/BookingRouter.js");
appRouter.use("/booking", BookingRouter);
// appRouter.get("/review/:productId",getAllReviewsOfAProduct);
// appRouter.get("/review",getAllReviews);

app.get("/", (req, res) => {
  res.send("hello world");
});
//booking route
app.post("/checkout", async (req, res) => {
  try {
    const amount = 500;
    const currency = "INR";
    const receipt = `rec_${uid.rnd()}`;
    const payment_capture = 1;
    const options = {
      amount: amount * 100,
      currency: currency,
      receipt: receipt,
      payment_capture: payment_capture,
    };
    //order creation
    const orderObject = await razorpayInstance.orders.create(options);
    //console.log("order object", orderObject);
    res.status(200).json({
      status: "success",
      message: orderObject,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/verify", async (req, res) => {
  try {
    //on payment gateway -> req.body + webhook ->hash
    const razorPaySign = req.headers("x-razorpay-signature");
    //create hash
    const shasum = crypto.createHmac("sha256", process.env.WEBHOOK_SECRET);
    //whatever data is send by razorpay
    shasum.update(JSON.stringify(req.body));

    const freshSignature = shasum.digest("hex");
    console.log("payment verification");
    if (freshSignature === razorPaySign) {
      console.log("Payment is verified");
      console.log("order data", req.body);
      res.status(200).json({
        message: "ok",
      });
    } else {
      res.status(403).json({
        message: "Invalid",
      });
    }
  } catch (err) {}
  console.log(req.headers);
  console.log(req.body);
  res.json({ message: "payment verified" });
});

const getAllUsers = async function (req, res) {
  try {
    // -> if you don't pass anything -> return you the whole collection
    // -> if want to filter -> parameter -> an object
    //console.log("response from users", res);
    const listOfUser = await UserModel.find();
    res.status(200).json({
      status: "successfull",
      message: `list of the user `,
      UserList: listOfUser,
    });
  } catch (err) {
    res.status(404).json({
      status: "failure",
      message: err.message,
    });
  }
};

const isAdminMiddleware = async function (req, res, next) {
  try {
    const id = req.userId;
    const user = await UserModel.findById(id);

    if (user.role === "admin") {
      next();
    } else {
      res.status(401).json({
        message: "you are not authorized",
        status: "failure",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

// const protectRouteMiddleware = async (req, res, next) => {
//   try {
//     const token = req.cookies.jwt;
//     if (token === undefined) {
//       res.status(401).json({
//         status: "failure",
//         message: "you need to be logged in",
//       });
//     } else {
//       const payload = await promisifiedJWTVerify(token, JWT_SECRET);
//       const id = payload.id;
//       req.userId = id;
//       next();
//     }
//   } catch (err) {
//     res.status(500).json({
//       status: "failure",
//       message: err.message,
//     });
//   }
// };

/**create a user***/

//app.get("verify", verifyController);

/***allow only to admin***/
app.get(
  "/allowOnlyAdmin",
  protectRouteMiddleware,
  isAdminMiddleware,
  getAllUsers
);
