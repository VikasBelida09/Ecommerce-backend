const router=require("express").Router();
const stripe=require("stripe")(process.env.STRIPE_KEY);


router.post("/payment",(req,res)=>{
    stripe.charges.create({
        amount:req.body.amount,
        source:req.body.tokenId,
        currency:"inr"
    },(stripeErr,stripeRes)=>{
        if(stripeErr){
            return res.status(500).json(stripeErr);
        }
        return res.status(200).json(stripeRes);
    })
})

module.exports=router;