const jwt=require('jsonwebtoken');
const verifyToken=(req,res,next)=>{
    const authToken=req.headers.token;
    if(authToken){
        const token=authToken.split(" ")[1];
        jwt.verify(token,process.env.JWT_SEC,(err,user)=>{
            if(err)return res.status(403).json("Token expired!");
            req.user=user;
            next();
        });
    }else{
        return res.status(401).json("unauthorized");
    }
}
const verifyTokenAndAuthorization=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.id===req.params.id || req.user.isAdmin){
            next(); 
        }else{
            return res.status(403).json("not authorized"); 
        }
    }) 
}
const verifyTokenAndAdmin=(req,res,next)=>{
    verifyToken(req,res,()=>{
        if(req.user.isAdmin){
            next(); 
        }else{
            return res.status(403).json("not authorized"); 
        }
    }) 
}
module.exports={verifyToken, verifyTokenAndAuthorization,verifyTokenAndAdmin  }