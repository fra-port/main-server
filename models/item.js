const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var itemSchema = new Schema({
    itemName : {type : String, required : true},
    price: {type : Number, required : true}
}, {
    timestamps: true
});

var Item = mongoose.model('Item', itemSchema);

module.exports = Item
