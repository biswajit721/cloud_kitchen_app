import React, { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, Eye, Flame } from "lucide-react";
import CreateFoodModal from "../../components/food/CreateFoodModal";
import api from "../../services/api";
import ViewFoodModal from "../../components/food/ViewFoodModal";

const AdminFood = () => {
    const [openModal,    setOpenModal]    = useState(false);
    const [selectedFood, setSelectedFood] = useState(null);
    const [foods,        setFoods]        = useState([]);
    const [loading,      setLoading]      = useState(true);
    const [viewFood,     setViewFood]     = useState(null);
    const [togglingId,   setTogglingId]   = useState(null);

    // ── Fetch all foods ──
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

    useEffect(() => { fetchFoods(); }, []);

    // ── Delete ──
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this food?")) return;
        try {
            await api.delete(`/food/${id}`);
            fetchFoods();
        } catch (error) {
            console.error("Delete failed", error);
        }
    };

    // ── Toggle Trending ──
    // Calls PATCH /food/:id/trending → controller flips isTrending and saves
    const handleToggleTrending = async (food) => {
        // 1. Optimistic UI update instantly
        setFoods(prev =>
            prev.map(f => f._id === food._id ? { ...f, isTrending: !f.isTrending } : f)
        );
        setTogglingId(food._id);

        try {
            // 2. Hit the backend
            const res = await api.patch(`/food/${food._id}/trending`);

            // 3. Sync with the real value returned from DB
            const updated = res.data.data;
            setFoods(prev =>
                prev.map(f => f._id === updated._id ? updated : f)
            );
        } catch (error) {
            console.error("Toggle trending failed", error);
            // 4. Revert on error
            setFoods(prev =>
                prev.map(f => f._id === food._id ? { ...f, isTrending: food.isTrending } : f)
            );
        } finally {
            setTogglingId(null);
        }
    };

    const trendingCount = foods.filter(f => f.isTrending).length;

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto bg-white shadow-xl rounded-2xl p-6">

                {/* ── Header ── */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Food Management</h1>
                        <p className="text-sm text-gray-400 mt-1">
                            {foods.length} total ·{" "}
                            <span className="text-orange-500 font-semibold">
                                🔥 {trendingCount} trending
                            </span>
                        </p>
                    </div>
                    <button
                        onClick={() => { setSelectedFood(null); setOpenModal(true); }}
                        className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-semibold transition"
                    >
                        <Plus size={18} />
                        Create Food
                    </button>
                </div>

                {/* ── Info banner ── */}
                <div className="flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-2.5 mb-6">
                    <Flame size={15} className="text-orange-500 shrink-0" />
                    <p className="text-sm text-orange-700">
                        Click <span className="font-bold">Mark as Trending</span> on any card to feature it in the Trending strip on the Home page.
                    </p>
                </div>

                {/* ── Loading skeletons ── */}
                {loading && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {Array.from({ length: 8 }).map((_, i) => (
                            <div key={i} className="bg-white rounded-2xl border overflow-hidden animate-pulse">
                                <div className="h-48 bg-gray-200" />
                                <div className="p-4 space-y-3">
                                    <div className="h-4 bg-gray-200 rounded w-3/4" />
                                    <div className="h-3 bg-gray-100 rounded w-1/2" />
                                    <div className="h-8 bg-gray-100 rounded-lg" />
                                    <div className="h-8 bg-gray-100 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* ── Food Grid ── */}
                {!loading && foods.length > 0 && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {foods.map((food) => (
                            <div
                                key={food._id}
                                className={`bg-white rounded-2xl border overflow-hidden transition-all duration-200 ${
                                    food.isTrending
                                        ? "border-orange-400 shadow-md shadow-orange-100"
                                        : "border-gray-200 shadow-sm"
                                }`}
                            >
                                {/* Thumbnail */}
                                <div className="h-48 overflow-hidden relative">
                                    <img
                                        src={food.thumbnail}
                                        alt={food.name}
                                        className="w-full h-full object-cover"
                                    />
                                    {/* Trending badge on image */}
                                    {food.isTrending && (
                                        <div className="absolute top-2 left-2 flex items-center gap-1 bg-orange-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow">
                                            <Flame size={9} /> Trending
                                        </div>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="p-4 space-y-2">
                                    <div className="flex justify-between items-start">
                                        <h3 className="font-semibold text-gray-800 truncate max-w-[65%]">
                                            {food.name}
                                        </h3>
                                        <span className="text-indigo-600 font-bold text-sm shrink-0">
                                            ₹{food.price}
                                        </span>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2">
                                        {food.description}
                                    </p>

                                    <span className="inline-block text-xs bg-indigo-100 text-indigo-600 px-3 py-1 rounded-full">
                                        {food.category}
                                    </span>

                                    {/* Trending Toggle Button */}
                                    <button
                                        onClick={() => handleToggleTrending(food)}
                                        disabled={togglingId === food._id}
                                        className={`w-full flex items-center justify-center gap-2 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 ${
                                            food.isTrending
                                                ? "bg-orange-500 hover:bg-orange-600 text-white border-orange-500"
                                                : "bg-white hover:bg-orange-50 text-gray-500 hover:text-orange-600 border-gray-200 hover:border-orange-300"
                                        } ${togglingId === food._id ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
                                    >
                                        <Flame
                                            size={14}
                                            className={food.isTrending ? "text-white" : "text-gray-400"}
                                        />
                                        {togglingId === food._id
                                            ? "Saving…"
                                            : food.isTrending
                                            ? "Remove from Trending"
                                            : "Mark as Trending"
                                        }
                                    </button>

                                    {/* Action Buttons */}
                                    <div className="flex justify-between pt-3 border-t">
                                        <button
                                            onClick={() => setViewFood(food)}
                                            className="text-blue-500 hover:text-blue-700 transition"
                                            title="View"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        <button
                                            onClick={() => { setSelectedFood(food); setOpenModal(true); }}
                                            className="text-green-500 hover:text-green-700 transition"
                                            title="Edit"
                                        >
                                            <Pencil size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(food._id)}
                                            className="text-red-500 hover:text-red-700 transition"
                                            title="Delete"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Empty state */}
                {!loading && foods.length === 0 && (
                    <div className="text-center py-24">
                        <div className="text-5xl mb-4">🍽️</div>
                        <h3 className="text-lg font-bold text-gray-700 mb-2">No food items yet</h3>
                        <p className="text-gray-400 text-sm mb-6">Click "Create Food" to add your first item.</p>
                        <button
                            onClick={() => { setSelectedFood(null); setOpenModal(true); }}
                            className="flex items-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold mx-auto"
                        >
                            <Plus size={18} /> Create Food
                        </button>
                    </div>
                )}
            </div>

            {/* Modals */}
            {openModal && (
                <CreateFoodModal
                    foodData={selectedFood}
                    closeModal={() => { setOpenModal(false); fetchFoods(); }}
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