const express = require('express');
const router = express.Router();
const roomsCtrl = require("../controllers/rooms")
const bodyParser = require('body-parser')

router.use(bodyParser.json());

router.get("/", roomsCtrl.getAllRooms);

module.exports = router;