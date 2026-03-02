import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, X, Trash2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { cartItems, removeFromCart, updateQuantity, clearCart } = useCart();

  const [isCartOpen, setIsCartOpen] = useState(false);

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cartItems.reduce(
    (acc, item) => acc + item.quantity * item.price,
    0
  );

  const navigate = useNavigate();

  return (
    <>
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">

            {/* Logo */}
            <div className="flex items-center">
              <Link to="/" className="text-xl font-bold text-blue-600">
                MyApp
              </Link>
            </div>

            {/* Links */}
            <div className="flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600">
                Home
              </Link>
              <Link to="/about" className="text-gray-700 hover:text-blue-600">
                About
              </Link>
              <Link to="/contact" className="text-gray-700 hover:text-blue-600">
                Contact
              </Link>
              <Link to="/foods" className="text-gray-700 hover:text-blue-600">
                Foods
              </Link>

              {/* Cart Icon */}
              <button
                onClick={() => setIsCartOpen(true)}
                className="relative"
              >
                <ShoppingCart className="w-6 h-6 text-gray-700 hover:text-blue-600" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                    {totalItems}
                  </span>
                )}
              </button>

              {user ? (
                <>
                  <span className="text-gray-500 font-medium">
                    Hi, {user.name}
                  </span>

                  {/* Show My Orders only for normal users */}
                  {user.role !== "admin" && (
                    <Link
                      to="/my-orders"
                      className="text-gray-700 hover:text-blue-600 font-medium"
                    >
                      My Orders
                    </Link>
                  )}

                  {/* Show Admin Panel only for admin */}
                  {user.role === "admin" && (
                    <Link
                      to="/admin"
                      className="text-blue-600 font-semibold"
                    >
                      Admin Panel
                    </Link>
                  )}

                  <button
                    onClick={logout}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-gray-700 hover:text-blue-600"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Overlay */}
      {isCartOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setIsCartOpen(false)}
        />
      )}

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-96 bg-white shadow-2xl z-50 transform transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)}>
            <X />
          </button>
        </div>

        {/* Cart Items */}
        <div className="p-5 space-y-4 overflow-y-auto h-[70%]">
          {cartItems.length === 0 && (
            <p className="text-gray-500 text-center">
              Your cart is empty
            </p>
          )}

          {cartItems.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 border-b pb-4"
            >
              <img
                src={item.thumbnail}
                alt={item.name}
                className="w-16 h-16 rounded-lg object-cover"
              />

              <div className="flex-1">
                <h4 className="font-medium">{item.name}</h4>
                <p className="text-sm text-gray-500">
                  ₹{item.price}
                </p>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity - 1)
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    -
                  </button>

                  <span>{item.quantity}</span>

                  <button
                    onClick={() =>
                      updateQuantity(item._id, item.quantity + 1)
                    }
                    className="px-2 bg-gray-200 rounded"
                  >
                    +
                  </button>
                </div>
              </div>

              <button
                onClick={() => removeFromCart(item._id)}
                className="text-red-500"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 w-full p-5 border-t bg-white">
          <div className="flex justify-between font-semibold mb-4">
            <span>Total:</span>
            <span>₹{totalPrice}</span>
          </div>

          <button
            onClick={() => {
              setIsCartOpen(false);
              navigate("/checkout");
            }}
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Navbar;
