import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const statusColor = {
    placed: "bg-gray-500",
    processing: "bg-yellow-500",
    shipped: "bg-blue-500",
    delivered: "bg-green-600",
    cancelled: "bg-red-500",
};

const paymentColor = {
    pending: "bg-orange-500",
    paid: "bg-green-600",
    failed: "bg-red-600",
};

const AdminOrders = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await api.get("orders");
            setOrders(res.data.data);
        } catch (error) {
            console.error(error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!user?.token) return;
        fetchOrders();
    }, [user?.token]);

    const handleStatusChange = async (orderId, field, value) => {
        try {
            const res = await api.put(`orders/${orderId}`, {
                [field]: value,
            });

            const updatedOrder = res.data.data;

            setOrders((prev) =>
                prev.map((order) =>
                    order._id === orderId ? updatedOrder : order
                )
            );
        } catch (error) {
            console.error(error.response?.data || error.message);
        }
    };

    if (loading)
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-xl font-semibold animate-pulse">
                    Loading Orders...
                </p>
            </div>
        );

    return (
        <div className="min-h-screen bg-gray-100 p-8">
            <h1 className="text-4xl font-bold mb-10 text-gray-800">
                Admin Dashboard - Orders
            </h1>

            {orders.length === 0 ? (
                <p className="text-gray-500">No Orders Found</p>
            ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {orders.map((order) => (
                        <div
                            key={order._id}
                            className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition duration-300"
                        >
                            {/* Top Section */}
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">
                                        #{order._id.slice(-6)}
                                    </p>
                                    <p className="font-semibold text-gray-800">
                                        {order.user?.name}
                                    </p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(order.createdAt).toLocaleDateString()}
                                    </p>
                                </div>

                                <div className="space-y-2 text-right">
                                    <span
                                        className={`px-3 py-1 text-xs text-white rounded-full capitalize ${statusColor[order.orderStatus]}`}
                                    >
                                        {order.orderStatus}
                                    </span>
                                    <br />
                                    <span
                                        className={`px-3 py-1 text-xs text-white rounded-full capitalize ${paymentColor[order.paymentStatus]}`}
                                    >
                                        {order.paymentStatus}
                                    </span>
                                </div>
                            </div>

                            {/* Items */}
                            <div className="border-t pt-3 space-y-2 max-h-32 overflow-y-auto">
                                {order.items?.map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex justify-between text-sm text-gray-700"
                                    >
                                        <span>
                                            {item.food?.name} × {item.quantity}
                                        </span>
                                        <span>
                                            ₹{item.food?.price * item.quantity}
                                        </span>
                                    </div>
                                ))}
                            </div>

                            {/* Shipping */}
                            <div className="mt-4 text-sm text-gray-600">
                                <p>
                                    <strong>City:</strong>{" "}
                                    {order.shippingAddress?.city}
                                </p>
                                <p>
                                    <strong>Total:</strong>{" "}
                                    <span className="text-lg font-bold text-green-600">
                                        ₹{order.totalAmount}
                                    </span>
                                </p>
                            </div>

                            {/* Controls */}
                            <div className="mt-4 space-y-2">
                                <select
                                    value={order.orderStatus}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order._id,
                                            "orderStatus",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-400"
                                >
                                    <option value="placed">Placed</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>

                                <select
                                    value={order.paymentStatus}
                                    onChange={(e) =>
                                        handleStatusChange(
                                            order._id,
                                            "paymentStatus",
                                            e.target.value
                                        )
                                    }
                                    className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-green-400"
                                >
                                    <option value="pending">Pending</option>
                                    <option value="paid">Paid</option>
                                    <option value="failed">Failed</option>
                                </select>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminOrders;