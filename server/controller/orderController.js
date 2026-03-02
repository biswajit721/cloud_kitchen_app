const  Order =require("../model/Order");

exports.createOrder = async (req, res) => {
    try {
        const { items, totalAmount, shippingAddress } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: "No order items" });
        }

        if (!shippingAddress) {
            return res.status(400).json({ message: "Shipping address required" });
        }

        const order = await Order.create({
            user: req.user._id,
            items,
            totalAmount,
            shippingAddress, // ✅ important
        });

        res.status(201).json({
            success: true,
            data: order,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .populate("items.food")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate("user", "name email")
            .populate("items.food")
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            data: orders,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderStatus, paymentStatus } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: "Order not found" });
        }

        if (orderStatus) order.orderStatus = orderStatus;
        if (paymentStatus) order.paymentStatus = paymentStatus;

        const updatedOrder = await order.save();

        res.status(200).json({
            success: true,
            data: updatedOrder,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
