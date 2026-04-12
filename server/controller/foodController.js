const Food = require("../model/Food");

// ── Create Food ──────────────────────────────────────────────────────────────
exports.createFood = async (req, res) => {
  try {
    const {
      name, price, description, category,
      thumbnail, images, isVeg, isPureVeg,
    } = req.body;

    // Resolve booleans safely (form data may send strings "true"/"false")
    const vegVal     = isVeg     !== undefined ? (isVeg === "false"     ? false : Boolean(isVeg))     : true;
    const pureVegVal = isPureVeg !== undefined ? (isPureVeg === "false" ? false : Boolean(isPureVeg)) : false;

    // Pure veg implies veg — enforce in controller (no pre-save hook)
    const finalIsVeg = pureVegVal ? true : vegVal;

    const food = await Food.create({
      name:        name,
      price:       Number(price),
      description: description || "",
      category:    category    || "Veg",
      thumbnail:   thumbnail,
      images:      Array.isArray(images) ? images : [],
      isVeg:       finalIsVeg,
      isPureVeg:   pureVegVal,
      isTrending:  false,
    });

    res.status(201).json({ success: true, message: "Food created successfully", data: food });
  } catch (error) {
    console.error("createFood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get All Foods ────────────────────────────────────────────────────────────
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });
    res.json({ success: true, count: foods.length, data: foods });
  } catch (error) {
    console.error("getAllFoods error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Get Single Food ──────────────────────────────────────────────────────────
exports.getSingleFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, data: food });
  } catch (error) {
    console.error("getSingleFood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Update Food ──────────────────────────────────────────────────────────────
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });

    const {
      name, price, description, category,
      thumbnail, images, isVeg, isPureVeg,
    } = req.body;

    if (name        !== undefined) food.name        = name;
    if (price       !== undefined) food.price       = Number(price);
    if (description !== undefined) food.description = description;
    if (category    !== undefined) food.category    = category;
    if (thumbnail   !== undefined) food.thumbnail   = thumbnail;
    if (images      !== undefined) food.images      = Array.isArray(images) ? images : food.images;

    // Handle boolean fields safely (string "false" from form)
    if (isVeg !== undefined) {
      food.isVeg = (isVeg === "false" ? false : Boolean(isVeg));
    }
    if (isPureVeg !== undefined) {
      food.isPureVeg = (isPureVeg === "false" ? false : Boolean(isPureVeg));
    }

    // Enforce: pure veg implies veg
    if (food.isPureVeg) food.isVeg = true;
    // Enforce: non-veg cannot be pure veg
    if (!food.isVeg) food.isPureVeg = false;

    await food.save();
    res.json({ success: true, message: "Food updated successfully", data: food });
  } catch (error) {
    console.error("updateFood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Delete Food ──────────────────────────────────────────────────────────────
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    res.json({ success: true, message: "Food deleted successfully" });
  } catch (error) {
    console.error("deleteFood error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Toggle Trending ──────────────────────────────────────────────────────────
exports.toggleTrending = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    food.isTrending = !food.isTrending;
    await food.save();
    res.json({
      success: true,
      message: `${food.name} ${food.isTrending ? "is now trending 🔥" : "removed from trending"}`,
      data: food,
    });
  } catch (error) {
    console.error("toggleTrending error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Toggle Veg ───────────────────────────────────────────────────────────────
exports.toggleVeg = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    food.isVeg = !food.isVeg;
    if (!food.isVeg) food.isPureVeg = false; // non-veg cannot be pure veg
    await food.save();
    res.json({
      success: true,
      message: `${food.name} marked as ${food.isVeg ? "Vegetarian 🥦" : "Non-Vegetarian 🍗"}`,
      data: food,
    });
  } catch (error) {
    console.error("toggleVeg error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── Toggle Pure Veg ──────────────────────────────────────────────────────────
exports.togglePureVeg = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);
    if (!food) return res.status(404).json({ success: false, message: "Food not found" });
    food.isPureVeg = !food.isPureVeg;
    if (food.isPureVeg) food.isVeg = true; // pure veg implies veg
    await food.save();
    res.json({
      success: true,
      message: `${food.name} ${food.isPureVeg ? "is now Pure Veg 🌱" : "is no longer Pure Veg"}`,
      data: food,
    });
  } catch (error) {
    console.error("togglePureVeg error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};

// ── MIGRATE: Fix existing items that have isVeg = undefined ─────────────────
// POST /api/food/migrate-veg
// Call this ONCE from your browser or Postman after deploying the new model.
// It sets isVeg=true and isPureVeg=false on all items that are missing those fields.
exports.migrateVegFields = async (req, res) => {
  try {
    const result = await Food.updateMany(
      { isVeg: { $exists: false } },      // only items missing the field
      { $set: { isVeg: true, isPureVeg: false } }
    );
    const result2 = await Food.updateMany(
      { isPureVeg: { $exists: false } },
      { $set: { isPureVeg: false } }
    );
    res.json({
      success: true,
      message: `Migration complete. isVeg fixed: ${result.modifiedCount}, isPureVeg fixed: ${result2.modifiedCount}`,
    });
  } catch (error) {
    console.error("migrateVegFields error:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};