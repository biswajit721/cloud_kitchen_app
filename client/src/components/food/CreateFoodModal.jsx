import React, { useState } from "react";
import { X, ImagePlus } from "lucide-react";
import api from "../../services/api";

const CreateFoodModal = ({ closeModal, foodData }) => {
    const [formData, setFormData] = useState({
        name: foodData?.name || "",
        price: foodData?.price || "",
        description: foodData?.description || "",
        category: foodData?.category || "Veg",
        thumbnail: foodData?.thumbnail || "",
    });

    const [images, setImages] = useState(foodData?.images || []);

    const [thumbnailPreview, setThumbnailPreview] = useState(null);

    const [imageUrl, setImageUrl] = useState("");

    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleAddImage = (e) => {
        if (e.key === "Enter" && imageUrl.trim() !== "") {
            e.preventDefault();

            setImages((prev) => [...prev, imageUrl.trim()]);
            setImageUrl(""); // clear input
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                images,
            };

            if (foodData) {
                // UPDATE
                await api.put(`/food/${foodData._id}`, payload);
            } else {
                // CREATE
                await api.post("/food", payload);
            }

            closeModal();
        } catch (error) {
            console.error("Save failed", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">
            <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl p-8 relative">

                {/* Close Button */}
                <button
                    onClick={closeModal}
                    className="absolute top-5 right-5 text-gray-400 hover:text-red-500 transition"
                >
                    <X size={22} />
                </button>

                <h2 className="text-2xl font-bold text-gray-800 mb-8">
                    Create New Food
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">

                    {/* Name & Price */}
                    <div className="grid grid-cols-2 gap-4">
                        <input
                            type="text"
                            name="name"
                            placeholder="Food Name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="col-span-2 border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <input
                            type="number"
                            name="price"
                            placeholder="Price"
                            value={formData.price}
                            onChange={handleChange}
                            required
                            min="0"
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        <select
                            name="category"
                            value={formData.category}
                            onChange={handleChange}
                            className="border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        >
                            <option value="Veg">Veg</option>
                            <option value="Non-Veg">Non-Veg</option>
                            <option value="Dessert">Dessert</option>
                            <option value="Drinks">Drinks</option>
                        </select>
                    </div>

                    {/* Description */}
                    <textarea
                        name="description"
                        rows="3"
                        placeholder="Description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                    />

                    {/* Thumbnail Upload */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">
                            Thumbnail Image *
                        </label>

                        <label className="flex items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer hover:bg-gray-50 transition">
                            {thumbnailPreview ? (
                                <img
                                    src={thumbnailPreview}
                                    alt="Thumbnail Preview"
                                    className="h-full object-cover rounded-xl"
                                />
                            ) : (
                                <div className="text-gray-400 flex flex-col items-center">
                                    <ImagePlus size={30} />
                                    <span className="text-sm mt-2">
                                        Click to upload thumbnail
                                    </span>
                                </div>
                            )}
                            <input
                                type="text"
                                name="thumbnail"
                                placeholder="https://example.com/image.jpg"
                                value={formData.thumbnail || ""}
                                onChange={handleChange}
                                required
                                className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                            />
                        </label>
                    </div>

                    {/* Additional Images */}
                    <div>
                        <label className="block text-sm font-medium mb-2 text-gray-600">
                            Additional Images
                        </label>

                        <input
                            type="text"
                            placeholder="Paste image URL and press Enter"
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            onKeyDown={handleAddImage}
                            className="w-full border p-3 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none"
                        />

                        {images.length > 0 && (
                            <div className="flex gap-3 flex-wrap mt-4">
                                {images.map((img, index) => (
                                    <div key={index} className="relative">
                                        <img
                                            src={img}
                                            alt="preview"
                                            className="w-16 h-16 object-cover rounded-lg border shadow-sm"
                                        />

                                        <button
                                            type="button"
                                            onClick={() =>
                                                setImages(images.filter((_, i) => i !== index))
                                            }
                                            className="absolute -top-2 -right-2 bg-red-500 text-white w-5 h-5 text-xs rounded-full"
                                        >
                                            ×
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition shadow-md"
                    >
                        {loading ? "Creating..." : "Create Food"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default CreateFoodModal;
