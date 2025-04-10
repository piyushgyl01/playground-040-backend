const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authenticateToken } = require("../middlewares/authenticateToken");

// All post routes require authentication
router.use(authenticateToken);

// Post CRUD operations
router.post("/", postController.createPost);
router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPostById);
router.put("/:id", postController.updatePost);
router.delete("/:id", postController.deletePost);

// Comment operation
router.post("/:id/comments", postController.addComment);

// Additional operations
router.get("/tags/:tag", postController.getPostsByTag);
router.get("/user/:userId", postController.getPostsByUser);

module.exports = router;
