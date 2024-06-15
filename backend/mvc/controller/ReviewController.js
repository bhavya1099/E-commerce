async function createReview(req, res) {
  try {
    const { rating, review_title, review_desc, product_id } = req.body;
    const userId = req.userId;
    //form the object to work with schema
    let reviewObj = {
      rating,
      review_title,
      review_desc,
      product: product_id,
      user: userId,
    };
    //add the review
    const review = await ReviewModel.create(reviewObj);
    //find the product
    const product = await ProductModel.findById(product_id);
    //add reviews to it
    product.reviews.push(review["_id"]);
    await product.save();
    res.status(200).json({
      status: "success",
      review,
    });
  } catch (err) {
    res.status(500).json({
      message: "server error",
      err: err.message,
    });
  }
}

module.exports = { createReview };
