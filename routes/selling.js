var express = require('express');
var router = express.Router();
const { createSelling, updateSelling, getSelling, removeSelling, findSelling, findUserTodaySelling} = require('../controllers/sellingHistory');

router.get('/', getSelling)
      .get('/:id', findSelling)
      .get('/today/:id', findUserTodaySelling)
      .post('/', createSelling )
      .put('/:id', updateSelling)
      .delete('/:id', removeSelling)

module.exports = router;
