const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema = new Schema({
   totalPrice: {type : Number, required : true},
   quantity: {type : Number, required : true},
   userId: { type: Schema.Types.ObjectId, ref: 'User' },
   itemId: { type: Schema.Types.ObjectId, ref: 'Item' },
}, {
    timestamps: true
});

var Report = mongoose.model('Report', reportSchema);

module.exports = Report
