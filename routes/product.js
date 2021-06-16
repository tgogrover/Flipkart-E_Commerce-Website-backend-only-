const express=require('express');
const router=express.Router();
const productModel=require('../models/product_Model');
const userModel = require('../models/signup_Model');
//const slug=require('slug');
const { default: slugify } = require('slugify');
const jwt=require('jsonwebtoken');
const multer =require('multer');
const shortId=require('shortid');

const path = require('path');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.join(path.dirname(__dirname), 'uploads'))
    },
    filename: function (req, file, cb) {
      cb(null, shortId.generate() + '-' + file.originalname)
    }
})


const fileUpload = multer({ storage });



const authorisedUser=(req,res,next)=>{
    const {authorisation} = req.headers;
    var header = authorisation.split(' ')[1]
    //console.log(authorisation)
//  var authorisation=localStorage.getItem('loginEmail',token);
//  localStorage.getItem('loginEmail')
try{
 var legalToken=jwt.verify(header, 'mern1Security')}
 catch (err){
   return res.status(400).send({message:err.message})
 }
 if(legalToken){
     next()
 }
 
 else{
     res.status(400).json({
         Message:'Legal Authorisation Required'

     })
 }
}




const ProductCreation=(req,res,next)=>{
    const role=localStorage.getItem('AdminRole');
    if(role=='Admin'){
        next();
    }
    else{
        res.status(400).json({
            Message:"User access denied"
        })
    }
};



router.post('/product',ProductCreation,authorisedUser,fileUpload.array('Product_Pictures'),async(req,res)=>{
//const file=req.files;


    // res.json({
    //     message:'working successfully',
    //     File:file
    // })
 
    const id=localStorage.getItem('AdminId');
    const {Name,Price,Quantity,Category,Description}=req.body;


    let Product_Pictures = [];
    if(req.files.length > 0){
        Product_Pictures = req.files.map(file => {
            return { img: file.filename }
        });
    }


    const productData= new productModel({
        Name,
        Slug:slugify(Name),
        Price,
        Quantity,
        Category,
        Description,
        Created_By:id,
        Product_Pictures
    });

  await  productData.save((err,data)=>{
      if(err) {
          res.status(400).json({
              error: err
          })
      }
     
      else{
          res.status(201).json({
              response:data

          })
          console.log(data)
      }
  })
})

module.exports=router;