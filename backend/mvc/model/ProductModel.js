const mongoose = require("mongoose");
const productSchemaRules = {
  //predefined set of rules and constraints of data validation
  producedBy: String,
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 1,
  },
  discount: {
    type: Number,
    validate: function () {
      return this.price > this.discount;
    },
  },
  brand: String,
  categories: {
    type: [String],
    required: true,
  },
  reviews: {
    type: [mongoose.Schema.Types.ObjectId],
    ref: "ReviewModel",
  },
};

const productSchema = new mongoose.Schema(productSchemaRules);
const ProductModel = new mongoose.model("ProductModel", productSchema);
const categories = [
  "electronics",
  "jewellery",
  "men's clothing",
  "women's clothing",
];

productSchema.pre("save", function (next) {
  let isPresent = categories.find((cCategory) => {
    return this.categories.includes(cCategory);
  });
  if (isPresent == undefined) {
    const error = new Error("category is invalid");
    return next(error);
  }
  return next();
});

productSchema.pre("findOne", function (next) {
  this.select("-__v");
  next();
});
module.exports = ProductModel;
