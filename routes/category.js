const express = require("express");
const router = express.Router();

const {
  getCategoryById,
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  removeCategory,
} = require("../controllers/category");
const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { getUserById } = require("../controllers/user");

// Middleware param
router.param("userId", getUserById);
router.param("categoryId", getCategoryById);

// Routes
// Create
router.post(
  "/category/create/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  createCategory
);

// Update
router.put(
  "/category/update/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateCategory
);

// Read
router.get("/category/get/:categoryId", getCategory);
router.get("/category/getAll", getCategories);

// Delete

router.delete(
  "/category/remove/:categoryId/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  removeCategory
);

module.exports = router;
