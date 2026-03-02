const mongoose =require("mongoose");

const orderItemSchema = new mongoose.Schema(
    {
        food: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Food",
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            default: 1,
        },
    },
    { _id: false }
);

const orderSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },

        items: [orderItemSchema],

        totalAmount: {
            type: Number,
            required: true,
        },

        // ✅ Add Shipping Address
        shippingAddress: {
            fullName: { type: String, required: true },
            phone: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            postalCode: { type: String, required: true },
        },

        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },

        orderStatus: {
            type: String,
            enum: ["placed", "preparing", "delivered", "cancelled"],
            default: "placed",
        },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports=Order;
