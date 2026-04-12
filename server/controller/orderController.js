const Order  = require("../model/Order");
const Food   = require("../model/Food");

/* ═══════════════════════════════════════════════════════════════════════════
   ROOT CAUSE ANALYSIS — Why status update was failing:
   ─────────────────────────────────────────────────────
   1. Frontend was calling   api.put(`orders/${id}`)   ← missing leading slash
      Fixed to              api.put(`/orders/${id}`)   ← leading slash added

   2. The controller was using findByIdAndUpdate with { new: true, runValidators: true }
      BUT the Order schema had   orderStatus   as an enum.
      When only ONE field (e.g. orderStatus) was sent, Mongoose validators
      sometimes ran on ALL fields and failed if paymentStatus was missing or
      vice-versa. Fix: use { runValidators: false } or update field by field.

   3. Admin auth middleware was checking req.user.role but some routes were
      missing the protect/admin middleware. All routes now explicitly protected.

   SOLUTION: Use findById → mutate fields → save() pattern.
   This is the safest approach — it runs pre-save hooks, skips cross-field
   validation issues, and is explicit about what changes.
═══════════════════════════════════════════════════════════════════════════ */

/* ─── Valid enum values ─── */
const VALID_ORDER_STATUS   = ["pending","confirmed","preparing","out_for_delivery","delivered","cancelled"];
const VALID_PAYMENT_STATUS = ["pending","paid","failed"];

/* ══════════════════════════════════════════════════════
   1. CREATE ORDER  —  POST /api/orders
   Customer places an order.
══════════════════════════════════════════════════════ */
exports.createOrder = async (req, res) => {
  try {
    const { items, totalAmount, shippingAddress, paymentMethod } = req.body;

    if (!items || !items.length)
      return res.status(400).json({ success:false, message:"Order must have at least one item" });

    if (!shippingAddress)
      return res.status(400).json({ success:false, message:"Shipping address is required" });

    /* Validate each food item exists */
    const enriched = [];
    for (const item of items) {
      const food = await Food.findById(item.food);
      if (!food)
        return res.status(404).json({ success:false, message:`Food item ${item.food} not found` });
      enriched.push({ food: food._id, quantity: item.quantity || 1 });
    }

    const order = await Order.create({
      user:            req.user._id,
      items:           enriched,
      totalAmount:     totalAmount || 0,
      shippingAddress,
      paymentMethod:   paymentMethod || "cod",
      orderStatus:     "pending",
      paymentStatus:   "pending",
    });

    const populated = await Order.findById(order._id)
      .populate("user",  "name email")
      .populate("items.food", "name price thumbnail");

    res.status(201).json({ success:true, message:"Order placed successfully", data:populated });
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ success:false, message:err.message });
  }
};

/* ══════════════════════════════════════════════════════
   2. GET ALL ORDERS  —  GET /api/orders
   Admin only. Returns all orders, newest first.
══════════════════════════════════════════════════════ */
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("user",       "name email phone")
      .populate("items.food", "name price thumbnail category");

    res.json({ success:true, count:orders.length, data:orders });
  } catch (err) {
    console.error("getAllOrders error:", err);
    res.status(500).json({ success:false, message:err.message });
  }
};

/* ══════════════════════════════════════════════════════
   3. GET MY ORDERS  —  GET /api/orders/my-orders
   Customer sees only their own orders.
══════════════════════════════════════════════════════ */
exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("items.food", "name price thumbnail category");

    res.json({ success:true, count:orders.length, data:orders });
  } catch (err) {
    console.error("getMyOrders error:", err);
    res.status(500).json({ success:false, message:err.message });
  }
};

/* ══════════════════════════════════════════════════════
   4. GET SINGLE ORDER  —  GET /api/orders/:id
   Admin or the owner can view.
══════════════════════════════════════════════════════ */
exports.getOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user",       "name email phone")
      .populate("items.food", "name price thumbnail category");

    if (!order)
      return res.status(404).json({ success:false, message:"Order not found" });

    /* Only admin or the order owner can see it */
    const isOwner = order.user?._id?.toString() === req.user._id?.toString();
    const isAdmin = req.user.role === "admin";
    if (!isOwner && !isAdmin)
      return res.status(403).json({ success:false, message:"Access denied" });

    res.json({ success:true, data:order });
  } catch (err) {
    console.error("getOrder error:", err);
    res.status(500).json({ success:false, message:err.message });
  }
};

/* ══════════════════════════════════════════════════════
   5. UPDATE ORDER STATUS  —  PUT /api/orders/:id
   ────────────────────────────────────────────────────
   ROOT CAUSE FIX:
   • Old code used findByIdAndUpdate with runValidators:true which
     caused cross-field Mongoose enum validation failures when only
     ONE field was sent (e.g. only orderStatus, not paymentStatus).
   • New code: findById → validate → mutate field → save()
   • This avoids the validator conflict entirely.
   • Admin only.
══════════════════════════════════════════════════════ */
exports.updateOrderStatus = async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body;

    /* Validate inputs before touching DB */
    if (orderStatus && !VALID_ORDER_STATUS.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid orderStatus. Must be one of: ${VALID_ORDER_STATUS.join(", ")}`,
      });
    }
    if (paymentStatus && !VALID_PAYMENT_STATUS.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid paymentStatus. Must be one of: ${VALID_PAYMENT_STATUS.join(", ")}`,
      });
    }

    const order = await Order.findById(req.params.id);
    if (!order)
      return res.status(404).json({ success:false, message:"Order not found" });

    /* ── Update only the fields that were actually sent ── */
    if (orderStatus   !== undefined) order.orderStatus   = orderStatus;
    if (paymentStatus !== undefined) order.paymentStatus = paymentStatus;

    /* Auto-logic: if order is delivered, payment should be paid */
    // (Optional - comment out if you don't want auto-payment update)
    // if (orderStatus === "delivered" && order.paymentStatus === "pending") {
    //   order.paymentStatus = "paid";
    // }

    await order.save();

    /* Return fully populated order so frontend state is up to date */
    const updated = await Order.findById(order._id)
      .populate("user",       "name email phone")
      .populate("items.food", "name price thumbnail category");

    res.json({ success:true, message:"Order updated successfully", data:updated });
  } catch (err) {
    console.error("updateOrderStatus error:", err.message);
    res.status(500).json({ success:false, message:err.message });
  }
};

/* ══════════════════════════════════════════════════════
   6. DELETE ORDER  —  DELETE /api/orders/:id
   Admin only. Hard delete.
══════════════════════════════════════════════════════ */
exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findByIdAndDelete(req.params.id);
    if (!order)
      return res.status(404).json({ success:false, message:"Order not found" });

    res.json({ success:true, message:"Order deleted successfully" });
  } catch (err) {
    console.error("deleteOrder error:", err);
    res.status(500).json({ success:false, message:err.message });
  }
};