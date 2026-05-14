import React, { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../store/authStore";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

function AuthorDashboard() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const {
    currentUser,
    logout,
    isAuthenticated,
    loading,
  } = useAuth();

  const navigate = useNavigate();

  const [articles, setArticles] = useState([]);

  const [form, setForm] = useState({
    title: "",
    category: "",
    content: "",
    customCategory: "",
  });

  const [saving, setSaving] = useState(false);

  const [editingArticle, setEditingArticle] =
    useState(null);

  const [editData, setEditData] = useState({
    title: "",
    category: "",
    content: "",
    customCategory: "",
  });

  const [showCreateForm, setShowCreateForm] =
    useState(false);

  const fetchArticles = useCallback(async () => {
    if (!currentUser) return;

    try {
      const res = await axios.get(
        `${BASE_URL}/author-api/articles/${currentUser._id}`,
        {
          withCredentials: true,
        }
      );

      setArticles(res.data.payload);
    } catch (err) {
      console.error(err);

      toast.error(
        "Unable to load your articles"
      );
    }
  }, [currentUser, BASE_URL]);

  // Authentication
  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (currentUser) {
      fetchArticles();
    }
  }, [isAuthenticated, navigate, currentUser, fetchArticles]);

  // Create Article
  const createArticle = async (event) => {
    event.preventDefault();

    const category =
      form.category === "Other"
        ? form.customCategory.trim()
        : form.category;

    if (
      !form.title ||
      !category ||
      !form.content
    ) {
      toast.error(
        "Please fill all article fields"
      );

      return;
    }

    setSaving(true);

    try {
      const res = await axios.post(
        `${BASE_URL}/author-api/articles`,
        {
          author: currentUser._id,
          title: form.title,
          category,
          content: form.content,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Article created");

      setForm({
        title: "",
        category: "",
        content: "",
        customCategory: "",
      });

      setShowCreateForm(false);

      setArticles((prev) => [
        res.data.payload,
        ...prev,
      ]);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not create article"
      );
    } finally {
      setSaving(false);
    }
  };

  // Activate / Deactivate
  const toggleArticle = async (
    articleId,
    currentState
  ) => {
    try {
      const nextState = !currentState;

      await axios.patch(
        `${BASE_URL}/author-api/articles/${articleId}/status`,
        {
          isArticleActive: nextState,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        `Article ${
          nextState
            ? "activated"
            : "deactivated"
        }`
      );

      setArticles((prev) =>
        prev.map((art) =>
          art._id === articleId
            ? {
                ...art,
                isArticleActive: nextState,
              }
            : art
        )
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to update status"
      );
    }
  };

  // Edit Start
  const startEdit = (article) => {
    setEditingArticle(article._id);

    setEditData({
      title: article.title,
      category: article.category,
      content: article.content,
    });
  };

  // Cancel Edit
  const cancelEdit = () => {
    setEditingArticle(null);

    setEditData({
      title: "",
      category: "",
      content: "",
      customCategory: "",
    });
  };

  // Save Edit
  const editArticle = async (
    articleId,
    updatedData
  ) => {
    const category =
      updatedData.category === "Other"
        ? updatedData.customCategory.trim()
        : updatedData.category;

    if (
      !updatedData.title ||
      !category ||
      !updatedData.content
    ) {
      toast.error(
        "Please fill all fields"
      );

      return;
    }

    try {
      const res = await axios.put(
        `${BASE_URL}/author-api/articles`,
        {
          articleId,
          title: updatedData.title,
          category,
          content: updatedData.content,
          author: currentUser._id,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Article updated");

      setArticles((prev) =>
        prev.map((art) =>
          art._id === articleId
            ? res.data.payload
            : art
        )
      );

      cancelEdit();
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not update article"
      );
    }
  };

  // Restore
  const restoreArticle = async (
    articleId
  ) => {
    try {
      const res = await axios.patch(
        `${BASE_URL}/author-api/articles/${articleId}/restore`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success("Article restored");

      setArticles((prev) =>
        prev.map((art) =>
          art._id === articleId
            ? res.data.article
            : art
        )
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to restore article"
      );
    }
  };

  // Soft Delete
  const softDeleteArticle = async (
    articleId
  ) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this article?"
      )
    )
      return;

    try {
      await axios.patch(
        `${BASE_URL}/author-api/articles/${articleId}/delete`,
        {},
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Article soft deleted"
      );

      setArticles((prev) =>
        prev.filter(
          (art) => art._id !== articleId
        )
      );
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Unable to delete article"
      );
    }
  };

  // Loading
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#1a120b] flex justify-center items-center text-[#f5deb3] text-3xl font-bold">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3] px-6 py-10">
      
      {/* HEADER */}
      <div className="max-w-7xl mx-auto mb-10">
        
        <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-8 shadow-2xl flex flex-col md:flex-row justify-between gap-8">
          
          {/* Profile */}
          <div className="flex items-center gap-5">
            
            {currentUser.profileImageUrl && (
              <img
                src={
                  currentUser.profileImageUrl
                }
                alt="profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-[#ddb892]"
              />
            )}

            <div>
              <h1 className="text-4xl font-extrabold text-[#ddb892]">
                {currentUser.firstName}{" "}
                {currentUser.lastName}
              </h1>

              <p className="text-[#cbb89d] mt-2">
                {currentUser.email}
              </p>

              <p className="mt-3 inline-block bg-[#ddb892] text-black px-4 py-1 rounded-full text-sm font-semibold uppercase">
                Author Dashboard
              </p>
            </div>
          </div>

          {/* Logout */}
          <button
            onClick={async () => {
              await logout();

              navigate("/login");
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded-full font-semibold transition duration-300 h-fit"
            disabled={loading}
          >
            {loading
              ? "Logging out..."
              : "Logout"}
          </button>
        </div>
      </div>

      {/* CREATE ARTICLE */}
      <div className="max-w-7xl mx-auto mb-10">
        
        {showCreateForm ? (
          <form
            onSubmit={createArticle}
            className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-8 shadow-2xl"
          >
            
            <div className="flex justify-between items-center mb-8">
              
              <h2 className="text-3xl font-bold text-[#ddb892]">
                Create New Article
              </h2>

              <button
                type="button"
                onClick={() =>
                  setShowCreateForm(false)
                }
                className="text-[#cbb89d] hover:text-white"
              >
                Cancel
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              
              <input
                value={form.title}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    title: e.target.value,
                  }))
                }
                placeholder="Article title"
                className="bg-[#1f140f] border border-[#4a3728] rounded-2xl p-4 outline-none focus:border-[#ddb892]"
              />

              <select
                value={form.category}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    category: e.target.value,
                    customCategory: "",
                  }))
                }
                className="bg-[#1f140f] border border-[#4a3728] rounded-2xl p-4 outline-none focus:border-[#ddb892]"
              >
                <option value="">
                  Select Category
                </option>

                <option value="Tech">
                  Tech
                </option>

                <option value="Education">
                  Education
                </option>

                <option value="History">
                  History
                </option>

                <option value="Environment">
                  Environment
                </option>

                <option value="Social">
                  Social
                </option>

                <option value="Other">
                  Other
                </option>
              </select>
            </div>

            {form.category === "Other" && (
              <input
                value={form.customCategory}
                onChange={(e) =>
                  setForm((s) => ({
                    ...s,
                    customCategory:
                      e.target.value,
                  }))
                }
                placeholder="Custom category"
                className="w-full mt-5 bg-[#1f140f] border border-[#4a3728] rounded-2xl p-4 outline-none focus:border-[#ddb892]"
              />
            )}

            <textarea
              value={form.content}
              onChange={(e) =>
                setForm((s) => ({
                  ...s,
                  content: e.target.value,
                }))
              }
              placeholder="Write your article..."
              className="w-full h-52 mt-5 bg-[#1f140f] border border-[#4a3728] rounded-2xl p-5 outline-none resize-none focus:border-[#ddb892]"
            />

            <button
              type="submit"
              disabled={saving}
              className="mt-6 bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-3 rounded-full font-semibold transition duration-300"
            >
              {saving
                ? "Publishing..."
                : "Publish Article"}
            </button>
          </form>
        ) : (
          <button
            onClick={() =>
              setShowCreateForm(true)
            }
            className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-8 py-4 rounded-full font-bold text-lg transition duration-300"
          >
            + Write New Article
          </button>
        )}
      </div>

      {/* ARTICLES */}
      <div className="max-w-7xl mx-auto">
        
        <h2 className="text-4xl font-extrabold text-[#ddb892] mb-8">
          Your Articles
        </h2>

        {articles.length === 0 ? (
          <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-16 text-center text-[#cbb89d]">
            No articles published yet.
          </div>
        ) : (
          <div className="grid gap-8">
            
            {articles.map((article) => (
              <div
                key={article._id}
                className="bg-[#2d1e16] border border-[#4a3728] rounded-[30px] p-8 shadow-2xl"
              >
                
                {/* Article Header */}
                <div className="flex flex-col md:flex-row justify-between gap-5">
                  
                  <div>
                    <h3 className="text-3xl font-bold text-[#ddb892]">
                      {article.title}
                    </h3>

                    <p className="text-[#cbb89d] mt-2">
                      {article.category} •{" "}
                      {new Date(
                        article.createdAt
                      ).toLocaleDateString()}
                    </p>

                    <div className="flex gap-5 mt-4 text-sm text-[#e6ccb2]">
                      
                      <span>
                        ❤️{" "}
                        {article.likes
                          ?.length || 0}
                      </span>

                      <span>
                        ⭐{" "}
                        {article.averageRating
                          ? article.averageRating.toFixed(
                              1
                            )
                          : "0"}{" "}
                        (
                        {article.ratingCount ||
                          0}
                        )
                      </span>
                    </div>
                  </div>

                  <span
                    className={`h-fit px-4 py-2 rounded-full text-sm font-semibold ${
                      article.isDeleted
                        ? "bg-gray-600 text-white"
                        : article.isArticleActive
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {article.isDeleted
                      ? "Deleted"
                      : article.isArticleActive
                      ? "Active"
                      : "Inactive"}
                  </span>
                </div>

                {/* Content */}
                <p className="mt-6 text-[#e6ccb2] leading-relaxed line-clamp-3">
                  {article.content}
                </p>

                {/* EDIT MODE */}
                {editingArticle ===
                article._id ? (
                  <div className="mt-8 space-y-5">
                    
                    <input
                      value={editData.title}
                      onChange={(e) =>
                        setEditData(
                          (prev) => ({
                            ...prev,
                            title:
                              e.target.value,
                          })
                        )
                      }
                      placeholder="Title"
                      className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl p-4 outline-none"
                    />

                    <textarea
                      value={editData.content}
                      onChange={(e) =>
                        setEditData(
                          (prev) => ({
                            ...prev,
                            content:
                              e.target.value,
                          })
                        )
                      }
                      className="w-full h-40 bg-[#1f140f] border border-[#4a3728] rounded-2xl p-4 outline-none resize-none"
                    />

                    <div className="flex gap-4">
                      
                      <button
                        onClick={() =>
                          editArticle(
                            article._id,
                            editData
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 px-6 py-3 rounded-full font-semibold"
                      >
                        Save
                      </button>

                      <button
                        onClick={cancelEdit}
                        className="bg-gray-600 hover:bg-gray-700 px-6 py-3 rounded-full font-semibold"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4 mt-8">
                    
                    <button
                      onClick={() =>
                        navigate(
                          `/articles/${article._id}`
                        )
                      }
                      className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-6 py-3 rounded-full font-semibold transition duration-300"
                    >
                      Read
                    </button>

                    {!article.isDeleted && (
                      <>
                        <button
                          onClick={() =>
                            startEdit(
                              article
                            )
                          }
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() =>
                            toggleArticle(
                              article._id,
                              article.isArticleActive
                            )
                          }
                          className={`px-6 py-3 rounded-full font-semibold transition duration-300 ${
                            article.isArticleActive
                              ? "bg-red-600 hover:bg-red-700 text-white"
                              : "bg-green-600 hover:bg-green-700 text-white"
                          }`}
                        >
                          {article.isArticleActive
                            ? "Deactivate"
                            : "Activate"}
                        </button>

                        <button
                          onClick={() =>
                            softDeleteArticle(
                              article._id
                            )
                          }
                          className="bg-gray-700 hover:bg-gray-800 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
                        >
                          Delete
                        </button>
                      </>
                    )}

                    {article.isDeleted && (
                      <button
                        onClick={() =>
                          restoreArticle(
                            article._id
                          )
                        }
                        className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-full font-semibold transition duration-300"
                      >
                        Restore
                      </button>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorDashboard;