const express = require("express");
const ReviewRouter = express.Router();
const { protectRouteMiddleware } = require("../controller/authController");
const { createReview } = require("../controller/ReviewController");

ReviewRouter.post("/review", protectRouteMiddleware, createReview);
