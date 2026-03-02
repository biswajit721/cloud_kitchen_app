import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

const Checkout = () => {
    const { cartItems, clearCart } = useCart();
    const navigate = useNavigate();

    const [address, setAddress] = useState({
        fullName: "",
        phone: "",
        address: "",
        city: "",
        postalCode: "",
    });

    const totalPrice = cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
    );

    const handleChange = (e) => {
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        try {
            const orderData = {
                items: cartItems.map((item) => ({
                    food: item._id,
                    quantity: item.quantity,
                })),
                totalAmount: totalPrice,
                shippingAddress: address,
            };

            await api.post("/orders", orderData);

            alert("✅ Payment Successful!");

            clearCart();
            navigate("/");  
        } catch (error) {
            console.error(error);
            alert("❌ Order Failed");
        }
    };

    if (cartItems.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-500">
                Your cart is empty.
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-10 px-6">
            <div className="max-w-4xl mx-auto bg-white shadow-lg rounded-2xl p-8">

                <h2 className="text-3xl font-bold mb-6">Checkout</h2>

                {/* Address Form */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <input
                        type="text"
                        name="fullName"
                        placeholder="Full Name"
                        value={address.fullName}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />
                    <input
                        type="text"
                        name="phone"
                        placeholder="Phone"
                        value={address.phone}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />
                    <input
                        type="text"
                        name="city"
                        placeholder="City"
                        value={address.city}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Postal Code"
                        value={address.postalCode}
                        onChange={handleChange}
                        className="border p-3 rounded-lg"
                    />
                    <textarea
                        name="address"
                        placeholder="Full Address"
                        value={address.address}
                        onChange={handleChange}
                        className="border p-3 rounded-lg md:col-span-2"
                    />
                </div>

                {/* Cart Items */}
                <div className="space-y-6">
                    {cartItems.map((item) => (
                        <div
                            key={item._id}
                            className="flex items-center gap-6 border-b pb-4"
                        >
                            <img
                                src={item.thumbnail}
                                alt={item.name}
                                className="w-24 h-24 rounded-xl object-cover"
                            />

                            <div className="flex-1">
                                <h3 className="text-lg font-semibold">{item.name}</h3>
                                <p className="text-gray-500">
                                    ₹{item.price} × {item.quantity}
                                </p>
                            </div>

                            <div className="font-semibold">
                                ₹{item.price * item.quantity}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Total */}
                <div className="flex justify-between text-xl font-bold mt-8 border-t pt-6">
                    <span>Total Amount:</span>
                    <span>₹{totalPrice}</span>
                </div>

                {/* Pay Button */}
                <button
                    onClick={handlePayment}
                    className="w-full mt-8 bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 transition text-lg font-semibold"
                >
                    Pay Now
                </button>
            </div>
        </div>
    );
};

export default Checkout;
