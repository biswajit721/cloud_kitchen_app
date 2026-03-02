import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye } from "lucide-react";
import CreateFoodModal from "../../components/food/CreateFoodModal";
import api from "../../services/api";
import ViewFoodModal from "../../components/food/ViewFoodModal";

const AdminFood = () => {
    const [openModal, setOpenModal] = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [foods, setFoods] = useState([]);
    const [loading, setLoading] = useState(true);
    const [viewFood, setViewFood] = useState(null);
    const fetchFoods = async () => {
        try {
            setLoading(true);
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

    // DELETE
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this food?")) return;

        try {
            await api.delete(`/food/${id}`);
            fetchFoods();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold">Food Management</h1>

                    <button
                        onClick={() => {
                            setSelectedFood(null);
                            setOpenModal(true);
                        }}
                        className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2 rounded-xl"
                    >
                        <Plus size={18} />
                        Create Food
                    </button>
                </div>

                {/* Grid */}
                {!loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {foods.map((food) => (
                            <div
                                key={food._id}
                                className="bg-white rounded-2xl shadow-md border overflow-hidden"
                            >
                                <div className="h-48 overflow-hidden">
                                    <img
                                        src={food.thumbnail}
                                        alt={food.name}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                <div className="p-4 space-y-3">
                                    <div className="flex justify-between">
                                        <h3 className="font-semibold truncate">
                                            {food.name}
                                        </h3>
                                        <span className="text-indigo-600 font-bold">
                                            ₹{food.price}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {food.description}
                                    </p>

                                    <span className="text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                        {food.category}
                                    </span>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-3 border-t mt-3">
                                        <button
                                            onClick={() => setViewFood(food)}
                                            className="text-blue-500"
                                        >
                                            <Eye size={18} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                setSelectedFood(food);
                                                setOpenModal(true);
                                            }}
                                            className="text-green-500"
                                        >
                                            <Pencil size={18} />
                                        </button>

                                        <button
                                            onClick={() => handleDelete(food._id)}
                                            className="text-red-500"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modal */}
            {openModal && (
                <CreateFoodModal
                    foodData={selectedFood}
                    closeModal={() => {
                        setOpenModal(false);
                        fetchFoods();
                    }}
                />
            )}

            {viewFood && (
                <ViewFoodModal
                    food={viewFood}
                    closeModal={() => setViewFood(null)}
                />
            )}
        </div>
    );
};

export default AdminFood;