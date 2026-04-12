const express    = require("express");
const router     = express.Router();
const orderCtrl  = require("../controller/orderController");
const { protect, adminOnly } = require("../middleware/authMiddleware");

/*
  ⚠️  CRITICAL ROUTE ORDER:
  /my-orders MUST come BEFORE /:id
  Otherwise Express matches "my-orders" as an :id param and crashes.
*/

/* Customer: place an order */
router.post("/",             protect,            orderCtrl.createOrder);

/* Customer: view their own orders */
router.get("/my-orders",     protect,            orderCtrl.getMyOrders);

/* Admin: view ALL orders */
router.get("/",              protect, adminOnly, orderCtrl.getAllOrders);

/* Admin / Owner: view single order */
router.get("/:id",           protect,            orderCtrl.getOrder);

/*
  Admin: update order status or payment status
  Accepts body: { orderStatus: "confirmed" }  OR  { paymentStatus: "paid" }  OR both.

  FIX: Previously used findByIdAndUpdate + runValidators:true which caused
  Mongoose to validate ALL enum fields even when only ONE was sent.
  Now uses findById → mutate → save() which is safe.
*/
router.put("/:id",           protect, adminOnly, orderCtrl.updateOrderStatus);

/* Admin: delete order */
router.delete("/:id",        protect, adminOnly, orderCtrl.deleteOrder);

module.exports = router;