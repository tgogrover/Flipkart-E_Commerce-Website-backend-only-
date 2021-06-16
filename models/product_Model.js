const express=require('express');
const mongoose=require('mongoose');


const product_Schema=new mongoose.Schema({
    Name:{
        required:true,
        type:String,
        trim:true
    },
    Slug:{
        required:true,
        type:String,
        trim:true
    },
    Price:{
        required:true,
        type:Number,
        trim:true
    },
    Quantity:{
        required:true,
        type:Number
    },
    Offer:{
        type:Number,
        trim:true
    },
    Description:{
        required:true,
        type:String,
        trim:true
    },
    Product_Pictures:[
        {  img: { type:String}
        }
    ],
    Reviews:[
        {UserId:{type: mongoose.Schema.Types.ObjectId,ref:'User'},
        review:String
        }

    ],
    Category:{
        type:mongoose.Schema.Types.ObjectId,ref:'Category',required:true
    },
    Created_By:{
        type:mongoose.Schema.Types.ObjectId,ref:'User',required:true
    },
    Updated_At:Date

}, { timestamps: true })


module.exports=mongoose.model('Product',product_Schema)