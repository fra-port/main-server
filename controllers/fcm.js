const Fcm = require('../models/fcm.js')
const admin = require('firebase-admin')
require('dotenv').config()
const serviceAccount = require('../fcm_service_account.json')
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: process.env.DB_URL
});

const create = function (req,res) {
  Fcm.findOne({
    token : req.body.token
  })
    .then(function(result) {
      if (result) {
        res.status(200)
        .json({ msg: 'already recorded' })
      } else {
        Fcm.create({
          token: req.body.token
        })
        .then((user)=> {
          res.status(200)
            .json({  msg: "successfully save token" })
          })
          .catch((err) => {
            res.status(400)
            .json({ msg: err.message })
          })
        }
      })
      .catch((err) => {
        res.status(400)
        .json({
          msg: err.message
        })
    })
}

const sendNotif = function (name, total) {
  Fcm.find()
    .then((result) => {
      if (result.length > 0) {
        result.forEach(data => {
          const registrationToken = data.token
          const message = {
            notification: {
              title: 'Omzet Daily Report',
              body: `agent ${name} sent report with total income Rp.${total.toLocaleString()}`
            },
            token: registrationToken
          };
          admin.messaging().send(message)
            .then((response) => {
              console.log('Successfully sent message:', response);
            })
            .catch((error) => {
              console.log('Error sending message:', error);
            });
        })
      } else {
        console.log('data not found')
      }
    })
}

const remove = function (req, res) {
  Fcm.deleteOne({
    token: req.body.token
  })
  .then(result => {
    if (result) 
      res.status(200)
        .json({ msg: 'success delete' })
    else
      res.status(400)
        .json({ msg: 'not found' })
  })
  .catch (err => {
    res.status(400)
      .json({ msg: err.message })
  })
}

module.exports = {
  create,
  remove,
  sendNotif
}