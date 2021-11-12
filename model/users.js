const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
    Username: {
        type: String,
        min: 2,
        max: 58,
        required: true
    },
    Email: {
        type: String,
        required:true,
        min: 7,
        max: 58
    },
    Password: {
        type: String,
        required: true,
        min: 6,
        max: 58
    },
    image:{
        type: String,
        default: 'https://cdn.icon-icons.com/icons2/2506/PNG/512/user_icon_150670.png'
    },
    followers:{
        type: Array,
        default:[]        
    },
    followings:{
        type: Array,
        default:[]        
    }
});


module.exports = mongoose.model('User', UserSchema);
