const Post = require("../models/post.model");
const User = require("../models/user.model");

// Create a new post
async function createPost(req, res) {
  const { title, description, imgURL, tags } = req.body;

  if (!title || !description || !imgURL) {
    return res
      .status(400)
      .json({ message: "Title, description, and image URL are required" });
  }

  try {
    const newPost = new Post({
      title,
      description,
      imgURL,
      tags: tags || [],
      OP: req.user.id,
      comments: [],
    });

    const savedPost = await newPost.save();

    const populatedPost = await Post.findById(savedPost._id).populate({
      path: "OP",
      select: "username name email",
    });

    res.status(201).json({
      message: "Post created successfully",
      post: populatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error creating post",
      error: error.message,
    });
  }
}

// Get all posts with pagination
async function getAllPosts(req, res) {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "OP",
        select: "username name email",
      })
      .populate({
        path: "comments.commenter",
        select: "username name",
      });

    const total = await Post.countDocuments();

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts",
      error: error.message,
    });
  }
}

// Get a single post by ID
async function getPostById(req, res) {
  try {
    const post = await Post.findById(req.params.id)
      .populate({
        path: "OP",
        select: "username name email",
      })
      .populate({
        path: "comments.commenter",
        select: "username name",
      });

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({
      message: "Error fetching post",
      error: error.message,
    });
  }
}

// Update a post
// Update a post
async function updatePost(req, res) {
  const { title, description, imgURL, tags } = req.body;

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.OP.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this post" });
    }

    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;
    if (imgURL !== undefined) updateData.imgURL = imgURL;
    if (tags !== undefined) updateData.tags = tags;

    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true }
    ).populate({
      path: "OP",
      select: "username name email",
    });

    res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating post",
      error: error.message,
    });
  }
}

// Delete a post
async function deletePost(req, res) {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.OP.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this post" });
    }

    await Post.findByIdAndDelete(req.params.id);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error deleting post",
      error: error.message,
    });
  }
}

// Add a comment to a post
async function addComment(req, res) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ message: "Comment text is required" });
  }

  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    post.comments.push({
      text,
      commenter: req.user.id,
    });

    await post.save();

    const updatedPost = await Post.findById(req.params.id)
      .populate({
        path: "OP",
        select: "username name email",
      })
      .populate({
        path: "comments.commenter",
        select: "username name",
      });

    res.status(201).json({
      message: "Comment added successfully",
      post: updatedPost,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error adding comment",
      error: error.message,
    });
  }
}

// Get posts by tag
async function getPostsByTag(req, res) {
  try {
    const tag = req.params.tag;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ tags: tag })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "OP",
        select: "username name email",
      })
      .populate({
        path: "comments.commenter",
        select: "username name",
      });

    const total = await Post.countDocuments({ tags: tag });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching posts by tag",
      error: error.message,
    });
  }
}

// Get posts by user
async function getPostsByUser(req, res) {
  try {
    const userId = req.params.userId;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const posts = await Post.find({ OP: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate({
        path: "OP",
        select: "username name email",
      })
      .populate({
        path: "comments.commenter",
        select: "username name",
      });

    const total = await Post.countDocuments({ OP: userId });

    res.status(200).json({
      posts,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalPosts: total,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error fetching user posts",
      error: error.message,
    });
  }
}

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  addComment,
  getPostsByTag,
  getPostsByUser,
};
