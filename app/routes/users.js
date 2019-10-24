const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

const User = require('../models/users');

router.post('/signup', (req, res) => {
    // console.log(req.body.email);
    User.find({ email: req.body.email })
        .exec()
        .then(user => {
            if (user.length >= 1) {
                return res.status(409).json({
                    message: 'Mail exist'
                })
            } else {
            // hash the password before creating a user
            bcrypt.hash(req.body.password, 10, (err, hash) => {
                if (err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
            // Create a user
                    const user = new User({
                        email: req.body.email,
                        password: hash,
                        meta: { ...req.body.meta, created: new Date() }
                    });
                user
                .save()
                .then(payload => {
                    console.log(payload);
                    res.status(201).json({
                        message: 'User created'
                    });
                })
                .catch(err => {
                    console.log(err);
                    res.status(500).json({
                        error: err
                    });
                })
                }
            })
        }
    })
});


router.delete('/:userUUID', (req, res) => {
    const uuid = req.params.orderUUID;
    User.updateOne(
        { uuid },
        {
            $set: { 'meta.active': false, 'meta.updated': new Date() }
        }
    )
    .exec()
    .then(payload => {
            res.status(200).json({
                user: payload,
                message: 'User deleted',
                request: {
                    type: 'DELETE',
                    description: 'Soft-deletes a single user by its uuid',
                    url: 'http://localhost:3000/users/'
        }})
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
            error: err
        })
    });
});


module.exports = router;
