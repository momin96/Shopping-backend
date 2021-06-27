// This product file is for different application named DeliciousApp which are non Firebase, it has nothing to to with this project, Kept here just of testing basic functionality.
const express = require("express");
const router = express.Router();

const { getAllProducts, getProductById, getProductByLocationId } = require("../../controllers/deliciousapp/product.js")
router.get("/product/getAllProducts", getAllProducts)
router.get("/product/getProduct/:id", getProductById)
router.get("/product/getProduct/:productId/:locationId", getProductByLocationId)


module.exports = router;