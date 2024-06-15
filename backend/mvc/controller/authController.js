const { promisify } = require("util");
const jwt = require("jsonwebtoken");
const promisifiedJWTSign = promisify(jwt.sign);
const promisifiedJWTVerify = promisify(jwt.verify);
const welcomeEmailHelper = require("../../mailGun.js");
const { JWT_SECRET } = process.env;
const UserModel = require("../model/UserModel.js");

const signUpController = async (req, res) => {
  try {
    const userObject = req.body;
    console.log("user object!!", userObject);
    let newUser = await UserModel.create(userObject);
    res.status(201).json({
      message: "successfully signed up",
      status: "success",
      user: newUser,
    });
    await welcomeEmailHelper("welcome.html", newUser.email, {
      name: newUser.name,
    });
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "success",
    });
  }
};

const loginController = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  if (email === undefined || password === undefined) {
    return res.status(401).json({
      status: "failure",
      message: "please enter email to login",
    });
  }

  if (email) {
    const user = await UserModel.findOne({ email: email });
    if (user) {
      console.log(
        "password and user",
        password,
        user,
        user.password,
        JWT_SECRET
      );
      if (password === user.password) {
        const authToken = await promisifiedJWTSign(
          { id: user._id },
          JWT_SECRET
        );
        res.cookie("jwt", authToken, {
          maxAge: 1000 * 60 * 60 * 24,
          httpOnly: true,
        });
        res.status(200).json({
          message: "LoggedIn successfully",
          authToken: authToken,
        });
      } else {
        res.status(404).json({
          message: "User is not logged In",
        });
      }
    } else {
      res.status(401).json({
        status: "failure",
        message: "email or password is incorrect",
      });
    }
  }
};

function otpCreator() {
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

const forgetPasswordController = async (req, res) => {
  try {
    /**
     * 1. ask for email
     * 2. check if email is present or not
     * if email is not present send a response that user is not found
     * 3. if email is present create basic otp and send to the email
     * 4. store the otp to avoid collision
     * response -> unique url with (id of user) and that will form your reset password
     */
    console.log("req.body.email", req.body.email);
    if (req.body.email) {
      const user = await UserModel.findOne({ email: req.body.email });
      console.log("user", user);
      if (user) {
        //otp creation
        const otp = otpCreator();
        user.otp = otp;
        user.otpExpiry = new Date(Date.now() + 1000 * 60 * 10);
        //save the otp and expiry in db as well

        await user.save();
        res.status(200).json({
          status: "success",
          message: "otp sent to your email",
          resetUrl: `http://localhost:3000/resetPassword/${user["_id"]}`,
          otp: otp,
        });
        console.log("save the otp");
        await welcomeEmailHelper("otp.html", user.email, {
          name: user.name,
          otp: otp,
        });
        console.log("save the otp after email helper");
      } else {
        res.status(404).json({
          status: "failure",
          message: "User not found for this email",
        });
      }
    } else {
      res.status(401).json({
        status: "failure",
        message: "Please enter your email for forget password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

const resetPasswordController = async (req, res, next) => {
  try {
    let resetDetails = req.body;
    // checking for all the inputs
    if (
      !resetDetails.password == true ||
      !resetDetails.otp == true ||
      !resetDetails.confirmPassword == true
    ) {
      res.status(401).json({
        status: "failure",
        message: "invalid request",
      });
    }
    const userId = req.params.id;
    if (userId) {
      const user = await UserModel.findById(userId);
      if (user) {
        const otp = req.body.otp;
        if (user.otp === otp) {
          let currentTime = new Date();
          if (currentTime < user.otpExpiry) {
            user.password = req.body.password;
            user.confirmPassword = req.body.confirmPassword;
            user.otp = undefined;
            user.otpExpiry = undefined;
            await user.save();
            res.status(200).json({
              status: "success",
              message: "password reset successfully !",
            });
          } else {
            res.status(401).json({
              status: "failure",
              message: "otp expired",
            });
          }
        }
      }
    } else {
      res.status(401).json({
        status: "failure",
        message: "Please enter your email for forget password",
      });
    }
  } catch (err) {
    res.status(500).json({
      message: err.message,
      status: "failure",
    });
  }
};

const protectRouteMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (token === undefined) {
      res.status(401).json({
        status: "failure",
        message: "you need to be logged in",
      });
    } else {
      const payload = await promisifiedJWTVerify(token, JWT_SECRET);
      const id = payload.id;
      req.userId = id;
      next();
    }
  } catch (err) {
    res.status(500).json({
      status: "failure",
      message: err.message,
    });
  }
};

const getUserData = async (req, res) => {
  try {
    const id = req.userId;
    const user = await UserModel.findById(id);
    res.status(200).json({
      user: user,
      message: "data retrieved successfully",
    });
  } catch (err) {
    res.status(404).json({
      status: "FAILURE",
      message: err.message,
    });
  }
};

module.exports = {
  getUserData,
  protectRouteMiddleware,
  resetPasswordController,
  forgetPasswordController,
  loginController,
  signUpController,
};
