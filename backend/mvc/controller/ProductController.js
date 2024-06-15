const ProductModel = require("../model/ProductModel.js");
const {
  getResourceFactory,
  getResourceByIdFactory,
  createResourceFactory,
  deleteResourceByIdFactory,
  updateResourceByIdFactory,
} = require("../utils/resourceFactory.js");

const getAllProducts = getResourceFactory(ProductModel);

const getProductById = getResourceByIdFactory(ProductModel);

const createProduct = createResourceFactory(ProductModel);

const deleteProduct = deleteResourceByIdFactory(ProductModel);

const updateProductById = updateResourceByIdFactory(ProductModel);

module.exports = {
  updateProductById,
  deleteProduct,
  createProduct,
  getProductById,
  getAllProducts,
};
