const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var item = new Schema ({itemName: String, quantity: Number, Total: Number})
var sellingSchema = new Schema({
    // userId : {type: Schema.Types.ObjectId, ref: 'User'},
    userId: String,
    selling: [item]
}, {
    timestamps: true
});

var Selling = mongoose.model('Selling', sellingSchema);

module.exports = Selling
