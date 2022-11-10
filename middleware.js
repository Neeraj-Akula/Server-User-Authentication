const jwt=require("jsonwebtoken");

module.exports=function(req,res,next){
    try{
        let token=req.header("x-token");
        if(!token)
        {
            res.status(500).send("token not received");
        }
        let decode=jwt.verify(token,'jwtSecret');
        req.user=decode.user;
        next();
    }
    catch(error){
        return res.send("before token error");
    }
}
