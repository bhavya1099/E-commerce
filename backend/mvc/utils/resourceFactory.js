const createResourceFactory = (model) => {
  return async function createProduct(req, res) {
    try {
      const productDetails = req.body;
      console.log("pdt details", req);
      const product = await model.create(productDetails);
      console.log("product", product);
      res.status(200).json({
        status: "success",
        message: "product created successfully",
        product: product,
      });
    } catch (err) {
      res.status(404).json({
        status: "FAILURE",
        message: "failed to create a product",
      });
    }
  };
};

const getResourceFactory = (model) => {
  return async function getAllProducts(req, res) {
    console.log("/ giving problem");
    try {
      //console.log("response:", res);
      if (model.length == 0) {
        throw new Error("No products are present");
      }
      console.log("/ giving problem");
      const productList = await model.find();
      //console.log("product list ", productList);
      res.status(200).json({
        result: "success",
        message: productList,
      });
    } catch (err) {
      res.status(404).json({
        status: "FAILURE",
        message: "failed to fetch all the products",
      });
    }
  };
};

const getResourceByIdFactory = (model) => {
  return async function getProductById(req, res) {
    try {
      const id = req.params.id;
      console.log("request for product by id", id);

      const productById = await model.findById(id);
      console.log("product id", productById);
      if (productById) {
        res.status(200).json({
          status: "successful",
          message: `received the product with id ${id} `,
          product: productById,
        });
      } else {
        throw new Error(`user with ${id}  not found`);
      }
    } catch (err) {
      console.log("checkkk error");
      res.status(404).json({
        status: "FAILURE",
        message: "failed to fetch the product",
      });
    }
  };
};

const deleteResourceByIdFactory = (model) => {
  return async function deleteProduct(req, res) {
    try {
      const id = req.body.id;
      const product = await model.findByIdAndDelete(id);
      // const strProductData = JSON.stringify(productModel);
      if (product) {
        res.status(200).json({
          status: "successful",
          message: `Delete user with id ${id}`,
        });
      }
    } catch (err) {
      res.status(502).json({
        status: "failure",
        message: err.message,
      });
    }
  };
};

const updateResourceByIdFactory = (model) => {
  return async function updateProductById(req, res) {
    try {
      const id = req.params.id;
      const productToUpdate = req.body;
      const product = await model.findByIdAndUpdate(id, productToUpdate, {
        new: true,
      });
      if (product)
        res.status(200).json({
          status: "success",
          message: "product is updated",
          product: product,
        });
    } catch (err) {
      console.log(`Found error:${err}`);
    }
  };
};

module.exports = {
  createResourceFactory,
  getResourceFactory,
  getResourceByIdFactory,
  deleteResourceByIdFactory,
  updateResourceByIdFactory,
};
