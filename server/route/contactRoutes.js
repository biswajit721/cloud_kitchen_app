const express = require("express");
const { AddContact, GetContact, UpdateContact, DeleteContact } = require("../controller/contactController");
const router = express.Router();

router.post("/add", AddContact);
router.get("/get", GetContact);
router.put("/update/:id",UpdateContact);
router.delete("/delete/:id",DeleteContact);

module.exports = router;