import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../store/authStore";
import { useEffect } from "react";
import toast from "react-hot-toast";

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const login = useAuth((state) => state.login);
  const isAuthenticated = useAuth((state) => state.isAuthenticated);
  const currentUser = useAuth((state) => state.currentUser);
  const error = useAuth((state) => state.error);
  const clearError = useAuth((state) => state.clearError);

  const navigate = useNavigate();

  const onUserLogin = async (userCredObj) => {
    await login(userCredObj);
  };

  useEffect(() => {
    if (error === "Invalid role for this user") {
      clearError();
      navigate("/unauthorized");
      return;
    }

    if (isAuthenticated && currentUser) {
      const role = currentUser.role?.toUpperCase();

      toast.success("Logged in successfully");

      if (role === "USER") {
        navigate("/userdashboard", { replace: true });
      }

      if (role === "AUTHOR") {
        navigate("/authordashboard", { replace: true });
      }

      if (role === "ADMIN") {
        navigate("/admindashboard", { replace: true });
      }
    }
  }, [isAuthenticated, currentUser, error, navigate, clearError]);

  return (
    <div className="min-h-screen bg-[#1a120b] flex justify-center items-center px-6">
      
      {/* Login Card */}
      <div className="w-full max-w-md bg-[#2d1e16] border border-[#c89b5b] rounded-3xl p-10 shadow-2xl">
        
        {/* Heading */}
        <div className="text-center">
          <p className="uppercase tracking-[0.3em] text-[#c89b5b] text-sm">
            Vintage Blog Platform
          </p>

          <h1 className="text-4xl font-bold text-[#f5deb3] mt-4">
            Welcome Back
          </h1>

          <p className="text-[#e6ccb2] mt-3">
            Login to continue your storytelling journey
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit(onUserLogin)}
          className="mt-10 space-y-6"
        >
          {/* Email */}
          <div>
            <input
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              {...register("email", {
                required: true,
                pattern: /^\S+@\S+$/i,
              })}
              className="w-full bg-[#3b2a20] border border-[#5b4636] text-[#f5deb3] p-4 rounded-xl outline-none focus:border-[#ddb892]"
            />

            {errors.email && (
              <p className="text-red-400 mt-2 text-sm">
                Enter a valid email
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <input
              type="password"
              placeholder="Enter your password"
              autoComplete="current-password"
              {...register("password", {
                required: true,
                minLength: 6,
              })}
              className="w-full bg-[#3b2a20] border border-[#5b4636] text-[#f5deb3] p-4 rounded-xl outline-none focus:border-[#ddb892]"
            />

            {errors.password && (
              <p className="text-red-400 mt-2 text-sm">
                Password must be at least 6 characters
              </p>
            )}
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-[#ddb892] hover:bg-[#c89b5b] text-black font-semibold py-4 rounded-xl transition duration-300 shadow-lg"
          >
            Login
          </button>

          {error && (
            <p className="text-red-400 mt-3 text-center text-sm">
              {error}
            </p>
          )}
        </form>

        {/* Footer */}
        <p className="text-center text-[#cbb89d] mt-8 text-sm">
          “Where stories live forever.”
        </p>
      </div>
    </div>
  );
}

export default Login;