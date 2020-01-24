
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/users');

exports.usersPostSignup = (req, res) => {

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
              .then(() => {
                res.status(201).json({
                  message: 'User created'
                });
              })
              .catch(err => {
                res.status(500).json({
                  error: err
                });
              })
          }
        })
      }
    })
}


exports.usersPostLogin = (req, res) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: 'Auth failed.'
        })
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return result.status(401).json({
            message: 'Auth failed.'
          })
        }

        if (result) {
          const token = jwt.sign({
            email: user[0].email,
            userUUID: user[0].uuid
          },
            process.env.JWT_KEY,
            {
              expiresIn: "1hr"
            });
          return res.status(200).json({
            message: 'Auth successful',
            token: token
          })
        }
        res.status(401).json({
          message: 'Auth failed'
        });
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
}

exports.userDeleteOne = (req, res) => {
  const uuid = req.params.userUUID;
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
        }
      })
    })
    .catch(err => {
      res.status(500).json({
        error: err
      })
    });
}