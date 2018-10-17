const Selling = require('../models/sellingHistory');

const createSelling = (req, res) => {
    
    let { userId, item} = req.body
    Selling.create({
        userId: userId,
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
}

const getSelling = (req, res) =>{
    Selling.find()
    .then((result) => {
        res.status(200).json(result)
    })
    .catch((err) => {
        res.status(500).json(err)
    });
}

const findSelling = (req, res) => {
    let id = req.params.id
    Selling.findById(id)
    .then((result) => {
        res.status(200).json({
            msg: 'data found',
            result
        })
    }).catch((err) => {
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
