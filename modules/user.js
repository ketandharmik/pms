const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true, useUnifiedTopology:true , useCreateIndex: true })
const conn = mongoose.Collection

const userSchema = new mongoose.Schema({
    username:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    email:{
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    password:{
        type:String,
        required:true
    },
    date:{
        type:Date,
        default:Date.now
    }
});

const userModel = mongoose.model('users',userSchema)

module.exports = userModel;