const Report = require('../models/report');
const Selling = require('../models/sellingHistory');

const createReport = (req, res) => {
  let id = req.body.sellingId
  Selling.findById(id)
    .then((result) => {
      if (result) {
        let totalSelling = 0
        result.selling.forEach(element => {
          totalSelling += element.Total
        });
        Report.create({
          total: totalSelling,
          sellingId: id
        })
          .then((result) => {
            res.status(201).json({
              msg: 'create succes',
              result
            })
          })
          .catch((err) => {
            res.status(500).json(err)
          });

      } else {
        res.status(400).json({
          msg: 'data not found'
        })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    });

}

const getReport = (req, res) => {
  Report.find().populate({ path: 'sellingId', populate: { path: 'userId' } })
    .then((result) => {
      res.status(200).json({
        msg: 'data found',
        result
      })
    })
    .catch((err) => {
      res.status(500).json(err)
    });
}

const findReport = (req, res) => {
  let id = req.params.id
  Report.findById(id).populate({ path: 'sellingId', populate: { path: 'userId' } })
    .then((result) => {
      if (result == null) {
        res.status(200).json({
          msg: 'data not found',
        })
      } else {
        res.status(200).json({
          msg: 'data found',
          result
        })
      }

    })
    .catch((err) => {
      res.status(500).json(err)
    });
}

const removeReport = (req, res) => {
  let id = req.params.id
  Report.findById(id)
    .then((result) => {
      if (result == null) {
        res.status(200).json({
          msg: 'data not found',
        })
      } else {
        Report.deleteOne({
          _id: req.params.id
        })
          .then((result) => {
            res.status(200).json({
              msg: 'delete succes',
              result
            })
          })
          .catch((err) => {
            res.status(500).json(err)
          });
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    });

}


module.exports = {
  createReport,
  getReport,
  findReport,
  removeReport
};
