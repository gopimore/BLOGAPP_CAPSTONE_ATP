import exp from "express";
import multer from "multer";
import { register } from "../services/authService.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { checkAuthor } from "../middlewares/checkAuthor.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

const upload = multer({ storage: multer.memoryStorage() });

export const authorRoute = exp.Router();

//Register author(public)
authorRoute.post("/users", upload.single("profileUrl"), async (req, res, next) => {
  let cloudinaryResult;

  try {
    let userObj = req.body;

    //  Step 1: upload image to cloudinary from memoryStorage (if exists)
    if (req.file) {
      cloudinaryResult = await uploadToCloudinary(req.file.buffer);
    }

    // Step 2: call existing register()
    const newUserObj = await register({
      ...userObj,
      role: "AUTHOR",
      profileImageUrl: cloudinaryResult?.secure_url,
    });

    res.status(201).json({
      message: "author created",
      payload: newUserObj,
    });

  } catch (err) {

    // Step 3: rollback
    if (cloudinaryResult?.public_id) {
      await cloudinary.uploader.destroy(cloudinaryResult.public_id);
    }

    next(err); // send to your error middleware
  }
});

//Create article(protected route)
authorRoute.post("/articles", verifyToken("AUTHOR"), async (req, res) => {
  //get article from req
  let article = req.body;

  //create article document
  let newArticleDoc = new ArticleModel(article);
  //save
  let createdArticleDoc = await newArticleDoc.save();
  //send res
  res.status(201).json({ message: "article created", payload: createdArticleDoc });
});

//Read all articles of author (protected route)
authorRoute.get("/articles/:authorId", verifyToken("AUTHOR"), async (req, res) => {
  //get author id
  let aid = req.params.authorId;

  //read articles by this author (include soft deleted so author can restore or manage them)
  let articles = await ArticleModel.find({ author: aid }).populate("author", "firstName email");
  //send res
  res.status(200).json({ message: "articles", payload: articles });
});

//edit article(protected route)
authorRoute.put("/articles", verifyToken("AUTHOR"), async (req, res) => {
  //get modified article from req
  let { articleId, title, category, content } = req.body;

  //find article owned by this author and not soft deleted
  let articleOfDB = await ArticleModel.findOne({ _id: articleId, author: req.user.userId, isDeleted: false });
  if (!articleOfDB) {
    return res.status(404).json({ message: "Article not found or already deleted" });
  }

  //update the article
  let updatedArticle = await ArticleModel.findByIdAndUpdate(
    articleId,
    {
      $set: { title, category, content },
    },
    { new: true },
  );
  //send res(updated article)
  res.status(200).json({ message: "article updated", payload: updatedArticle });
});

//toggle active/inactive status of an article
// NOTE: this route does not delete the document, it only changes active state
authorRoute.patch("/articles/:id/status", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const { isArticleActive } = req.body;
  // Find article that is not soft deleted
  const article = await ArticleModel.findOne({ _id: id, isDeleted: false });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Forbidden. You can only modify your own articles" });
  }
  // Already in requested state
  if (article.isArticleActive === isArticleActive) {
    return res.status(400).json({
      message: `Article is already ${isArticleActive ? "active" : "inactive"}`,
    });
  }

  //update status
  article.isArticleActive = isArticleActive;
  await article.save();

  //send res
  res.status(200).json({
    message: `Article ${isArticleActive ? "activated" : "deactivated"} successfully`,
    article,
  });
});

//soft delete article(Protected route)
authorRoute.patch("/articles/:id/delete", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  // Find article
  const article = await ArticleModel.findById(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // AUTHOR can only modify their own articles
  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
    .status(403)
    .json({ message: "Forbidden. You can only modify your own articles" });
  }

  if (article.isDeleted) {
    return res.status(400).json({ message: "Article is already deleted" });
  }

  // Soft delete
  article.isDeleted = true;
  await article.save();

  //send res
  res.status(200).json({
    message: "Article soft deleted successfully",
    article,
  });
});

authorRoute.patch("/articles/:id/restore", verifyToken("AUTHOR"), async (req, res) => {
  const { id } = req.params;
  const article = await ArticleModel.findById(id);
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  if (req.user.role === "AUTHOR" && 
    article.author.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: "Forbidden. You can only restore your own articles" });
  }

  if (!article.isDeleted) {
    return res.status(400).json({ message: "Article is not deleted" });
  }

  article.isDeleted = false;
  await article.save();

  res.status(200).json({
    message: "Article restored successfully",
    article,
  });
});