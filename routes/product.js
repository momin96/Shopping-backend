const express = require("express");
const router = express.Router();

const {
  getProductById,
  createProduct,
  getProduct,
  photo,
  deleteProduct,
  updateProduct,
  getProducts,
  getUniqueCategories,
} = require("../controllers/product.js");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Params
router.param("productId", getProductById);
router.param("userId", getUserById);

// Router
router.post(
  "/product/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createProduct
);

router.get("/product/:productId", getProduct);
router.get("/product/photo/:productId", photo);

//delete
router.delete(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  deleteProduct
);

//update
router.put(
  "/product/:productId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateProduct
);

//product listing
router.get("/products", getProducts);

router.get("/products/categories", getUniqueCategories);

module.exports = router;
