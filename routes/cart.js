const express= require('express');
const router=express.Router();
const cartModel=require('../models/cart_Model');
const jwt =require('jsonwebtoken')



const authorisedUser=(req,res,next)=>{
    const {authorisation} = req.headers;
    var header = authorisation.split(' ')[1]
   // console.log(authorisation)
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



const usersCart=(req,res,next)=>{
    const role=localStorage.getItem('loginRole');
    if(role=='User'){
        next();
    }
    else{
        res.status(400).json({
            Message:"User access denied"
        })
    }
};


router.post('/cart',usersCart,authorisedUser,async(req,res)=>{
    const { Cart_Items}= req.body
    const userID=localStorage.getItem('userID')
    const cartID=cartModel.findOne({UserId:userID})
  await  cartID.exec((err,id)=>{
        if(err) throw err;
        if(id){
          
            //id.Cart_Items.Product
            const Product = req.body.Cart_Items.Product
           // console.log(Product)

            const productID=id.Cart_Items.find((c) => { return c.Product == Product})
         //   
            if(productID){
                parseInt
                const evaluate=  parseInt(req.body.Cart_Items.quantity)+  parseInt(productID.Quantity)
                productID.Quantity=evaluate;
                
console.log(req.body.Cart_Items.quantity)
console.log(id.Cart_Items);
console.log(productID.Quantity);
console.log(evaluate);

id.save(({ suppressWarning: true }),(err,data)=>{
    if(err) throw err;
            res.status(201).json({
                     Cart:data
                     })

})
            }else{


   var cartArray=id.Cart_Items
 //  console.log(cartArray)
            
          //  console.log(cartItemsInsert)
            // const updateCart=cartModel.findOneAndUpdate({UserId:userID},{Cart_Items:[...id.Cart_Items,req.body.Cart_Items]},{new:true})
            // updateCart.exec((err,Add)=>{
            //     if(err) throw err;
            //     else{
            //         res.status(201).json({
            //             Cart_Items:Add
            //         })
            //     }
            // }) 
            

            id.Cart_Items.push(Cart_Items);
           id.save((err,insertData)=>{
                if(err) throw err
                res.status(201).json({
                    Cart:insertData
                })
            })
        }
    }
        else{
            const cartData=new cartModel({
                UserId:  userID,
                Cart_Items
            })
           cartData.save((err,data)=>{
                if(err) throw err;
                else{
                    res.status(201).json({
                        Cart_Items:data
                    })
                }
            })
        }
    })
})

module.exports=router;