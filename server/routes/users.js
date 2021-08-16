const express = require('express');
const router = express.Router();
const usersCtrl = require("../controllers/users")
const bodyParser = require('body-parser')

router.use(bodyParser.json());

router.get("/", usersCtrl.getAllUsers);

router.get("/:id", usersCtrl.getUserById);

router.post("/auth", usersCtrl.authUser);

router.post("/", usersCtrl.addUser);


module.exports = router;