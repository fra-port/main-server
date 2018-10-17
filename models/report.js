const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var reportSchema = new Schema({
    item : {type : String, required : true},
    price: {type : Number, required : true},
    
}, {
    timestamps: true
});

var Report = mongoose.model('Report', reportSchema);

module.exports = Report
