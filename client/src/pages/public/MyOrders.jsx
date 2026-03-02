import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import api from "../../services/api";

const MyOrders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.token) return;

    const fetchOrders = async () => {
      try {
        const res = await api.get("orders/my-orders");

        // console.log("Backend Data:", res.data.data);

        // 🔥 If backend returns single object → convert to array
        const orderData = Array.isArray(res.data.data)
          ? res.data.data
          : [res.data.data];

        setOrders(orderData);
      } catch (error) {
        console.error(
          "Error fetching orders:",
          error.response?.data || error.message
        );
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [user?.token]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">My Orders</h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders found</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="border rounded-lg p-5 shadow-md"
            >
              <div className="flex justify-between mb-3">
                <p className="font-semibold">
                  Order ID: {order._id}
                </p>
                <span className="bg-blue-500 text-white px-3 py-1 rounded text-sm capitalize">
                  {order.orderStatus}
                </span>
              </div>

              {/* Items */}
              {order.items?.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between border-b pb-2"
                >
                  <span>
                    {item.food.name} × {item.quantity}
                  </span>
                  <span>
                    ₹{item.food.price * item.quantity}
                  </span>
                </div>
              ))}

              {/* Shipping Info */}
              <div className="mt-3 text-sm text-gray-600">
                <p>
                  <strong>Shipping To:</strong>{" "}
                  {order.shippingAddress?.fullName},{" "}
                  {order.shippingAddress?.city}
                </p>
                <p>
                  <strong>Payment:</strong>{" "}
                  {order.paymentStatus}
                </p>
              </div>

              {/* Total */}
              <div className="text-right mt-3 font-semibold text-lg">
                Total: ₹{order.totalAmount}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;