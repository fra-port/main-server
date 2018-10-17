const Selling = require('../models/sellingHistory');
const User = require('../models/user');

const createSelling = (req, res) => {

    let { idTelegram, item} = req.body
    User.findOne({
        idTelegram: idTelegram
    })
    .then((result) => {
        if (result) {
            Selling.create({
                userId: result._id,
                selling: item
            })
            .then((result) => {
                res.status(201).json({
                    msg: 'create selling succes',
                    result
                })
            })
            .catch((err) => {
                res.status(500).json(err)
            });
        } else {
            res.status(200).json({
                msg: 'data not found'
            })
        }
    })
    .catch((err) => {
        res.status(500).json(err)
    });
   
}

const getSelling = (req, res) =>{
    Selling.find().populate('userId')
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
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
    .then((result) => {
        if (result) {
            Selling.create({
                userId: result._id,
                selling: item
            })
            .then((result) => {
                res.status(201).json({
                    msg: 'create selling succes',
                    result
                })
            })
            .catch((err) => {
                res.status(500).json(err)
            });
        } else {
            res.status(200).json({
                msg: 'data not found'
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
            msg: 'update succes'})
        
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
            result})
    })
    .catch((err) => {
        res.status(500).json(err)
    });
}


module.exports = {
    getSelling,
    createSelling,
    findSelling,
    updateSelling,
    removeSelling
};
