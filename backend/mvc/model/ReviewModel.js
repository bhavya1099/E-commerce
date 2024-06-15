const mongoose = require("mongoose");
const reviewSchemaRules = {
  createAt: {
    type: Date,
    default: Date.now(),
  },
  rating: {
    type: Number,
    required: true,
    min: [1, "rating cannot be less than 1"],
    max: [5, "rating cannot be greater than 5"],
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  review_title: {
    type: String,
    required: true,
  },
  review_desc: {
    type: String,
    required: true,
  },
  averageRating: {
    type: Number,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "UserModel",
  },
  product: {
    type: mongoose.Schema.ObjectId,
    required: true,
    ref: "ProductModel",
  },
};

const reviewSchema = new mongoose.Schema(reviewSchemaRules);
const ReviewModel = new mongoose.model("ReviewModel", reviewSchema);
module.exports = ReviewModel;
