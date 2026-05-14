import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router";
import { useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

function EditArticle() {
  const BASE_URL = import.meta.env.VITE_API_URL;
  const location = useLocation();

  const navigate = useNavigate();

  const article = location.state;

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Prefill Data
  useEffect(() => {
    if (!article) return;

    setValue("title", article.title);

    setValue("category", article.category);

    setValue("content", article.content);
  }, [article, setValue]);

  // Update Article
  const updateArticle = async (data) => {
    if (!article?._id) {
      toast.error("Unable to update article");

      navigate("/authordashboard");

      return;
    }

    try {
      await axios.put(
        `${BASE_URL}/author-api/articles`,
        {
          articleId: article._id,
          title: data.title,
          category: data.category,
          content: data.content,
        },
        {
          withCredentials: true,
        }
      );

      toast.success(
        "Article updated successfully"
      );

      navigate(`/articles/${article._id}`);
    } catch (err) {
      console.error(err);

      toast.error(
        err.response?.data?.message ||
          "Could not update article"
      );
    }
  };

  return (
    <div className="min-h-screen bg-[#1a120b] text-[#f5deb3] py-14 px-6">
      
      <div className="max-w-5xl mx-auto">
        
        {/* Header */}
        <div className="mb-10">
          
          <button
            onClick={() => navigate(-1)}
            className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-6 py-3 rounded-full font-semibold transition duration-300"
          >
            ← Back
          </button>
        </div>

        {/* Main Card */}
        <div className="bg-[#2d1e16] border border-[#4a3728] rounded-[35px] overflow-hidden shadow-2xl">
          
          {/* Hero */}
          <div className="relative h-280px">
            
            <img
              src="https://images.unsplash.com/photo-1455390582262-044cdead277a?q=80&w=1400&auto=format&fit=crop"
              alt="edit article"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/60"></div>

            <div className="absolute bottom-10 left-10">
              
              <p className="uppercase tracking-[5px] text-[#ddb892] font-semibold mb-3">
                Vintage Editor
              </p>

              <h1 className="text-5xl md:text-6xl font-extrabold text-white">
                Edit Article
              </h1>
            </div>
          </div>

          {/* Form */}
          <div className="p-10 md:p-14">
            
            <form
              onSubmit={handleSubmit(
                updateArticle
              )}
              className="space-y-8"
            >
              
              {/* Title */}
              <div>
                
                <label className="block text-[#ddb892] text-xl font-semibold mb-3">
                  Article Title
                </label>

                <input
                  type="text"
                  placeholder="Enter article title"
                  className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl px-6 py-5 text-[#f5deb3] text-lg outline-none focus:border-[#ddb892] transition duration-300"
                  {...register("title", {
                    required:
                      "Title required",
                  })}
                />

                {errors.title && (
                  <p className="text-red-400 mt-2">
                    {
                      errors.title
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Category */}
              <div>
                
                <label className="block text-[#ddb892] text-xl font-semibold mb-3">
                  Category
                </label>

                <select
                  className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl px-6 py-5 text-[#f5deb3] text-lg outline-none focus:border-[#ddb892] transition duration-300"
                  {...register("category", {
                    required:
                      "Category required",
                  })}
                >
                  <option value="">
                    Select Category
                  </option>

                  <option value="Technology">
                    Technology
                  </option>

                  <option value="Programming">
                    Programming
                  </option>

                  <option value="AI">
                    AI
                  </option>

                  <option value="Web Development">
                    Web Development
                  </option>

                  <option value="Design">
                    Design
                  </option>

                  <option value="Lifestyle">
                    Lifestyle
                  </option>
                </select>

                {errors.category && (
                  <p className="text-red-400 mt-2">
                    {
                      errors
                        .category
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Content */}
              <div>
                
                <label className="block text-[#ddb892] text-xl font-semibold mb-3">
                  Article Content
                </label>

                <textarea
                  rows="16"
                  placeholder="Rewrite your masterpiece..."
                  className="w-full bg-[#1f140f] border border-[#4a3728] rounded-2xl px-6 py-5 text-[#f5deb3] text-lg outline-none resize-none leading-relaxed focus:border-[#ddb892] transition duration-300"
                  {...register("content", {
                    required:
                      "Content required",
                  })}
                />

                {errors.content && (
                  <p className="text-red-400 mt-2">
                    {
                      errors
                        .content
                        .message
                    }
                  </p>
                )}
              </div>

              {/* Buttons */}
              <div className="flex flex-wrap gap-5 pt-4">
                
                <button
                  type="submit"
                  className="bg-[#ddb892] hover:bg-[#c89b5b] text-black px-10 py-4 rounded-full font-bold text-lg transition duration-300 shadow-lg"
                >
                  Update Article
                </button>

                <button
                  type="button"
                  onClick={() =>
                    navigate(
                      `/articles/${article._id}`
                    )
                  }
                  className="bg-[#4a3728] hover:bg-[#5c4331] text-[#f5deb3] px-10 py-4 rounded-full font-bold text-lg transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditArticle;