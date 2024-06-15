const express = require("express");
const AuthRouter = express.Router();
const {
  getUserData,
  protectRouteMiddleware,
  resetPasswordController,
  forgetPasswordController,
  loginController,
  signUpController,
} = require("../controller/authController.js");

AuthRouter.post("/signUp", signUpController);
/***verify the email***/
AuthRouter.post("/login", loginController);
AuthRouter.patch("/forgetPassword", forgetPasswordController); //Authent
AuthRouter.patch("/resetPassword/:id", resetPasswordController);
AuthRouter.get("/allowedIfLoggedIn", protectRouteMiddleware, getUserData); //authentication if middlware is involved
module.exports = AuthRouter;
