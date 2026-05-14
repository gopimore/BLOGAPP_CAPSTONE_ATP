import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import axios from "axios";

function Register() {

  const BASE_URL = import.meta.env.VITE_API_URL;
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const { logout, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [preview, setPreview] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      logout();
    }
  }, [isAuthenticated, logout]);

  const onSubmit = async (newUser) => {
    setLoading(true);

    try {
      let { role, profileUrl, ...userObj } = newUser;

      const formData = new FormData();

      Object.keys(userObj).forEach((key) => {
        formData.append(key, userObj[key]);
      });

      if (profileUrl && profileUrl[0]) {
        formData.append("profileUrl", profileUrl[0]);
      }

      if (role === "user") {
        let resObj = await axios.post(
          `${BASE_URL}/user-api/users`,
          formData
        );

        if (resObj.status === 201) {
          navigate("/login");
        }
      } else if (role === "author") {
        let resObj = await axios.post(
          `${BASE_URL}/author-api/users`,
          formData
        );

        if (resObj.status === 201) {
          navigate("/login");
        }
      }
    } catch (err) {
      console.log("error is", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      if (preview) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-[#1a120b] text-[#f5deb3] text-3xl font-bold">
        Registering...
      </div>
    );
  }

  return (
    <div className="bg-[#1a120b] text-[#f5deb3] flex min-h-[calc(100vh-80px)]">
      
      {/* Left Section */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        
        <img
          src="https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1200&auto=format&fit=crop"
          alt="Books"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        <div className="relative z-10 max-w-lg px-10">
          <p className="uppercase tracking-[0.4em] text-[#ddb892] text-sm mb-5">
            Vintage Blog Platform
          </p>

          <h1 className="text-6xl font-extrabold leading-tight">
            Join The <br />
            World Of <br />
            <span className="italic text-[#ddb892]">
              Timeless Stories
            </span>
          </h1>

          <p className="mt-8 text-lg text-[#f5deb3]/80 leading-relaxed">
            Create your account and start sharing ideas, stories,
            experiences, and creativity with readers around the world.
          </p>
        </div>

        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      {/* Right Section */}
      <div className="w-full lg:w-1/2 flex justify-center items-center px-8 py-12">
        
        <div className="w-full max-w-xl">
          
          <h2 className="text-5xl font-bold mb-3">
            Create Account
          </h2>

          <p className="text-[#e6ccb2] mb-10">
            Begin your storytelling journey today.
          </p>

          {error && (
            <p className="bg-red-500/20 border border-red-500 text-red-300 p-4 rounded-xl mb-6">
              {error}
            </p>
          )}

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="space-y-6"
          >
            
            {/* Role */}
            <div>
              <p className="text-[#ddb892] mb-3 font-medium">
                Select Role
              </p>

              <div className="flex gap-8">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="user"
                    {...register("role", { required: true })}
                    className="accent-[#ddb892]"
                  />
                  User
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    value="author"
                    {...register("role", { required: true })}
                    className="accent-[#ddb892]"
                  />
                  Author
                </label>
              </div>

              {errors.role && (
                <p className="text-red-400 mt-2">
                  Please select a role
                </p>
              )}
            </div>

            {/* Names */}
            <div className="grid md:grid-cols-2 gap-5">
              
              <div>
                <input
                  type="text"
                  placeholder="First Name"
                  {...register("firstName", { required: true })}
                  className="w-full bg-[#2d1e16] border border-[#4a3728] p-4 rounded-xl outline-none focus:border-[#ddb892]"
                />

                {errors.firstName && (
                  <p className="text-red-400 mt-2 text-sm">
                    First name required
                  </p>
                )}
              </div>

              <div>
                <input
                  type="text"
                  placeholder="Last Name"
                  {...register("lastName", { required: true })}
                  className="w-full bg-[#2d1e16] border border-[#4a3728] p-4 rounded-xl outline-none focus:border-[#ddb892]"
                />

                {errors.lastName && (
                  <p className="text-red-400 mt-2 text-sm">
                    Last name required
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <input
                type="email"
                placeholder="Email Address"
                {...register("email", {
                  required: true,
                  pattern: /^\S+@\S+$/i,
                })}
                className="w-full bg-[#2d1e16] border border-[#4a3728] p-4 rounded-xl outline-none focus:border-[#ddb892]"
              />

              {errors.email && (
                <p className="text-red-400 mt-2 text-sm">
                  Enter valid email
                </p>
              )}
            </div>

            {/* Password */}
            <div>
              <input
                type="password"
                placeholder="Password"
                {...register("password", {
                  required: true,
                  minLength: 6,
                })}
                className="w-full bg-[#2d1e16] border border-[#4a3728] p-4 rounded-xl outline-none focus:border-[#ddb892]"
              />

              {errors.password && (
                <p className="text-red-400 mt-2 text-sm">
                  Password must be at least 6 characters
                </p>
              )}
            </div>

            {/* Profile Upload */}
            <div>
              <label className="block mb-3 text-[#ddb892] font-medium">
                Upload Profile Image
              </label>

              <input
                type="file"
                accept="image/png, image/jpeg"
                {...register("profileUrl")}
                className="w-full bg-[#2d1e16] border border-[#4a3728] p-4 rounded-xl"
                onChange={(e) => {
                  const file = e.target.files[0];

                  if (file) {
                    if (
                      !["image/jpeg", "image/png"].includes(file.type)
                    ) {
                      setError("Only JPG or PNG allowed");
                      return;
                    }

                    if (file.size > 2 * 1024 * 1024) {
                      setError("File size must be less than 2MB");
                      return;
                    }

                    const previewUrl =
                      URL.createObjectURL(file);

                    setPreview(previewUrl);
                    setError(null);
                  }
                }}
              />

              {preview && (
                <div className="mt-6 flex justify-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-28 h-28 rounded-full object-cover border-4 border-[#ddb892]"
                  />
                </div>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full bg-[#ddb892] hover:bg-[#c89b5b] text-black py-4 rounded-xl font-bold text-lg transition duration-300 shadow-xl"
            >
              Register Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Register;