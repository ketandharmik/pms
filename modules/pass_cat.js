const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/pms',{useNewUrlParser:true, useUnifiedTopology:true , useCreateIndex: true })
const conn = mongoose.Collection;

const pass_cat_schema = new mongoose.Schema({
    password_category: {
        type:String,
        required:true,
        index:{
            unique:true
        }
    },
    date:{
        type: Date,
        default: Date.now
    }
});

const pass_cat_model = mongoose.model('pass_category',pass_cat_schema);

module.exports = pass_cat_model;