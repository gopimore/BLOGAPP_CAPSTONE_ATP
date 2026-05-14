import exp from "express";
import multer from "multer";
import { register, authenticate } from "../services/authService.js";
import { ArticleModel } from "../Models/ArticleModel.js";
import { verifyToken } from "../middlewares/verifyToken.js";
import cloudinary from "../config/cloudinary.js";
import { uploadToCloudinary } from "../config/cloudinaryUpload.js";

const upload = multer({ storage: multer.memoryStorage() });

export const userRoute = exp.Router();

//Register user
userRoute.post(
        "/users",
        upload.single("profileUrl"),
        async (req, res, next) => {
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
                role: "USER",
                profileImageUrl: cloudinaryResult?.secure_url,
                });

                res.status(201).json({
                message: "user created",
                payload: newUserObj,
                });

            } catch (err) {

                // Step 3: rollback 
                if (cloudinaryResult?.public_id) {
                await cloudinary.uploader.destroy(cloudinaryResult.public_id);
                }

                next(err); // send to your error middleware
            }

        }
        );


//Read all articles(protected route)
userRoute.get("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  //read active articles of all authors and include docs where isDeleted is missing
  const articles = await ArticleModel.find({
    isArticleActive: true,
    isDeleted: { $ne: true },
  })
    .populate("author", "firstName lastName email")
    .populate("comments.user", "firstName lastName");
  res.status(200).json({ message: "all articles", payload: articles });
});

// Read single article by ID (protected route)
userRoute.get("/articles/:id", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  let article = await ArticleModel.findOne({ _id: req.params.id, isDeleted: { $ne: true } })
    .populate("author", "firstName lastName email")
    .populate("comments.user", "firstName lastName");

  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  // Users can view only active articles; authors/admin can view own inactive as well
  if (!article.isArticleActive) {
    const authorId = article.author?._id?.toString() || article.author?.toString();
    if (req.user.role === "AUTHOR" && authorId === req.user.userId) {
      // allow own inactive article
    } else if (req.user.role === "ADMIN") {
      // allow admin to view any
    } else {
      return res.status(403).json({ message: "Article is not active" });
    }
  }

  res.status(200).json({ message: "article fetched", payload: article });
});

//Add comment to an article(protected route)
userRoute.put("/articles", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  //get comment obj from req
  const { user, articleId, comment } = req.body;

  if (user !== req.user.userId) {
    return res.status(403).json({ message: "Forbidden" });
  }

  //find article by id and update if active
  let articleWithComment = await ArticleModel.findOneAndUpdate(
    { _id: articleId, isArticleActive: true, isDeleted: { $ne: true } },
    { $push: { comments: { user, comment } } },
    { new: true, runValidators: true }
  );

  //if article not found
  if (!articleWithComment) {
    return res.status(404).json({ message: "Article not found" });
  }
  //send res
  res.status(200).json({ message: "comment added successfully", payload: articleWithComment });
});

// Like or unlike an article
userRoute.patch("/articles/:id/like", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user.userId;

  const article = await ArticleModel.findOne({ _id: articleId, isDeleted: { $ne: true } });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  const likedIndex = article.likes.findIndex((id) => id.toString() === userId);
  if (likedIndex >= 0) {
    article.likes.splice(likedIndex, 1);
  } else {
    article.likes.push(userId);
  }

  await article.save();
  res.status(200).json({ message: "Article like updated", article });
});

// Rate an article
userRoute.patch("/articles/:id/rate", verifyToken("USER", "AUTHOR", "ADMIN"), async (req, res) => {
  const articleId = req.params.id;
  const userId = req.user.userId;
  const { value } = req.body;

  if (!value || value < 1 || value > 5) {
    return res.status(400).json({ message: "Rating value must be between 1 and 5" });
  }

  const article = await ArticleModel.findOne({ _id: articleId, isDeleted: { $ne: true } });
  if (!article) {
    return res.status(404).json({ message: "Article not found" });
  }

  const existingRating = article.ratings.find((r) => r.user.toString() === userId);
  if (existingRating) {
    existingRating.value = value;
  } else {
    article.ratings.push({ user: userId, value });
  }

  const total = article.ratings.reduce((sum, r) => sum + r.value, 0);
  article.ratingCount = article.ratings.length;
  article.averageRating = Number((total / article.ratingCount).toFixed(1));

  await article.save();
  res.status(200).json({ message: "Article rating updated", article });
});

// next() --> forward th the next middleware in the chain
//next(err) --> forward the error to the error handling middleware in the chain 