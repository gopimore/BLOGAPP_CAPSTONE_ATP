import { Schema, model } from "mongoose";

//Create user comment schema
const userCommentSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "user",
  },
  comment: {
    type: String,
  },
});

//create article schema
const articleSchema = new Schema(
  {
    author: {
      type: Schema.Types.ObjectId,
      ref: "user",
      required: [true, "Author ID required"],
    },
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    category: {
      type: String,
      required: [true, "Category is required"],
    },
    content: {
      type: String,
      required: [true, "Content is required"],
    },
    comments: [userCommentSchema],
    likes: [
      {
        type: Schema.Types.ObjectId,
        ref: "user",
      },
    ],
    ratings: [
      {
        user: {
          type: Schema.Types.ObjectId,
          ref: "user",
        },
        value: {
          type: Number,
          min: 1,
          max: 5,
        },
      },
    ],
    averageRating: {
      type: Number,
      default: 0,
    },
    ratingCount: {
      type: Number,
      default: 0,
    },
    isArticleActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: "throw",
    versionKey: false,
  },
);

//Create article model
export const ArticleModel = model("article", articleSchema);