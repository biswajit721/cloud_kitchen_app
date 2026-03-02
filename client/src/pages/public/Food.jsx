import React, { useEffect, useState } from "react";
import { X, ShoppingCart } from "lucide-react";
import api from "../../services/api";
import { useCart } from "../../context/CartContext";

const Food = () => {
    const { addToCart, cartItems } = useCart();

    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFood, setSelectedFood] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);

    const fetchFoods = async () => {
        try {
            const res = await api.get("/food");
            setFoods(res.data.data);
        } catch (error) {
            console.error("Failed to fetch foods", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchFoods();
    }, []);

    const openModal = (food) => {
        setSelectedFood(food);
        setSelectedImage(food.thumbnail);
    };

    const closeModal = () => {
        setSelectedFood(null);
        setSelectedImage(null);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-6">
            <div className="max-w-7xl mx-auto">

                {/* Header */}
                <div className="flex justify-between items-center mb-12">
                    <div>
                        <h1 className="text-4xl font-bold text-gray-800">
                            Explore Our Delicious Foods
                        </h1>
                        <p className="text-gray-500 mt-3">
                            Freshly prepared with love ❤️
                        </p>
                    </div>
                </div>

                {/* Loading */}
                {loading && (
                    <div className="text-center text-gray-400 py-20">
                        Loading delicious foods...
                    </div>
                )}

                {/* Grid */}
                {!loading && foods.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                        {foods.map((food) => (
                            <div
                                key={food._id}
                                className="bg-white rounded-3xl shadow-md hover:shadow-xl transition overflow-hidden"
                            >
                                <div
                                    className="h-56 overflow-hidden cursor-pointer"
                                    onClick={() => openModal(food)}
                                >
                                    <img
                                        src={food.thumbnail}
                                        alt={food.name}
                                        className="w-full h-full object-cover hover:scale-105 transition duration-500"
                                    />
                                </div>

                                <div className="p-5 space-y-3">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-800 truncate">
                                            {food.name}
                                        </h3>
                                        <span className="text-indigo-600 font-bold text-lg">
                                            ₹{food.price}
                                        </span>
                                    </div>

                                    <span className="inline-block text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                        {food.category}
                                    </span>

                                    <button
                                        onClick={() => addToCart(food)}
                                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-xl font-medium transition"
                                    >
                                        Add To Cart
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* IMAGE MODAL */}
            {selectedFood && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 px-4">
                    <div className="bg-white w-full max-w-3xl rounded-3xl p-6 relative">

                        <button
                            onClick={closeModal}
                            className="absolute top-4 right-4 text-gray-500 hover:text-red-500"
                        >
                            <X size={22} />
                        </button>

                        <div className="h-96 overflow-hidden rounded-2xl mb-6">
                            <img
                                src={selectedImage}
                                alt="Preview"
                                className="w-full h-full object-cover"
                            />
                        </div>

                        <div className="flex gap-3 flex-wrap justify-center mb-6">
                            {[selectedFood.thumbnail, ...selectedFood.images].map(
                                (img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="preview"
                                        onClick={() => setSelectedImage(img)}
                                        className={`w-16 h-16 object-cover rounded-lg cursor-pointer border-2 ${selectedImage === img
                                                ? "border-indigo-600"
                                                : "border-gray-200"
                                            }`}
                                    />
                                )
                            )}
                        </div>

                        <button
                            onClick={() => {
                                addToCart(selectedFood);
                                closeModal();
                            }}
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
                        >
                            Add To Cart
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Food;
