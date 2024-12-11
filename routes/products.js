const express = require("express");
const products = express.Router();
const ProductModel = require("../models/ProductModel");
const isArrayEmpty = require("../utils/checkArrayLength");
const validateProductBody = require("../middleware/validateProductBody");
const cloud = require("../middleware/uploadCloudinary");
const authenticationTokenAdmin = require("../middleware/authenticationTokenAdmin");

products.post(
  "/products/create",
  [validateProductBody, authenticationTokenAdmin],
  async (req, res, next) => {
    try {
      const {
        name,
        description,
        category,
        price,
        img,
        ingredients,
        recipe,
        availableInStock,
        nutritionFacts,
      } = req.body;

      const newProduct = new ProductModel({
        name,
        description,
        category,
        price,
        img,
        ingredients,
        recipe,
        availableInStock,
        nutritionFacts,
      });

      const product = await newProduct.save();

      res.status(201).send({
        statusCode: 201,
        message: "Product created successfully",
        product,
      });
    } catch (error) {
      console.error("Error creating product:", error.message);
      next(error);
    }
  }
);

products.post(
  "/products/upload/cloud",
  cloud.single("file"),
  async (req, res, next) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      res.status(201).json({
        message: "File uploaded successfully",
        file: {
          url: req.file.path,
          public_id: req.file.filename,
        },
      });
    } catch (error) {
      next(error);
    }
  }
);

products.get("/products", async (req, res, next) => {
  const { page = 1, pageSize = 8 } = req.query;
  try {
    const products = await ProductModel.find()
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const count = await ProductModel.countDocuments();
    const totalPages = Math.ceil(count / pageSize);

    if (isArrayEmpty(products)) {
      return res.status(404).send({
        statusCode: 404,
        message: "Products not Found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Products Found: ${products.length}`,
      count,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
});

products.get("/products/all", async (req, res, next) => {
  try {
    const products = await ProductModel.find();

    if (isArrayEmpty(products)) {
      return res.status(404).send({
        statusCode: 404,
        message: "No products found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Products Found: ${products.length}`,
      products,
    });
  } catch (error) {
    next(error);
  }
});

products.get("/products/:productId", async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Product ID is required",
    });
  }

  try {
    const productExist = await ProductModel.findById(productId);
    if (!productExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Product not found with the given Product Id",
      });
    }

    res.status(200).send(productExist);
  } catch (error) {
    next(error);
  }
});

products.get("/products/search/:category", async (req, res, next) => {
  const { category } = req.params;
  const { page = 1, pageSize = 6 } = req.query;

  if (!category) {
    return res.status(400).send({
      statusCode: 400,
      message: "Category is required",
    });
  }

  try {
    const products = await ProductModel.find({
      category: {
        $regex: ".*" + category + ".*",
        $options: "i",
      },
    })
      .limit(pageSize)
      .skip((page - 1) * pageSize);

    const count = await ProductModel.countDocuments({
      category: {
        $regex: ".*" + category + ".*",
        $options: "i",
      },
    });

    const totalPages = Math.ceil(count / pageSize);

    if (isArrayEmpty(products)) {
      return res.status(404).send({
        statusCode: 404,
        message: "Category not Found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Products Found: ${products.length}`,
      count,
      totalPages,
      products,
    });
  } catch (error) {
    next(error);
  }
});

products.patch("/products/update/:productId", async (req, res, next) => {
  const { productId } = req.params;

  if (!productId) {
    return res.status(400).send({
      statusCode: 400,
      message: "Product ID is required",
    });
  }

  try {
    const productExist = await ProductModel.findById(productId);

    if (!productExist) {
      return res.status(404).send({
        statusCode: 404,
        message: "Product not found with the given Product Id",
      });
    }

    const updateProductData = req.body;
    const options = { new: true };
    const result = await ProductModel.findByIdAndUpdate(
      productId,
      updateProductData,
      options
    );

    res.status(200).send({
      statusCode: 200,
      message: "Product updated successfully",
      product: result,
    });
  } catch (error) {
    next(error);
  }
});

products.delete("/products/delete/:productId", async (req, res, next) => {
  const { productId } = req.params;

  try {
    const deletedProduct = await ProductModel.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).send({
        statusCode: 404,
        message: "Product not found",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Product deleted successfully",
      product: deletedProduct,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = products;
