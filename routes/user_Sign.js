
const express=require('express');
const router=express.Router();
const userModel=require('../models/signup_Model')
const bcrypt=require('bcrypt');
const jwt=require('jsonwebtoken');
const userDb=userModel.find({});
const mongoose=require('mongoose');
const { body, validationResult } = require('express-validator');






if (typeof localStorage === "undefined" || localStorage === null) {
    var LocalStorage = require('node-localstorage').LocalStorage;
    localStorage = new LocalStorage('./scratch');
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


const contactsMiddleware = async (req,res,next) => {
    const contacts=req.body.contacts;
    const sameContacts=await userModel.findOne({
    Contacts:  contacts
    })
    if(sameContacts){
      return  res.status(400).json({
          Message:"Same contacts Already in use, Try different Contacts"
      });
        
    }
    
        next();
    
};
      


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


const userValidation=  (req,res,next)=> {const errors = validationResult(req);
if (!errors.isEmpty()) {
  return res.status(400).json({ errors: errors.array() });
}
next();
}



  
router.post('/signup',legal_Signup,contactsMiddleware,validationRequirement,userValidation,async(req,res)=>{

    const firstName=req.body.firstName;
    const lastName=req.body.lastName;
    const email=req.body.email;
    const contacts=req.body.contacts;
    const address=req.body.address;
    const password=req.body.password;
    
  // console.log(address)
    const Hash_Password=bcrypt.hashSync(password,10);
     const User=new userModel({
         FirstName:firstName,
         LastName:lastName,
         Hash_Password:Hash_Password,
         Email:email, 
         Address:address,
         Contacts:contacts,
         UserName: Math.random().toString()
 })
 //console.log(contacts)
   await User.save((err,Data)=>{
       if(err){
        
    
           res.status(400).json({
               message:'Something went Wrong',
               Error:err
           })
        
       }
       if(Data){
          // console.log(Data)
        const { FirstName, LastName, Email}=Data
        res.status(201).json({
            message:'User Information Saved Successfully',
            Response:{FirstName,LastName, Email}
        })

     
       }

   })

      
   
})

router.post('/login',loginRequirement,userValidation,async (req,res)=>{
    const email=req.body.email;
    const legalEmail=userModel.findOne({
      Email:email
    })
    await   legalEmail.exec((err,userData)=>{
        if(err) throw err;
        if(userData){
            const { FirstName, LastName, Email}=userData

            if(bcrypt.compareSync(req.body.password,userData.Hash_Password)){
                var token = jwt.sign({ _id: userData._id}, 'mern1Security')
                const role=userData.Role;
                const userID=userData._id
                localStorage.setItem("loginEmail",token);
                localStorage.setItem('loginRole',role);
                localStorage.setItem('userID',userID);
                
                
             res.status(200).json({
                 token,
             userData: { FirstName, LastName, Email}
             })   
        }
        else{
            res.status(400).json({
                message:'Invalid Password'
            })

        }
    }
    else{
        res.status(400).json({
            Message:"You have to signin first"
  

        })
    }

})
})
router.get('/logout',(req,res)=>{
    localStorage.removeItem('loginEmail')
    localStorage.removeItem('loginRole')
    localStorage.removeItem('userID')
    res.json({
        Message:'logout Successfull'
    })

})

module.exports=router;
