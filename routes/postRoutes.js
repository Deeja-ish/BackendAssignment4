const express = require("express")
const { getPost, createPost, updatePost, deletePost, getPost1 } = require("../controllers/postController")
const router = express.Router()

router.get("/", getPost)
router.get("/:id", getPost1)
router.post("/create", createPost)
router.put("/update/:id", updatePost)
router.delete("/delete/:id", deletePost)

module.exports = router

