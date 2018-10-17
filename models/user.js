const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
   firstName : {type : String, required : true},
   lastName: {type: String, required: true},
   email : {type : String, required : true, unique : true},
   password : {type : String, required : true},
   address: {type: String, required: true},
   phoneNumber: {type: String, required: true},
   idTelegram: {type: String, required: true}
}, {
    timestamps: true
});

var User = mongoose.model('User', userSchema);

module.exports = User

