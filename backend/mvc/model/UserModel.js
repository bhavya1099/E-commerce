/***
 * amazon - name,email,password,role
 * **/
const mongoose = require("mongoose");

const userSchemaRules = {
  name: {
    type: String,
    required: [true, "name is required for the user"],
  },
  password: {
    type: String,
    required: [true, "Password is required for the user"],
  },
  email: {
    type: String,
    required: [true, "Email is required for the user"],
    unique: true,
  },
  confirmPassword: {
    type: String,
    required: true,
    validator: function () {
      return this.password === this.confirmPassword;
    },
  },
  role: {
    type: String,
    default: "user",
  },
  otp: {
    type: String,
  },
  otpExpiry: {
    type: Date,
  },
  bookings: {
    type: [mongoose.Schema.ObjectId],
    ref: "bookingModel",
  },
};

let roles = ["user", "admin", "vendor", "buyers"];

const userSchema = new mongoose.Schema(userSchemaRules);
// userSchema.pre("save", function () {
//   //pre function is executed before the data is saved in the database
//   this.confirmPassword = undefined;
// });

//not send password to frontend
// userSchema.pre("findOne", function () {
//   this.select("-password");
//   this.select("-__v");
// });

//implement dynamic list of roles, not restrict user to be in one role
userSchema.pre("save", function (next) {
  if (roles.includes(this.role)) {
    next();
  } else {
    next("role is undefined!");
  }
});

userSchema.post("save", function (err, doc, next) {
  console.log("error is ", err);
  if (err.code === 11000) {
    next("email is already taken.");
  } else {
    next(err);
  }
});
const UserModel = new mongoose.model("UserModel", userSchema);

module.exports = UserModel;
