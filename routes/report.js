var express = require('express');
var router = express.Router();
const { createReport, updateReport, getReport, removeReport, findReport} = require('../controllers/report');

router.get('/', getReport)
      .get('/:id', findReport)
      .post('/', createReport )
      .delete('/:id', removeReport)

module.exports = router;
