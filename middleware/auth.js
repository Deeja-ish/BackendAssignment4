const jwt = require("jsonwebtoken")
const User = require ("../models/User")

async function userAuth (req, res, next) {
    const authHeader = req.headers.authorization || "";
    const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : null;

    if(!token){
        return res.status(401).json({message: `Authorization token missing`});
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id).select("-password");
        if(!user){
            return res.status(401).json({message: `Invalid token`});
        }
        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({message: `Token invalid or expired`});
    }
}

module.exports = userAuth