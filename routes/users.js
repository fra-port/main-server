const express = require('express')
const router = express.Router()
const User = require('../controllers/user')
const { isLoggedIn } = require('../middlewares/firebaseAuth')

router.post('/', isLoggedIn, User.create)
router.get('/', User.getAll)
router.get('/one/:id', User.getOne)
router.put('/:id', isLoggedIn, User.update)
router.delete('/:id', isLoggedIn, User.remove)

module.exports = router