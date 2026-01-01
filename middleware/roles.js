const requireRole = (role) => (req, res, next) => {
    if(!req.user) {
        return res.status(401).json({message: `Unauthorize`})
    }

    if(req.user.role !== role ){
        return res.status(403).json({message: `Forbidden`})
    }

    next()
}

const isOwnerOrAdmin = (resourceUserId, currentUser) => { 
    return (
        currentUser.role === 'admin' || String(resourceUserId) === String(currentUser._id) 
    ); 
};

module.exports = {requireRole, isOwnerOrAdmin}

