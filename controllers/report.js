const Report = require('../models/report');
const Selling = require('../models/sellingHistory');
const Item = require('../models/item');
const User = require('../models/user');

const getItem = async () => {
  try {
    result = await Item.find()
    let listItem = []
    result.forEach(element => {
      listItem.push(
        {
          name: element.itemName,
          totalSelling: 0
        })
    })
    return listItem
  } catch (error) {
    console.error(error);
  }
}

const getUsers = async () => {
  try {
    return users = await User.find()
  } catch (error) {
    console.error(error)
  }
}

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
    .sort({ cratedAt: 'descending' })
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

const getReportByDate = (req, res) => {
  let start = new Date(req.query.date)
  start.setHours(0, 0, 0, 0)
  let end = new Date(req.query.date)
  end.setHours(23, 59, 59, 59)
  Report.find({
    createdAt: { $gte: start, $lt: end }
  }).populate({ path: 'sellingId', populate: { path: 'userId' } })
    .sort({ cratedAt: 'descending' })
    .then(async (result) => {
      let listItem = await getItem()
      let totalIncome = 0
      result.forEach(element => {
        totalIncome += element.total
        element.sellingId.selling.forEach(el => {
          listItem.forEach((elementListItem, index) => {
            /* istanbul ignore next */
            if (el.itemName.toLowerCase() == elementListItem.name.toLowerCase()) {
              /* istanbul ignore next */
              listItem[index].totalSelling += Number(el.quantity) + 0
            }
          })
        })
      });

      let data = {
        totalReport: result.length,
        totalIncome: totalIncome,
        listItem,
        result
      }
      res.status(200).json({
        msg: 'data found',
        data
      })
    })
    .catch((err) => {
      res.status(500).json({
        msg: err.message
      })
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


const getReportMonthly = (req, res) => {
  let month = req.query.month
  Report.find().populate({ path: 'sellingId', populate: { path: 'userId' } })
    .then(async (result) => {
      let listItem = await getItem()
      let incomeMonth = 0
      result.forEach(element => {
        if (element.createdAt.getMonth() + 1 == month) {
          incomeMonth += element.total
          element.sellingId.selling.forEach(el => {
            listItem.forEach((elementListItem, index) => {
              /* istanbul ignore next */
              if (el.itemName.toLowerCase() == elementListItem.name.toLowerCase()) {
                /* istanbul ignore next */
                listItem[index].totalSelling += Number(el.quantity) + 0
              }
            })
          })
        }
      });

      let getUser = await getUsers()
      let users = { listUsers: [] }
      getUser.forEach((element) => {
        if (element.createdAt.getMonth() + 1 <= month) {
          users.listUsers.push(element)
        }
      })

      let obj = {
        listItem: listItem,
        incomeMonth: incomeMonth,
        users
      }

      res.status(200).json({
        msg: 'data found',
        obj
      })
    
    })
    .catch((err) => {
      res.status(500).json({
        msg: err.message
      })
    });
}

module.exports = {
  createReport,
  getReport,
  findReport,
  removeReport,
  getReportByDate,
  getReportMonthly
};
