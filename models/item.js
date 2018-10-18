const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
   itemName: {type: String, required: 'item name is required'},
   price: {type: Number, required: 'price is required'},
}, {
    timestamps: true
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item