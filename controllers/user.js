const User = require('../models/user.js')

const create = function (req,res) {
  User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    address: req.body.address,
    phoneNumber : req.body.phoneNumber,
    idTelegram: req.body.idTelegram,
    propicURL: req.body.propicURL
  })
  .then((user)=> {
    res.status(200)
      .json({
        msg: "successfully create user",
        data: user
      })
  })
  .catch((err) => {
    res.status(400)
      .json({
        msg: err.message
      })
  })
}

const getAll = function (req, res) {
  User.find()
    .then((users) => {
      res.status(200)
        .json({
          msg: "successfully get all user",
          data: users
        })
    })
    .catch((err) => {
      res.status(400)
        .json({
          msg: err.message
        })
    })
}

const getOne = function (req, res) {
  User.findOne({
    _id : req.params.id
  })
    .then(user => {
      if (user) {
        res.status(200)
          .json({
            msg: "successfully get user",
            data: user
          })
      } else {
        res.status(400)
          .json({
            msg: "user not found"
          })
      }
    })
    .catch (err => {
      res.status(400)
        .json({
          msg: err.message
        })
    })
}

const update = function (req,res) {
  User.findOneAndUpdate({
    _id : req.params.id
  }, {
    $set : req.body
  })
    .then(result => {
      res.status(200)
        .json({ msg: 'update user success'})
    })
    .catch (err => {
      res.status(400)
        .json({
          msg: err.message
        })
    })
}

const remove = function (req, res) {
  User.remove({
    _id: req.params.id
  })
  .then(result => {
    res.status(200)
      .json({ message: 'delete user success'})
  })
  .catch (err => {
    res.status(400)
      .json({ msg : err.message })
  })
}

module.exports = {
  create,
  getAll,
  getOne,
  update,
  remove
}