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
    }).populate("user");

    if (reviewsForProduct.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No reviews found for this product",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Reviews retrieved successfully",
      reviews: reviewsForProduct,
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
      { $push: { reviews: savedReview._id } }
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

module.exports = reviews;
