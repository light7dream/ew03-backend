const db = require("../models");
const config = require("../config/auth.config");

var jwt = require("jsonwebtoken");
var bcrypt = require("bcryptjs");
const { user, admin } = require("../models");
const User = db.user;
const Admin = db.admin;
const nodemailer = require('nodemailer');
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.signup = (req, res) => {
    console.log(req.body)
    User.create({
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 8),
        role: 'user'
    })
        .then(user => {
            res.status(200).send({ user: user });
        })
        .catch(err => {
            res.status(500).send({ err: err.message });
        });
};
/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
exports.signin = (req, res) => {
    User.findOne({
        email: req.body.email
    }).populate('sites')
        .then(async user => {
            if (!user) {
                return res.status(400).send({ error: "User not found." });
            }

            var passwordIsValid = bcrypt.compareSync(
                req.body.password,
                user.password
            );

            if (!passwordIsValid) {
                return res.status(400).send({
                    error: "Invalid password"
                });
            }


            let data = JSON.parse(JSON.stringify(user));
            const queryToken = {};
            queryToken.id = user.id;
            queryToken.perm = user.role;
            var token = jwt.sign(queryToken, config.secret, {
                expiresIn: 86400 // 24 hours
            });

            res.status(200).send({
                user: data,
                accessToken: token,
            });
        })
        .catch(err => {
            res.status(500).send({ message: err.message });
        });
};

exports.checkEmail =  (req, res) => {

    User.findOne({ email: req.body.email })
        .then(user => res.status(200).send(user.email))
        .catch(err => res.status(500).send({ err: err.message}))
        
}


exports.resetPassword = (req, res) => {
    if (!req.body.password)
        return res.status(400).send({ message: 'Password is required' })

    User.findOne({ email: req.body.email })
        .then(async user => {
            user.password = bcrypt.hashSync(req.body.password, 8);
            await user.save();
            res.status(200).send({ message: "success" });
        })
        .catch(err => {
            res.status(500).send({ err: err.message });
        })
}


exports.updateAccount = (req, res) => {
    User.findOne({ email: req.body.email })
    .then(async user => {
        if(req.body.password)
        user.password = bcrypt.hashSync(req.body.password, 8);
        if(req.body.name)
        user.name= req.body.name;
        await user.save();
        res.status(200).send({ message: "success" });
    })
    .catch(err => {
        res.status(500).send({ err: err.message });
    })
}