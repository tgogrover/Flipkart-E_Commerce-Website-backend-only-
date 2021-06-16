const mongoose=require('mongoose');
const cartSchema=new mongoose.Schema({

   UserId:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    Cart_Items:[
        {
            Product:{
                type: mongoose.Schema.Types.ObjectId,ref:'Product',required:true
            },
        Quantity:{
            type:Number,default:1
        },
        Price:{type:Number}
    }
    ],
    
},{ timestamps: true })

module.exports=mongoose.model('Cart',cartSchema)
  