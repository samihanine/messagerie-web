const { Messages } = require('../models/Messages');
const db = require("../db.js");

exports.getAllMessages = (req, res) => {
    db.query("SELECT * FROM messages", (err, result) => {
        if (err) {
            res.json({ err: err });
        }
        res.json(result);
    })
}

exports.getMessagesInRoom = (req, res) => {
    const id = req.params.id;

    db.query(`SELECT * FROM messages where room_id=${id}`, (err, result) => {
        if (err) {
            res.json({ err: err });
        }
        res.json(result);
    })
}

exports.newMessage = (req, res) => {
    const msg = new Messages(req.body);

    db.query("INSERT INTO `messages`(`text`,`creation_date`,`room_id`,`user_id`) VALUES (?,?,?,?);",
        [msg.text,msg.creation_date,msg.room_id,msg.user_id], (err, result) => {
            if (err) {
                res.send({ err: err });
            } else {
                res.json("Le message à bien été envoyé.")
            }
        }
    );
}