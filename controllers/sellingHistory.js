const Selling = require('../models/sellingHistory');
const User = require('../models/user');
const Item = require('../models/item');
const Report = require('../models/report');
const moment = require('moment');

const getItem = async () => {
    try {
        return result = await Item.find()
    } catch (err) {
        console.log(err.message);

    }
}

const createSelling = (req, res) => {
   
    let { idTelegram, item } = req.body
    User.findOne({
        idTelegram: idTelegram
    })
        .then(async (result) => {
            if (result) {

                let dataItems = await getItem()

                let newItem = []
                item.forEach(itemReq => {
                    dataItems.forEach(dataItem => {
                        if (itemReq.itemName.toLowerCase() == dataItem.itemName.toLowerCase()) {
                            itemReq.Total = itemReq.quantity * dataItem.price
                            newItem.push(itemReq)
                        }
                    })
                });

                Selling.create({
                    userId: result._id,
                    selling: newItem
                })
                    .then((result) => {
                        let totalSelling = 0
                        result.selling.forEach(element => {
                            totalSelling += element.Total
                        });
                        Report.create({
                            total: totalSelling,
                            sellingId: result._id
                        })
                            .then((resultReport) => {
                                res.status(201).json({
                                    msg: 'create succes',
                                    resultReport
                                })
                            })
                            .catch((err) => {
                                res.status(500).json(err)
                            });
                    })
                    .catch((err) => {
                        /* istanbul ignore next */
                        res.status(500).json(err)
                    });
            } else {
                res.status(200).json({
                    msg: 'data not found'
                })
            }
        })
        .catch((err) => {
            /* istanbul ignore next */
            res.status(500).json(err)
        });

}

const getSelling = (req, res) => {
    Selling.find().populate('userId')
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            /* istanbul ignore next */
            res.status(500).json(err)
        });
}

const findSelling = (req, res) => {
    let id = req.params.id
    Selling.findById(id).populate('userId')
        .then((result) => {
            if (result == null) {
                res.status(200).json({
                    msg: 'data  not found',
                })
            } else {
                res.status(200).json({
                    msg: 'data found',
                    result
                })
            }

        }).catch((err) => {
            res.status(500).json(err)
        });
}

const findUserTodaySelling = (req, res) => {
    User.findOne({
        idTelegram: req.params.id
    })
        .then((user) => {
            if (user) {
                var today = moment().startOf('day')
                var tomorrow = moment(today).endOf('day')

                Selling.find({
                    userId: user._id,
                    createdAt: {
                        $gte: today.toDate(),
                        $lt: tomorrow.toDate()
                    }
                })
                    .then((result) => {
                        if (result.length > 0) {
                            res.status(200).json({
                                msg: 'data found',
                                result
                            })
                        } else {
                            res.status(200).json({
                                msg: 'data not found'
                            })
                        }
                    })
                    .catch((err) => {
                        res.status(400).json(
                            { msg: err.message }
                        )
                    });

            } else {
                res.status(200).json({
                    msg: 'user not found'
                })
            }
        })
        .catch((err) => {
            res.status(500).json(err)
        });
}

const updateSelling = (req, res) => {
    let idSelling = req.params.id
    Selling.findOneAndUpdate({
        _id: idSelling
    }, {
            $set: req.body
        })
        .then((result) => {
            res.status(200).json({
                msg: 'update succes'
            })

        })
        .catch((err) => {
            res.status(500).json(err)
        });
}

const removeSelling = (req, res) => {
    Selling.deleteOne({
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

const getSellingUser = (req, res) => {
    Selling
        .find({ userId: req.params.userId })
        .populate('userId')
        .sort({ createdAt: 'descending' })
        .then((result) => {
            res.status(200).json(result)
        })
        .catch((err) => {
            /* istanbul ignore next */
            res.status(500).json(err)
        });
}

const getSellingTelegram = (req, res) => {
    User.findOne({ idTelegram: req.params.id })
        .then(result => {
            if (result) {
                req.params.userId = result._id
                getSellingUser(req, res)
            } else {
                res.status(400).json({ msg: 'data not found' })
            }
        })
        .catch(err => {
            res.status(500).json(err)
        })
}


module.exports = {
    getSelling,
    createSelling,
    findSelling,
    updateSelling,
    removeSelling,
    findUserTodaySelling,
    getSellingUser,
    getSellingTelegram
};
