/*Product apis**/
const {
  updateProductById,
  deleteProduct,
  createProduct,
  getProductById,
  getAllProducts,
} = require("../controller/ProductController");
const express = require("express");
const productRouter = express.Router();
// const app = express();
// app.use(express.json());
// app.route("/api/v1/product")
productRouter.route("/").post(createProduct).get(getAllProducts);

productRouter
  .route(
    "/:id"
  ) /*http://localhost:3000/api/v1/product/661bc6a572e963f3dd5ace52*/
  .patch(updateProductById)
  .get(getProductById)
  .post(deleteProduct);

module.exports = productRouter;
