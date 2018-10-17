const Report = require('../models/report');

const createReport = (req, res) => {
  Report.create(req.body)
  .then((result) => {
    res.status(201).json({
      msg: 'create succes',
      result
    })
  })
  .catch((err) => {
    res.status(500).json(err)
  });
}

const getReport = (req, res) => {
  Report.find()
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
  Report.findById(id)
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

const updateReport = (req, res) => {
    let id = req.params.id
    Report.findOneAndUpdate({
        _id: id
    }, {
        $set : req.body
    })
    .then((result) => {
      res.status(200).json({
        msg: 'update succes'})  
    })
    .catch((err) => {
      res.status(500).json(err)
    });
}

const removeReport = (req, res) => {
    Report.deleteOne({
        _id: req.params.id
    })
    .then((result) => {
        res.status(200).json({
            msg: 'delete succes',
            result})
    })
    .catch((err) => {
        res.status(500).json(err)
    });
}


module.exports = {
    createReport,
    getReport,
    findReport,
    updateReport,
    removeReport
};
