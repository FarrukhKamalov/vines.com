const jwt = require('jsonwebtoken');
function verify(req,res,next){
    const token = req.cookies.token
    if(!token) return res.status(401).send('royhatdan oting');
    try{
        const verified = jwt.verify(token, process.env.JWTSECRET);
        req.user = verified;
    }catch(err){
        res.status(400).send('token xato');
    }
    next()
}

module.exports = verify;
