const express = require("express");
const router = express.Router();
const foodController = require("../controller/foodController");

// Create
router.post("/", foodController.createFood);

// Get All
router.get("/", foodController.getAllFoods);

// Get Single
router.get("/:id", foodController.getSingleFood);

// Update
router.put("/:id", foodController.updateFood);

// Delete
router.delete("/:id", foodController.deleteFood);

module.exports = router;