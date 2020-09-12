const express = require("express");
const router = express.Router();

const { isSignedIn, isAuthenticated, isAdmin } = require("../controllers/auth");
const { updateInventory } = require("../controllers/product");
const {
  getUserById,
  pushOrdersInPurchaseList,
} = require("../controllers/user");

const {
  getOrderById,
  createOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderStatus,
} = require("../controllers/order");

//Params
router.param("/userId", getUserById);
router.param("/orderId", getOrderById);

// Routes

// create
router.post(
  "/order/create/:userId",
  isSignedIn,
  isAuthenticated,
  pushOrdersInPurchaseList,
  updateInventory,
  createOrder
);

// read
router.get(
  "/order/all/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getAllOrders
);

router.get(
  "/order/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  getOrderStatus
);
router.put(
  "/order/:orderId/status/:userId",
  isSignedIn,
  isAuthenticated,
  isAdmin,
  updateOrderStatus
);

module.exports = router;
