import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../store/authStore";
import toast from "react-hot-toast";

function AuthorArticles() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const { authorId } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [articles, setArticles] = useState([]);
  const [author, setAuthor] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchAuthorArticles = useCallback(async () => {
    setLoading(true);

    try {
      const res = await axios.get(`${BASE_URL}/user-api/articles`, {
        withCredentials: true,
      });
      const allArticles = res.data.payload;
      const filtered = allArticles.filter((article) => article.author?._id === authorId);
      setArticles(filtered);
      setAuthor(filtered[0]?.author || null);
    } catch (err) {
      console.error("Failed to fetch author articles", err);
      toast.error("Unable to load author articles");
    } finally {
      setLoading(false);
    }
  }, [BASE_URL, authorId]);

  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAuthorArticles();
  }, [isAuthenticated, fetchAuthorArticles]);

  if (!currentUser) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <button
        onClick={() => navigate(-1)}
        className="mb-6 bg-gray-200 px-4 py-2 rounded"
      >
        Back
      </button>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold mb-2">
          Articles by {author ? `${author.firstName} ${author.lastName}` : "Author"}
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          {articles.length} active article{articles.length === 1 ? "" : "s"}
        </p>

        {loading ? (
          <p>Loading articles...</p>
        ) : articles.length === 0 ? (
          <p className="text-gray-600">No active articles available for this author.</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article) => (
              <div
                key={article._id}
                className="border p-4 rounded-lg shadow-sm bg-gray-50"
              >
                <h2 className="text-xl font-semibold mb-2">{article.title}</h2>
                <p className="text-sm text-gray-500 mb-3">{article.category}</p>
                <p className="text-gray-700 mb-4 line-clamp-3">{article.content}</p>
                <button
                  onClick={() => navigate(`/articles/${article._id}`)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Read article
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthorArticles;
