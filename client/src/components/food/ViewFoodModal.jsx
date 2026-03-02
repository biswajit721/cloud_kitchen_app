import React from "react";
import { X } from "lucide-react";

const ViewFoodModal = ({ food, closeModal }) => {
    if (!food) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
            <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden relative">

                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-4 right-4 text-gray-600 hover:text-red-500"
                >
                    <X size={22} />
                </button>

                {/* Thumbnail */}
                <div className="h-64 w-full overflow-hidden">
                    <img
                        src={food.thumbnail}
                        alt={food.name}
                        className="w-full h-full object-cover"
                    />
                </div>

                <div className="p-6 space-y-4">

                    {/* Name & Price */}
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold">{food.name}</h2>
                        <span className="text-2xl font-bold text-indigo-600">
                            ₹{food.price}
                        </span>
                    </div>

                    {/* Category */}
                    <span className="inline-block bg-indigo-100 text-indigo-600 px-4 py-1 rounded-full text-sm">
                        {food.category}
                    </span>

                    {/* Description */}
                    <p className="text-gray-600 leading-relaxed">
                        {food.description}
                    </p>

                    {/* Additional Images */}
                    {food.images && food.images.length > 0 && (
                        <div>
                            <h3 className="font-semibold mb-2">Gallery</h3>
                            <div className="flex gap-3 flex-wrap">
                                {food.images.map((img, index) => (
                                    <img
                                        key={index}
                                        src={img}
                                        alt="food"
                                        className="w-24 h-24 object-cover rounded-xl border"
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default ViewFoodModal;