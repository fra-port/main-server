const router = require('express').Router()
const { create,
        remove } = require('../controllers/fcm');

router.post('/create', create)
      .post('/remove', remove)
module.exports = router