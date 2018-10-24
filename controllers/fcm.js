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
        /* istanbul ignore next */
        result.forEach(data => {
          /* istanbul ignore next */
          const registrationToken = data.token
          /* istanbul ignore next */
          const message = {
            notification: {
              title: 'Omzet Daily Report',
              body: `agent ${name} sent report with total income Rp.${total.toLocaleString()}`
            },
            token: registrationToken
          };
          admin.messaging().send(message)
            .then((response) => {
              /* istanbul ignore next */
              console.log('Successfully sent message:', response);
            })
            .catch((error) => {
              /* istanbul ignore next */
              console.log('Error sending message:', error);
            });
        })
      } else {
        /* istanbul ignore next */
        console.log('data not found')
      }
    })
}

const remove = function (req, res) {
  Fcm.deleteOne({
    token: req.body.token
  })
  .then(result => {
    if (result.n === 1) 
      res.status(200)
        .json({ msg: 'success delete' })
    else
      res.status(400)
        .json({ msg: 'not found' })
  })
}

module.exports = {
  create,
  remove,
  sendNotif
}