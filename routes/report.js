var express = require('express');
var router = express.Router();
const { createReport, getReportByDate, getReport, removeReport, findReport, getReportMonthly} = require('../controllers/report');

router.get('/', getReport)
      .get('/day', getReportByDate)
      .get('/month', getReportMonthly)
      .get('/:id', findReport)
      .post('/', createReport )
      .delete('/:id', removeReport)

module.exports = router;
