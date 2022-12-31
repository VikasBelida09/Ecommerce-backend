const express=require('express')
const app=express();
const dotenv=require('dotenv')
const cors=require('cors');
dotenv.config();

//routers
const userRoute=require('./routes/user') 
const authRoute=require('./routes/authentication')
const productRoute=require('./routes/product');
const cartRoute=require('./routes/cart');
const orderRoute=require('./routes/order');
const stripeRoute=require('./routes/stripe');
const mongoose=require('mongoose')
mongoose.set("strictQuery", false);
mongoose.connect(process.env.MONGO_URL)
.then(data=>console.log('DB Connection succesful'))
.catch(err=>console.log(err));
app.use(cors());
app.use(express.json())    
app.use('/api/auth',authRoute)
app.use('/api/user',userRoute)
app.use('/api/products',productRoute);
app.use('/api/cart',cartRoute); 
app.use('/api/orders',orderRoute);
app.use('/api/checkout',stripeRoute); 
app.listen(3001,()=>{
    console.log('Backend server is running')
});