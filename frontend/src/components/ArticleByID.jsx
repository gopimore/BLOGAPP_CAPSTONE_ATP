import { useParams, useLocation, useNavigate } from "react-router";
import { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore.js";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

function ArticleByID() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { id } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const user = useAuth((state) => state.currentUser);

  const [article, setArticle] = useState(
    location.state || null
  );

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState(null);

  const { register, handleSubmit, reset } = useForm();

  // Fetch Article
  useEffect(() => {
    if (article) return;

    const getArticle = async () => {
      setLoading(true);

      try {
        const res = await axios.get(
          `${BASE_URL}/user-api/article/${id}`,
          {
            withCredentials: true,
          }
        );

        setArticle(res.data.payload);
      } catch (err) {
        setError(err.response?.data?.error);
      } finally {
        setLoading(false);
      }
    };

    getArticle();
  }, [id, article, BASE_URL]);

  // Format Date
  const formatDate = (date) => {
    return new Date(date).toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      dateStyle: "medium",
      timeStyle: "short",
    });
  };

  // Delete Article
  const deleteArticle = async () => {
    try {
      await axios.delete(
        `${BASE_URL}/author-api/article/${id}`,
        {
          withCredentials: true,
        }
      );

      toast.success("Article deleted");

      navigate("/author-profile");
    } catch (err) {
      setError(err.response?.data?.error);
    }
  };

  // Edit Article
  const editArticle = (articleObj) => {
    navigate("/edit-article", {
      state: articleObj,
    });
  };

  // Add Comment
  const addComment = async (commentObj) => {
    try {
      const res = await axios.post(
        `${BASE_URL}/user-api/comment/${id}`,
        commentObj,
        {
          withCredentials: true,
        }
      );

      setArticle(res.data.payload);

      toast.success("Comment added");

      reset();
    } catch (err) {
      console.log(err);

      toast.error("Failed to add comment");
    }
  };

  // Loading UI
  if (loading) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-[#f5deb3] text-3xl font-bold">
        Loading article...
      </div>
    );
  }

  // Error UI
  if (error) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-red-400 text-2xl">
        {error}
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3] py-12 px-6">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Hero Image */}
        <div className="relative rounded-[30px] overflow-hidden mb-10 shadow-2xl">
          
          <img
            src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop"
            alt="article"
            className="w-full h-400px object-cover"
          />

          <div className="absolute inset-0 bg-black/50"></div>

          <div className="absolute bottom-10 left-10">
            
            <span className="bg-[#ddb892] text-black px-5 py-2 rounded-full text-sm font-semibold uppercase">
              {article.category}
            </span>

            <h1 className="text-5xl md:text-6xl font-extrabold mt-5 leading-tight">
              {article.title}
            </h1>

            <div className="flex items-center gap-4 mt-6 text-[#f5deb3]/90">
              
              <p className="font-semibold">
                ✍️ {article.author?.firstName || "Author"}
              </p>

              <span>•</span>

              <p>{formatDate(article.createdAt)}</p>
            </div>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-10 shadow-xl">
          
          {/* Article Content */}
          <div className="text-lg leading-[2.2rem] text-[#e6ccb2] whitespace-pre-line">
            {article.content}
          </div>

          {/* Footer */}
          <div className="mt-10 pt-6 border-t border-[#4a3728] text-[#cbb89d]">
            Last updated: {formatDate(article.updatedAt)}
          </div>

          {/* AUTHOR ACTIONS */}
          {user?.role === "AUTHOR" && (
            <div className="flex gap-5 mt-10">
              
              <button
                className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-3 rounded-full font-semibold transition duration-300"
                onClick={() => editArticle(article)}
              >
                Edit Article
              </button>

              <button
                className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition duration-300"
                onClick={deleteArticle}
              >
                Delete Article
              </button>
            </div>
          )}
        </div>

        {/* COMMENT SECTION */}
        <div className="mt-12">
          
          <h2 className="text-3xl font-bold text-[#ddb892] mb-6">
            Discussion
          </h2>

          {/* Add Comment */}
          {user?.role === "USER" && (
            <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-8 mb-8">
              
              <form
                onSubmit={handleSubmit(addComment)}
                className="space-y-5"
              >
                <textarea
                  rows="4"
                  placeholder="Share your thoughts..."
                  {...register("comment")}
                  className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl p-5 text-[#f5deb3] outline-none focus:border-[#ddb892] resize-none"
                />

                <button
                  type="submit"
                  className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-3 rounded-full font-semibold transition duration-300"
                >
                  Add Comment
                </button>
              </form>
            </div>
          )}

          {/* Comments List */}
          <div className="space-y-6">
            
            {article.comments?.length > 0 ? (
              article.comments.map((comment, index) => (
                <div
                  key={index}
                  className="bg-[#2d1e16] border border-[#4a3728] rounded-3xl p-6"
                >
                  
                  <div className="flex items-center gap-4 mb-4">
                    
                    <div className="w-12 h-12 rounded-full bg-[#ddb892] text-black flex items-center justify-center font-bold text-lg">
                      {comment.user?.email?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <p className="font-semibold text-[#ddb892]">
                        {comment.user?.email}
                      </p>

                      <p className="text-sm text-[#cbb89d]">
                        Reader Comment
                      </p>
                    </div>
                  </div>

                  <p className="text-[#e6ccb2] leading-relaxed">
                    {comment.comment}
                  </p>
                </div>
              ))
            ) : (
              <div className="bg-[#2d1e16] border border-[#4a3728] rounded-3xl p-10 text-center text-[#cbb89d]">
                No comments yet. Be the first to share your thoughts.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ArticleByID;