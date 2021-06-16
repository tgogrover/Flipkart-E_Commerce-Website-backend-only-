const express=require('express');
const app=express();
const userSign=require('./routes/user_Sign')
const adminSign=require('./routes/admin_Sign')
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const categoryRoutes=require('./routes/category')
const productRoutes=require('./routes/product');
const cartRoutes=require('./routes/cart');
mongoose.connect("mongodb://localhost:27017/E-Commerce_Website",{useCreateIndex:true, useUnifiedTopology:true, useNewUrlParser:true,useFindAndModify: false })
mongoose.connection.on("connected",()=>{
    console.log("Database is connected");
})

mongoose.connection.on("error",(err)=>{
    console.log(err);
})
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())
app.use(productRoutes)
app.use(categoryRoutes)
app.use(userSign);
app.use(adminSign);
app.use(cartRoutes)
app.listen(3000,()=>{
    console.log('server:3000 is working successfully')
})
