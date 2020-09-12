const Product = require("../models/product");
const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const { request } = require("https");

exports.getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate("category")
    .exec((err, product) => {
      if (err) {
        return res.status(400).json({
          error: "No product Found with Id",
        });
      }

      req.product = product;
      next();
    });
};

exports.createProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image",
      });
    }

    // De structure fields
    const { name, description, price, category, stock } = fields;
    if (!name || !description || !price || !category || !stock) {
      return res.status(400).json({
        error: "All fields are mandatory",
      });
    }

    var product = new Product(fields);

    // Handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      console.log(product);

      // product.photo.data = fs.readFileSync(file.photo.path);
      // product.photo.contentType = file.photo.type;
    }

    // Save to DB
    product.save((err, newProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Product Save failed",
        });
      }

      res.json(newProduct);
    });
  });
};

exports.getProduct = (req, res) => {
  req.photo = undefined;
  return res.json(req.product);
};

exports.photo = (req, res, next) => {
  if (req.product.photo) {
    if (req.product.photo.data) {
      res.set({ "Content-Type": req.product.photo.contentType });
      return res.send(req.product.photo.data);
    }
  }
  next();
};

exports.deleteProduct = (req, res) => {
  //
  let product = req.product;
  product.remove((err, deletedProduct) => {
    if (err) {
      return res.status(400).json({
        error: "Failed to delete product",
      });
    }

    return res.json({
      message: "Product delete successfully",
      deletedProduct,
    });
  });
};

exports.updateProduct = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true;

  form.parse(req, (err, fields, file) => {
    if (err) {
      return res.status(400).json({
        error: "Problem in Image",
      });
    }

    // Update product logic
    var product = req.product;
    product = _.extend(product, fields);

    // Handle file
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: "File size is too big",
        });
      }

      // product.photo.data = fs.readFileSync(file.photo.path);
      // product.photo.contentType = file.photo.type;
    }

    // Save to DB
    product.save((err, updatedProduct) => {
      if (err) {
        return res.status(400).json({
          error: "Product updation failed",
        });
      }

      res.json(updatedProduct);
    });
  });
};

exports.getProducts = (req, res) => {
  let limit = req.query.limit ? parseInt(req.query.limit) : 8;
  let sortBy = req.query.sortBy ? req.query.sortBy : "_id";

  Product.find()
    .select("-photo")
    .populate("category")
    .sort([[sortBy, "asc"]])
    .limit(limit)
    .exec((err, products) => {
      if (err) {
        return res.status(400).json({
          error: "No products available",
        });
      }

      res.json(products);
    });
};

exports.getUniqueCategories = (req, res) => {
  //
  Product.distinct("category", {}, (err, categoes) => {
    //
    if (err) {
      return res.status(400).json({
        error: "No categories found",
      });
    }

    res.json(categories);
  });
};

exports.updateInventory = (req, res, next) => {
  //

  let myOperation = req.body.order.products.map((prod) => {
    return {
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    };
  });

  Product.bulkWrite(myOperation, {}, (err, updatedProducts) => {
    if (err) {
      return res.status(400).json({
        err: "Bulk operation failed",
      });
    }

    next();
  });
};
