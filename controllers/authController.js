const bcrypt = require("bcrypt")
const User = require("../models/User")
const jwt = require("jsonwebtoken")

async function registerUser(req, res) {
    const {name, email, password, role} = req.body

    try {
        if(!name || !email || !password){
            return res.status(400).json({message: `Name, email and password are required`})
        }

        const existing = await User.findOne({email})
        if(existing) {
           return res.status(409).json({message: `User already exists`})
        }

        const hashPassword = await bcrypt.hash(password, 10)
        const createUser = await User.create({ 
            name,
            email,
            password: hashPassword,
            role: role || "user"
        })

        const token = jwt.sign({id: createUser._id, role: createUser.role }, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h"
        })

        res.status(201).json({
            user: {id : createUser._id, email: createUser.email, role: createUser.role},
            token
        })

    } catch (error) {
        console.error(`Error creating user ${error}`)
        res.status(500).json({message: `Registration failed`})
    }
};

async function loginUser(req, res){
    const { email, password } = req.body
    try {
        if(!email || !password){
            return res.status(400).json({message: `Email and password are required`})
        }

        const user = await User.findOne({email})
        if(!user){
           return res.status(404).json({message:`User not found`})
        }

        const comparePassword = await bcrypt.compare(password, user.password)
        if(!comparePassword){
            return res.status(401).json({message: `Incorrect credentials`})
        }

        const token = jwt.sign({id : user._id, role: user.role}, process.env.JWT_SECRET_KEY, {
            expiresIn: "1h"
        })

        res.status(200).json({
            user: {id : user._id, email: user.email, role: user.role},
            token
        })

    } catch (error) {
        console.error(`Internal Server error`, error);
        res.status(500).json({message: `Login failed please try again`})
    }
};

async function forgotPassword(req, res){
    const {email } = req.body
    try {
        if(!email) return res.status(400).json({message: `Email is required`})
        const user = await User.findOne({ email })
        if(!user) return res.status(404).json({message: `Email not found`})

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET_KEY, {expiresIn: '30m'})

        res.status(200).json({message: `Password reset link generated`, resetLink: `/api/auth/resetPassword/${token}`})
    } catch (error) {
        res.status(500).json({message: `Error generating reset link`, error: error.message})
    }
};

async function resetPassword(req, res){
    const { password } = req.body
    try{
        if(!password) return res.status(400).json({message: `Password is required`})
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET_KEY)
        if(!decoded || !decoded.id) return res.status(400).json({message: `Invalid or expired token`})

        const user = await User.findById(decoded.id)
        if(!user) return res.status(404).json({message: `User not found`})

        user.password = await bcrypt.hash(password, 10)

        await user.save()
        res.status(200).json({message: `Password updated successfully`})
    }catch(error){
        res.status(500).json({message: `Internal Server Error`, error: error.message})
    }
};


module.exports = { registerUser, loginUser, forgotPassword, resetPassword }