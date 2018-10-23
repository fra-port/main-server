const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema = new Schema({
   total: {type : Number, required : true},
   sellingId: { type: Schema.Types.ObjectId, ref: 'Selling' }
}, {
    timestamps: true
});

var Report = mongoose.model('Report', reportSchema);

module.exports = Report
