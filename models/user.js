const mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
   firstName : {type : String, required : "please input first name"},
   lastName: {type: String, required: "please input last name"},
   email:{
        type: String,
        required: "Please input a valid email",
        validate:{
            validator: function(value){
                let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                return re.test(value);
            }
        },
        unique: true,
   },
   address: {type: String, required: "please input address"},
   phoneNumber: {type: String, required: "please input phone number"},
   idTelegram: {type: String, required: "please input id telegram"},
   propicURL: {type: String}
}, {
    timestamps: true
});

var User = mongoose.model('User', userSchema);

module.exports = User

