const express = require('express')
const router = express.Router()
const User = require('../controllers/user')

router.post('/', User.create)
router.get('/', User.getAll)
router.get('/one/:id', User.getOne)
router.put('/:id', User.update)
router.delete('/:id', User.remove)

module.exports = router