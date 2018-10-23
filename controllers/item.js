const Item = require('../models/item');

const createItem = (req, res) => {
    let { itemName, price } = req.body
    Item.create({
        itemName: itemName,
        price: price
    })
        .then((result) => {
            res.status(201).json({
                msg: 'create item succes',
                result
            })
        })
        .catch((err) => {
            res.status(400).json({
                msg: err.message
            })
        });
}


const getItem = (req, res) => {
    Item.find()
        .then((result) => {
            res.status(200).json({
                msg: 'data found',
                result
            })
        })
        .catch((err) => {
            res.status({
                msg: err.message
            })
        });
}

const getOneItem = (req, res) => {
    let id = req.params.id
    Item.findById(id)
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
            res.status(500).json({
                msg: err.message
            })
        });
}


const updateItem = (req, res) => {
    let id = req.params.id
    Item.findOneAndUpdate({
        _id: id
    }, {
            $set: req.body
        })
        .then((result) => {
            res.status(201).json({
                msg: 'update success'
            })
        })
        .catch((err) => {
            res.status(500).json({
                msg: err.message
            })
        });
}

const deleteItem = (req, res) => {
    let id = req.params.id
    Item.deleteOne({ _id: id })
        .then((result) => {
            res.status(200).json({
                msg: 'delete success',
                result
            })
        }).catch((err) => {
            res.status(500).json({
                msg: err.message
            })
        });
}

module.exports = {
    createItem,
    getItem,
    getOneItem,
    updateItem,
    deleteItem
};


