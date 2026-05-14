import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import axios from "axios";
import toast from "react-hot-toast";

function ArticleRead() {
  const { id } = useParams();

  const navigate = useNavigate();

  const { currentUser } = useAuth();

  const [article, setArticle] = useState(null);

  const [loading, setLoading] = useState(true);

  const [commentText, setCommentText] = useState("");

  const [userRating, setUserRating] = useState(0);

  const [isLiked, setIsLiked] = useState(false);

  const [interactionLoading, setInteractionLoading] =
    useState(false);

  // Fetch Article
  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const res = await axios.get(
          `http://localhost:4000/user-api/articles/${id}`,
          {
            withCredentials: true,
          }
        );

        setArticle(res.data.payload);
      } catch (err) {
        console.error(err);

        toast.error(
          err.response?.data?.message ||
            "Article not found"
        );

        navigate("/userdashboard", {
          replace: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchArticle();
  }, [id, navigate]);

  // Like & Rating State
  useEffect(() => {
    if (!article || !currentUser) return;

    setIsLiked(
      article.likes?.some(
        (id) => id.toString() === currentUser._id
      )
    );

    const rating = article.ratings?.find(
      (r) => r.user?.toString() === currentUser._id
    );

    setUserRating(rating?.value || 0);
  }, [article, currentUser]);

  // Like
  const toggleLike = async () => {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    setInteractionLoading(true);

    try {
      const res = await axios.patch(
        `http://localhost:4000/user-api/articles/${id}/like`,
        {},
        {
          withCredentials: true,
        }
      );

      setArticle(res.data.article);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not update like"
      );
    } finally {
      setInteractionLoading(false);
    }
  };

  // Rating
  const submitRating = async (value) => {
    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    setInteractionLoading(true);

    try {
      const res = await axios.patch(
        `http://localhost:4000/user-api/articles/${id}/rate`,
        { value },
        {
          withCredentials: true,
        }
      );

      setArticle(res.data.article);

      toast.success("Rating submitted");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not submit rating"
      );
    } finally {
      setInteractionLoading(false);
    }
  };

  // Add Comment
  const submitComment = async () => {
    if (!commentText.trim()) {
      toast.error("Please write a comment");
      return;
    }

    if (!currentUser) {
      toast.error("Please login first");
      return;
    }

    try {
      const res = await axios.put(
        "http://localhost:4000/user-api/articles",
        {
          user: currentUser._id,
          articleId: id,
          comment: commentText.trim(),
        },
        {
          withCredentials: true,
        }
      );

      setArticle(res.data.payload);

      setCommentText("");

      toast.success("Comment added");
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not add comment"
      );
    }
  };

  // Loading
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-[#f5deb3] text-3xl font-bold">
        Loading article...
      </div>
    );
  }

  // No Article
  if (!article) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-[#f5deb3] text-2xl">
        Article not available
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3]">
      
      {/* Hero Section */}
      <div className="relative h-500px overflow-hidden">
        
        <img
          src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop"
          alt="article"
          className="w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-black/60"></div>

        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 bg-[#ddb892] hover:bg-[#c89b5b] text-black px-6 py-3 rounded-full font-semibold transition duration-300 z-10"
        >
          ← Back
        </button>

        {/* Content */}
        <div className="absolute bottom-14 left-10 max-w-4xl z-10">
          
          <span className="bg-[#ddb892] text-black px-5 py-2 rounded-full uppercase text-sm font-semibold">
            {article.category}
          </span>

          <h1 className="text-5xl md:text-7xl font-extrabold mt-6 leading-tight">
            {article.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 mt-6 text-[#f5deb3]/90">
            
            <p>
              ✍️ {article.author?.firstName}{" "}
              {article.author?.lastName}
            </p>

            <span>•</span>

            <p>
              {article.averageRating
                ? article.averageRating.toFixed(1)
                : "0"}{" "}
              Rating
            </p>

            <span>•</span>

            <p>
              {article.likes?.length || 0} Likes
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-5xl mx-auto px-6 py-14">
        
        {/* Article Card */}
        <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-10 shadow-2xl">
          
          {/* Content */}
          <div className="text-lg leading-[2.3rem] text-[#e6ccb2] whitespace-pre-line">
            {article.content}
          </div>

          {/* Interaction Section */}
          <div className="mt-12 pt-8 border-t border-[#4a3728]">
            
            {/* Likes & Rating */}
            <div className="flex flex-col md:flex-row justify-between gap-8">
              
              {/* Like */}
              <div>
                <h3 className="text-xl font-bold text-[#ddb892] mb-4">
                  Appreciate this article
                </h3>

                <button
                  onClick={toggleLike}
                  disabled={interactionLoading}
                  className={`px-8 py-3 rounded-full font-semibold transition duration-300 ${
                    isLiked
                      ? "bg-red-600 hover:bg-red-700 text-white"
                      : "bg-[#ddb892] hover:bg-[#c89b5b] text-black"
                  }`}
                >
                  {isLiked ? "♥ Liked" : "♡ Like"}
                </button>
              </div>

              {/* Rating */}
              <div>
                <h3 className="text-xl font-bold text-[#ddb892] mb-4">
                  Rate this article
                </h3>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() =>
                        submitRating(value)
                      }
                      disabled={interactionLoading}
                      className={`text-4xl transition duration-200 ${
                        value <= userRating
                          ? "text-yellow-400"
                          : "text-gray-500"
                      } hover:scale-110`}
                    >
                      ★
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Comment Section */}
        <div className="mt-14">
          
          <h2 className="text-4xl font-bold text-[#ddb892] mb-8">
            Reader Discussions
          </h2>

          {/* Add Comment */}
          <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-8 shadow-xl mb-10">
            
            <h3 className="text-2xl font-semibold mb-5">
              Add Your Comment
            </h3>

            <textarea
              value={commentText}
              onChange={(e) =>
                setCommentText(e.target.value)
              }
              rows={5}
              placeholder="Write your thoughts here..."
              className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl p-5 text-[#f5deb3] outline-none resize-none focus:border-[#ddb892]"
            />

            <button
              onClick={submitComment}
              className="mt-5 bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-3 rounded-full font-semibold transition duration-300"
            >
              Submit Comment
            </button>
          </div>

          {/* Comments */}
          {!article.comments ||
          article.comments.length === 0 ? (
            <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-10 text-center text-[#cbb89d]">
              No comments yet. Start the discussion.
            </div>
          ) : (
            <div className="space-y-6">
              
              {article.comments.map((c) => (
                <div
                  key={
                    c._id ||
                    `${c.user}-${c.comment}`
                  }
                  className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-6 shadow-lg"
                >
                  
                  <div className="flex items-center gap-4 mb-4">
                    
                    <div className="w-14 h-14 rounded-full bg-[#ddb892] text-black flex items-center justify-center font-bold text-xl">
                      {c.user?.firstName
                        ? c.user.firstName
                            .charAt(0)
                            .toUpperCase()
                        : "U"}
                    </div>

                    <div>
                      <p className="font-bold text-[#ddb892] text-lg">
                        {c.user?.firstName
                          ? `${c.user.firstName} ${c.user.lastName}`
                          : c.user}
                      </p>

                      <p className="text-[#cbb89d] text-sm">
                        Reader
                      </p>
                    </div>
                  </div>

                  <p className="text-[#e6ccb2] leading-relaxed text-lg">
                    {c.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ArticleRead;