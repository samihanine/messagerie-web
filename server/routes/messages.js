const express = require('express');
const router = express.Router();
const bodyParser = require('body-parser')
const messagesCtrl = require("../controllers/messages")

router.use(bodyParser.json());

router.get("/", messagesCtrl.getAllMessages);
router.get("/:id", messagesCtrl.getMessagesInRoom);
router.post("/", messagesCtrl.newMessage);

module.exports = router;