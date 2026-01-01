const { isOwnerOrAdmin } = require("../middleware/roles")
const Post = require("../models/Post")

// create a post
const createPost = async (req, res) => {
    const { title, content } = req.body

    try {
        if(!title || !content) {
            return res.status(400).json({message: `Title and content are required`})
        }

        const post = await Post.create({
            title,
            content,
            user: req.user ? req.user._id : null
        })

        res.status(201).json(post)
    } catch (error) {
        res.status(500).json({message: `Error creating post`, error: error.message})
    }
}

// get all posts
const getPost = async(req, res) => {
    try {
        const allPosts = await Post.find().populate('user', 'name email role')
        res.status(200).json(allPosts)
    } catch (error) {
        res.status(500).json({message: `Error fetching posts`, error: error.message})
    }
}


// get post by id
const getPost1 = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id).populate("user", "name email role")
        if(!post) return res.status(404).json({message: `Post not found`})
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({message: `Internal Server Error`, error: error.message})
    }
}


// update a post
const updatePost = async ( req, res) => {

    const {title, content} = req.body
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message: `Post not found`})
        }

        if(!isOwnerOrAdmin(post.user, req.user)){
            return res.status(403).json({message: `Not Allowed`})
        }

        if (title !== undefined) post.title = title
        if (content !== undefined) post.content = content

        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json({message: `Error updating post`, error: error.message})
    }
}

// Delete a post
const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
        if(!post){
            return res.status(404).json({message:`Post not found`})
        }

        if(!isOwnerOrAdmin(post.user, req.user)) return res.status(403).json({message: `Not Allowed`})

        await post.deleteOne()
        res.status(200).json({message: 'Post deleted', postId: req.params.id})
        
    } catch (error) {
        res.status(500).json({message: `Error deleting post`, error: error.message})
    }
}

module.exports = {getPost, createPost, updatePost, deletePost, getPost1 }