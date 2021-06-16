const express=require('express');
const mongoose=require('mongoose');
const categorySchema=new mongoose.Schema({
    Name:{
        required:true,
        type:String,
        
    },
    Slug:{
        type:String,
        required:true,
        trim:true,
        unique:true
    },
    ParentId: {
        type: String
    }
})
const catergory_Model=mongoose.model('Category',categorySchema)
module.exports=catergory_Model