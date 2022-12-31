const Product = require('../models/Product');
const { verifyTokenAndAdmin } = require('./verifyToken');

const  router= require('express').Router();

router.post('/',verifyTokenAndAdmin,async (req,res)=>{
   const newProduct=new Product(req.body);
   try {
    const savedProduct=await newProduct.save();
    res.status(201).json(savedProduct);
   } catch (error) {
    console.log(error)
    res.status(500).json(error);
   }
})
router.put('/:id',verifyTokenAndAdmin,async (req,res)=>{
    try {
     const updatedProduct=await Product.findByIdAndUpdate(req.params.id,{
        $set:req.body
     },{new:true} )
     res.status(201).json(updatedProduct);
    } catch (error) {
     console.log(error)
     res.status(500).json(error);
    }
 });

 //deleting the product
router.delete("/:id", verifyTokenAndAdmin, async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);
        res.status(200).json("product has been deleted!");
    } catch (error) {
        return res.status(500).json(error);
    }
})
//get product by id
router.get("/find/:id", async (req, res) => {
    try {
        const prod = await Product.findById(req.params.id);
        res.status(200).json(prod);
    } catch (error) {
        return res.status(500).json(error);
    }
})

//get all products 
router.get("/", async (req, res) => {
    const query = req.query.new;
    const qCategory=req.query.category
    try {
        let products;
        if(query){
            products=await Product.find().sort({createdAt:-1}).limit(5);
        }else if(qCategory){ 
            console.log(qCategory)
            products=await Product.find({categories:{
                $in:[qCategory]
            }})
        }
        else{
            products=await Product.find(); 
        }
        res.status(200).json(products) ;
    } catch (error) {
        return res.status(500).json(error);
    }
})
module.exports=router;