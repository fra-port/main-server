const firebase = require('firebase')

const config = {
  apiKey: process.env.FIREBASE_KEY,
  authDomain: process.env.FIREBASE_DOMAIN,
  databaseURL: process.env.FIREBASE_DB,
  projectId: process.env.FIREBASE_ID,
  storageBucket: process.env.FIREBASE_BUCKET,
  messagingSenderId: process.env.FIREBASE_SENDERID
}

firebase.initializeApp(config)

module.exports = {
  isLoggedIn: (req, res, next) => {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        next()
      } else {
        res.status(401).json({message: 'Please login first!'})
      }
    })
  }
}