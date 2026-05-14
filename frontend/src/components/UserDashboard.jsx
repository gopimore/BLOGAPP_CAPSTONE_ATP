import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function UserDashboard() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { currentUser, logout, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [articles, setArticles] = useState([]);
  const [authors, setAuthors] = useState([]);
  const [showAuthors, setShowAuthors] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loadingArticles, setLoadingArticles] = useState(false);

  const fetchArticles = useCallback(async () => {
    setLoadingArticles(true);
    try {
      const res = await axios.get(`${BASE_URL}/user-api/articles`, {
        withCredentials: true,
      });
      const articles = res.data.payload;
      setArticles(articles);

      const authorsById = articles.reduce((acc, article) => {
        const author = article.author;
        if (author?._id && !acc[author._id]) {
          acc[author._id] = author;
        }
        return acc;
      }, {});

      setAuthors(Object.values(authorsById));
    } catch (err) {
      console.error("Failed to fetch articles", err);
      toast.error("Unable to load articles");
    } finally {
      setLoadingArticles(false);
    }
  }, [BASE_URL]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    fetchArticles();
  }, [isAuthenticated, navigate, fetchArticles]);

  const addComment = async (articleId) => {
    if (!commentText.trim()) {
      toast.error("Please enter a comment");
      return;
    }
    const body = {
      user: currentUser._id,
      articleId,
      comment: commentText.trim(),
    };

    try {
      const res = await axios.put(`${BASE_URL}/user-api/articles`, body, {
        withCredentials: true,
      });
      setArticles((prev) =>
        prev.map((art) => (art._id === articleId ? res.data.payload : art))
      );
      setCommentText("");
      setSelectedArticle(null);
      toast.success("Comment added");
    } catch (err) {
      console.error("Add comment failed", err);
      toast.error(err.response?.data?.message || "Could not add comment");
    }
  };

  if (!currentUser) return <div>Loading...</div>;

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          {currentUser.profileImageUrl && (
            <img
              src={currentUser.profileImageUrl}
              alt="profile"
              className="w-16 h-16 rounded-full object-cover"
            />
          )}
          <div>
            <h2 className="text-2xl font-semibold">
              {currentUser.firstName} {currentUser.lastName}
            </h2>
            <p className="text-sm text-gray-600">{currentUser.email}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            await logout();
            navigate("/login");
          }}
          className="bg-red-500 text-white px-4 py-2 rounded-lg"
          disabled={loading}
        >
          {loading ? "Logging out..." : "Logout"}
        </button>
      </div>

      <div className="flex flex-col gap-4 mb-6 md:flex-row md:items-center md:justify-between">
        <h3 className="text-xl font-bold">Active Articles</h3>
        <button
          onClick={() => {
            setShowAuthors((prev) => !prev);
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
        >
          {showAuthors ? "Hide Authors" : "Browse Authors"}
        </button>
      </div>

      {showAuthors && (
        <div className="mb-6">
          <h4 className="text-lg font-semibold mb-3">Authors</h4>
          {authors.length === 0 ? (
            <p className="text-gray-600">No authors available.</p>
          ) : (
            <div className="grid gap-4 md:grid-cols-3">
              {authors.map((author) => (
                <button
                  key={author._id}
                  onClick={() => navigate(`/authors/${author._id}`)}
                  className="text-left border rounded-lg p-4 transition border-gray-200 bg-white hover:border-blue-500"
                >
                  <p className="text-lg font-semibold">
                    {author.firstName} {author.lastName}
                  </p>
                  <p className="text-sm text-gray-500">{author.email}</p>
                  <p className="mt-2 text-sm text-gray-600">
                    Click to view articles written by this author.
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      )}

      {loadingArticles ? (
        <p>Loading articles...</p>
      ) : articles.length === 0 ? (
        <p>No active articles available.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <div key={article._id} className="border p-4 rounded-lg shadow-lg bg-white hover:shadow-xl transition">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="text-lg font-semibold">{article.title}</h4>
                  <p className="text-sm text-gray-500">{article.category}</p>
                </div>
                <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">Active</span>
              </div>
              <p className="text-gray-700 mb-3 line-clamp-3">{article.content}</p>
              <p className="text-sm text-gray-500 mb-3">Author: {article.author?.firstName || "Unknown"}</p>

              <div className="flex items-center justify-between gap-2">
                <button
                  onClick={() => navigate(`/articles/${article._id}`)}
                  className="bg-blue-500 text-white px-3 py-2 rounded hover:bg-blue-600"
                >
                  Read
                </button>
                <button
                  onClick={() => {
                    setSelectedArticle(article._id);
                    setCommentText("");
                  }}
                  className="bg-gray-200 text-gray-700 px-3 py-2 rounded hover:bg-gray-300"
                >
                  Comment
                </button>
              </div>

              {selectedArticle === article._id && (
                <div className="mt-3">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    className="border p-2 rounded w-full"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                  />
                  <button
                    onClick={() => addComment(article._id)}
                    className="mt-2 bg-blue-500 text-white px-3 py-2 rounded w-full"
                  >
                    Post
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default UserDashboard;