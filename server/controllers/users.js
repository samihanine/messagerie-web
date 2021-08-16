const { Users } = require('../models/Users');
const db = require("../db.js");
const bcrypt = require('bcrypt');
const saltRounds = 10;

exports.getAllUsers = (req, res) => {
    db.query("SELECT * FROM users", (err, result) => {
        if (err) {
            res.json({
                err: err
            });
        }
        res.json(result);
    })
}

const hash_password = (password, callback) => {
    bcrypt.hash(password, saltRounds, (err, hash) => {
        callback(hash);
    });
}

exports.addUser = (req, res) => {
    let user = new Users(req.body);

    const addDb = (password) => {
        user.password = password;

        db.query(
            "INSERT INTO `users`(`pseudo`, `password`,`creation_date`,`mail`,`privilege`,`description`,`image`) VALUES (?,?,?,?,?,?,?);",
            [user.pseudo, user.password, user.creation_date, user.mail, user.privilege, user.description, user.image], (err, result) => {
                if (err) {
                    if (err.errno === 1062) res.send({ err: "Ce pseudo est déjà utilisé par un utilisateur." }); 
                    else if (err) res.send({ err: err });
                } else {
                    db.query(`SELECT * FROM users where pseudo='${user.pseudo}'`, (err, result) => {
                        if (err) res.send({ err: err });
                        else if (!result[0]) res.json("Connexion automatique indisponible.");
                        else res.json(result[0].id);
                    })
                }
            }
        );
    }

    hash_password(user.password, addDb);
}

exports.authUser = (req, res) => {
    const pseudo = req.body.pseudo;
    const password = req.body.password;

    db.query(`SELECT * FROM users where pseudo='${pseudo}'`, (err, result) => {
        if (err) res.json({
            err: err
        });

        if (result[0]) {
            bcrypt.compare(password, result[0].password, (error, boolean) => {
                if (!boolean) res.json({
                    err: "Mot de passe incorrect."
                })

                else if (error) res.json({
                    err: error
                });

                else res.json(result[0]);
            });
        } else {
            res.json({
                err: "Pseudo incorrect."
            })
        }
    })
}

exports.getUserById = (req, res) => {
    const id = req.params.id;

    db.query(`SELECT * FROM users where id=${id}`, (err, result) => {
        if (err) {
            res.json({ err: err });
        }
        res.json(result[0]);
    })
}