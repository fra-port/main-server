var express = require('express');
var router = express.Router();
const { createSelling, getSellingUser, updateSelling, getSelling, removeSelling, findSelling, findUserTodaySelling } = require('../controllers/sellingHistory');

router.get('/', getSelling)
      .get('/:id', findSelling)
      .get('/user/:userId', getSellingUser)
      .get('/today/:id', findUserTodaySelling)
      .post('/', createSelling)
      .put('/:id', updateSelling)
      .delete('/:id', removeSelling)


module.exports = router;
