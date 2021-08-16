const { Rooms } = require('../models/Rooms');
const db = require("../db.js");

exports.getAllRooms = (req, res) => {
    db.query("SELECT * FROM rooms", (err, result) => {
        if (err) {
            res.json({
                err: err
            });
        }
        res.json(result);
    })
}