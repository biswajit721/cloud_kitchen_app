const express = require("express");
const router  = express.Router();
const fc      = require("../controller/foodController");

// ── IMPORTANT: specific named routes MUST come before /:id routes ─────────────
// Otherwise Express matches "migrate-veg" as an :id parameter → 404/500

// ── Migration (run ONCE) ──────────────────────────────────────────────────────
// POST http://localhost:8000/api/food/migrate-veg
router.post("/migrate-veg", fc.migrateVegFields);

// ── CRUD ──────────────────────────────────────────────────────────────────────
router.post("/",      fc.createFood);
router.get("/",       fc.getAllFoods);
router.get("/:id",    fc.getSingleFood);
router.put("/:id",    fc.updateFood);
router.delete("/:id", fc.deleteFood);

// ── Toggle routes ──────────────────────────────────────────────────────────────
router.patch("/:id/trending", fc.toggleTrending);
router.patch("/:id/veg",      fc.toggleVeg);
router.patch("/:id/pureveg",  fc.togglePureVeg);

module.exports = router;