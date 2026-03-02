const Food = require("../model/Food");

// ✅ Create Food with Cloudinary Images
exports.createFood = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      category,
      thumbnail,
      images,
    } = req.body;

    const food = await Food.create({
      name,
      price,
      description,
      category,
      thumbnail, // URL string
      images,    // Array of URL strings
    });

    res.status(201).json({
      success: true,
      message: "Food created successfully",
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get All Foods
exports.getAllFoods = async (req, res) => {
  try {
    const foods = await Food.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: foods.length,
      data: foods,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Get Single Food
exports.getSingleFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Update Food (Replace Images if Provided)
exports.updateFood = async (req, res) => {
  try {
    const food = await Food.findById(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    const {
      name,
      price,
      description,
      category,
      thumbnail,
      images,
    } = req.body;

    food.name = name || food.name;
    food.price = price || food.price;
    food.description = description || food.description;
    food.category = category || food.category;
    food.thumbnail = thumbnail || food.thumbnail;
    food.images = images || food.images;

    await food.save();

    res.json({
      success: true,
      message: "Food updated successfully",
      data: food,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ✅ Delete Food
exports.deleteFood = async (req, res) => {
  try {
    const food = await Food.findByIdAndDelete(req.params.id);

    if (!food) {
      return res.status(404).json({
        success: false,
        message: "Food not found",
      });
    }

    res.json({
      success: true,
      message: "Food deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
