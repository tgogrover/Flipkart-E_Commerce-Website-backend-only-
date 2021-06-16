const express=require('express');
const router=express.Router();
const categoryModel=require('../models/category_Model');
const slugify=require('slugify');
const jwt=require('jsonwebtoken')






const authorisedUser=(req,res,next)=>{
    const {authorisation} = req.headers;
    var header = authorisation.split(' ')[1]
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
  
const createLegalCategory=(req,res,next)=>{
    const role=localStorage.getItem('AdminRole');
    if(role=='Admin'){
        next();
    }
    else{
        res.status(400).json({
            Message:"User access denied"
        })
    }
}


// function createCategories(categories, parentId = null){

//     const categoryList = [];
//     let category;
//     if(parentId == null){
//         category = categories.filter(cat => cat.parentId == undefined);
//     }else{
//         category = categories.filter(cat => cat.parentId == parentId);
//     }

//     for(let cate of category){
//         categoryList.push({
//             _id: cate._id,
//             name: cate.name,
//             slug: cate.slug,
//             parentId: cate.parentId,
//             children: createCategories(categories, cate._id)
//         });
//     }

//     return categoryList;

// };
router.get('/getCategory',authorisedUser,(req,res)=>{
    const getCategory=categoryModel.find({});
    getCategory.exec((err,category)=>{
        if(err){
            res.status(400).json({
                Error:err
            })
        }
        if(category){
      //      const categoryList=createCategories(category)
        res.status(200).json({
            Data:category
        })
    }
    })
})
router.post('/newCategory',authorisedUser,createLegalCategory,async(req,res)=>{
    const name=req.body.name;
     const category= {
       Name:name,
        Slug:slugify(name)
    }
    if(req.body.parentId){
        category.ParentId=req.body.parentId

    }
const Category=new categoryModel(category)
 await Category.save((err,data)=>{
if(err) return res.status(400).json({
      Message:'Something went Wrong'
  })
 res.status(201).json({
      Message:'Data Saved Successfully',
       Data:data
   })
 })

 })
module.exports=router;