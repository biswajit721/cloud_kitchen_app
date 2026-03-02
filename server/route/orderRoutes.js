const express = require("express");
const {
    createOrder,
    getMyOrders,
    getAllOrders,
    updateOrderStatus,
} = require("../controller/orderController");

const { protect, adminOnly } = require("../middleware/authMiddleware");

const router = express.Router();

// Create Order
router.post("/", protect, createOrder);

// Get My Orders
router.get("/my-orders", protect, getMyOrders);

// Get All Orders (Admin)
router.get("/", protect, adminOnly, getAllOrders);

// Update Order Status (Admin)
router.put("/:id", protect, adminOnly, updateOrderStatus);

module.exports = router;
