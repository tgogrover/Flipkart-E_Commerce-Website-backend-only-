  
const express=require('express');
const router=express.Router();
const userModel=require('../models/signup_Model')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userDb=userModel.find({});
const  {body,validationResult}=require('express-validator');




if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
  }


  
const validationRequirement=[
    body('firstName').
    notEmpty()
    .isLength({min:2,max:10})
    .withMessage('firstName is required with atleast 2 alphabets and not more than 10 alphabets required '),
    body('lastName')
    .isLength({min:2,max:10})
    .withMessage('LastName is required with atleast 2 alphabets and not more than 10 alphabets required '),
    body('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 character long'),
    body('address').
    notEmpty().
    //isString().
    withMessage(' valid address is required'),
    body('contacts').
    notEmpty().
    isInt().
    withMessage('valid contacts  is required'),
    
]

const loginRequirement=[
    body('email')
    .isEmail()
    .withMessage('Valid Email is required'),
    body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
]


const AdminValidation=  (req,res,next)=> {const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next();
}

const legal_Signup = async (req,res,next) => {
    const email=req.body.email;
    const newEmail=await userModel.findOne({
    Email:  email
    })
    if(newEmail){
       return  res.status(400).json("Email already exist");
        
    }
    
        next();
    
};


router.post('/admin/signup',validationRequirement,AdminValidation,legal_Signup,async(req,res)=>{
    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const contacts=req.body.contacts;
    const address=req.body.address;
    const password=req.body.password;
    

    const Hash_Password=bcrypt.hashSync(password,10);
     const User=new userModel({
         FirstName:firstName,
         LastName:lastName,
         Hash_Password:Hash_Password,
         Email:email, 
         Address:address,
         Contacts:contacts,
         UserName: Math.random().toString(),
         Role:'Admin'
 })
   await User.save((err,Data)=>{
       if(err){
           res.status(400).json({
               message:'Something went Wrong',
               Error:err
           })
       }
       else{
           const {Email,FirstName,LastName,Role}=Data
        res.status(201).json({
            message:'User Information Saved Successfully',
            Response:{Email,FirstName,LastName,Role}
        })    
       }
   })     
})

router.post('/admin/login',loginRequirement,AdminValidation,async (req,res)=>{
    const email=req.body.email;
    const legalEmail=userModel.findOne({
      Email:email
    })
    await   legalEmail.exec((err,Data)=>{
        if(err) throw err
        if(Data){
            const {   FirstName, LastName, Role,Email }= Data
            if(bcrypt.compareSync(req.body.password,Data.Hash_Password)){
                const Role=Data.Role;
                const id=Data._id;
                var token = jwt.sign({ _id: Data._id,Role:Data.Role}, 'mern1Security',{expiresIn:'5h'});
                localStorage.setItem("AdminEmail",token);
                localStorage.setItem('AdminRole',Role);
                localStorage.setItem('AdminId',id);
             
             res.status(200).json({
                 token,
             adminData:{FirstName,LastName,Role,Email}
             })   
        }
        else{
            res.status(400).json({
                Message:'Invalid password '
            })
        }
    }
    else{
        res.status(400).json({
            message:'You have to sigin First'
        })
    }
})
})


router.get('/admin/logout',(req,res)=>{
    localStorage.removeItem('AdminEmail')
    localStorage.removeItem('AdminRole')
    localStorage.removeItem('AdminId')
    res.json({
        Message:'logout Successfull'
    })

})

module.exports=router;
