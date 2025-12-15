const express = require("express");
const reviews = express.Router();
const ReviewModel = require("../models/ReviwesModel");
const ProductModel = require("../models/ProductModel");
const UserModel = require("../models/UserModel");

reviews.get("/reviews", async (req, res, next) => {
  try {
    const allReviews = await ReviewModel.find().populate("user product");

    if (allReviews.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "Review not Found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Reviews found successfully",
      reviews: allReviews,
    });
  } catch (error) {
    next(error);
  }
});

reviews.get("/reviews/product/:productId", async (req, res, next) => {
  const { productId } = req.params;

  try {
    const reviewsForProduct = await ReviewModel.find({
      product: productId,
    })
      .populate("user", "name surname email role") // 🔥 populate pulito
      .sort({ createdAt: -1 });

    // ✅ SEMPRE 200
    res.status(200).send({
      statusCode: 200,
      reviews: reviewsForProduct, // anche se []
    });
  } catch (error) {
    next(error);
  }
});

reviews.post("/reviews/create", async (req, res, next) => {
  const { rating, comment, user: userId, product: productId } = req.body;

  try {
    const user = await UserModel.findOne({ _id: userId });
    const product = await ProductModel.findOne({ _id: productId });

    if (!user || !product) {
      return res.status(404).send({
        statusCode: 404,
        message: "User or Product not founded",
      });
    }

    const newReview = new ReviewModel({
      comment,
      rating,
      user: user._id,
      product: product._id,
    });

    const savedReview = await newReview.save();

    await ProductModel.updateOne(
      { _id: product._id },
      { $push: { ratings: savedReview._id } }
    );

    res.status(201).send({
      statusCode: 201,
      message: "Review successfully created",
      savedReview,
    });
  } catch (error) {
    next(error);
  }
});

reviews.patch("/reviews/update/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;

  if (!reviewId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Review ID is required",
    });
  }

  try {
    const reviewExist = await ReviewModel.findById(reviewId);

    if (!reviewExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Review not found with the given Review Id",
      });
    }

    const updateReviewData = req.body;
    const options = { new: true };
    const result = await ReviewModel.findByIdAndUpdate(
      reviewId,
      updateReviewData,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Review updated successfully",
      review: result,
    });
  } catch (error) {
    next(error);
  }
});

reviews.delete("/reviews/delete/:reviewId", async (req, res, next) => {
  const { reviewId } = req.params;

  try {
    const deletedReview = await ReviewModel.findByIdAndDelete(reviewId);

    if (!deletedReview) {
      return res.status(404).send({
        statusCode: 404,
        message: "Review not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Review deleted successfully",
      review: deletedReview,
    });
  } catch (error) {
    next(error);
  }
});
module.exports = reviews;
