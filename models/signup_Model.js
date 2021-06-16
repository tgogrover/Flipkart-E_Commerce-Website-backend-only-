const express=require('express');
const app=express();
const mongoose=require('mongoose');
const bcrypt=require('bcrypt');
require('mongoose-type-email');




var signup_Schema=new mongoose.Schema({
    UserName:{
        type:String,
        required:true,
    },
    FirstName:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:10
    },
    LastName:{
        type:String,
        required:true,
        trim:true,
        minlength:2,
        maxlength:10
    },
    Email:{
        
        type:String,
        required:true,
        trim:true,
        unique:true,
        lowercase:true
    },
    Address:{
        type:String,
        required:true
    },
    Hash_Password:{
        type:String,
        required:true,
        minlength:6
    },
    Contacts:{
        type:Number,
       required:true,
        unique:true
    },
    Role:{
        type:String,
        enum:['User','Admin'],
        default:'User'
    },

    date:{
        type:Date,
        default:Date
    }

});


const userModel= mongoose.model('User',signup_Schema)
module.exports=userModel