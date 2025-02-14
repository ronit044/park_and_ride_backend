const express = require("express");

const router = express.Router();

const { login, register } = require("../controllers/auth");

router.post("/signup", register);
router.post("/login", login);

module.exports = router;
