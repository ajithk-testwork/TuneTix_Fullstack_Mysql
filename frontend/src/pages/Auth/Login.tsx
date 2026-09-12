import { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/userAPI";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, Ticket, Loader2 } from "lucide-react";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data: any) => {
    try {
      const res = await API.post("/auth/login", data);

      console.log("Login Response:", res.data);

      localStorage.setItem("token", res.data.token);

      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success(res.data.message || "Login Successful!", {
        style: {
          background: "#12B76A",
          color: "#FFF",
          borderRadius: "12px",
        },
      });

      const user = res.data.user;

      // Navigate based on role
      if (user.role === "USER") {
        navigate("/");
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("user");

        toast.error("Please use the correct login page.");
      }
    } catch (err: any) {
     
      console.error("Login Error:", err);

      if (err.response) {
        console.log("Response:", err.response.data);

        const errorData = err.response.data;

        // Email verification required
        if (errorData.requiresEmailVerification) {
          toast.error(
            errorData.message || "Please verify your email before logging in.",
            {
              style: {
                background: "#F04438",
                color: "#FFF",
                borderRadius: "12px",
              },
            },
          );

          navigate("/verify-email", {
            state: {
              email: data.email,
            },
          });

          return;
        }

        toast.error(errorData.message || "Login Failed", {
          style: {
            background: "#F04438",
            color: "#FFF",
            borderRadius: "12px",
          },
        });
      } else if (err.request) {
        toast.error("Cannot connect to server", {
          style: {
            background: "#F04438",
            color: "#FFF",
            borderRadius: "12px",
          },
        });
      } else {
        toast.error(err.message || "Something went wrong", {
          style: {
            background: "#F04438",
            color: "#FFF",
            borderRadius: "12px",
          },
        });
      }
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8F9FC] p-4 sm:p-6 overflow-hidden font-sans">
      {/* Background Dot Pattern */}
      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative Floating Elements */}
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
        className="absolute hidden md:flex top-1/4 left-[15%] w-16 h-16 bg-[#FFFFFF] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] items-center justify-center z-0 border border-gray-100"
      >
        <Ticket className="w-8 h-8 text-[#6C5CE7]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
        className="absolute hidden md:flex bottom-1/3 right-[15%] w-14 h-14 bg-[#FFFFFF] rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] items-center justify-center z-0 border border-gray-100"
      >
        <Lock className="w-6 h-6 text-[#00B4D8]" />
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-[420px] bg-[#FFFFFF] rounded-[32px] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100"
      >
        {/* Brand Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-[#6C5CE7]/10 rounded-2xl flex items-center justify-center mb-4">
            <Ticket className="w-7 h-7 text-[#6C5CE7]" />
          </div>
          <h1 className="text-[28px] font-[800] tracking-tight text-[#172033] mb-2">
            Welcome Back
          </h1>
          <p className="text-[#667085] font-[600] text-sm">
            Sign in to manage and claim your event tickets
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email Field */}
          <div>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type="email"
                placeholder="Your Email"
                {...register("email", { required: "Email is required" })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.email ? "border-[#F04438]" : "border-transparent"
                } rounded-[16px] pl-12 pr-4 py-4 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 focus:bg-[#FFFFFF] focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10`}
              />
            </div>
            {errors.email && (
              <p className="text-[#F04438] text-xs mt-1.5 ml-1 font-[500]">
                {errors.email.message as string}
              </p>
            )}
          </div>

          {/* Password Field */}
          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                {...register("password", { required: "Password is required" })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.password ? "border-[#F04438]" : "border-transparent"
                } rounded-[16px] pl-12 pr-12 py-4 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 focus:bg-[#FFFFFF] focus:border-[#6C5CE7] focus:ring-4 focus:ring-[#6C5CE7]/10`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 text-[#667085] hover:text-[#6C5CE7] transition-colors focus:outline-none"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-[#F04438] text-xs mt-1.5 ml-1 font-[500]">
                {errors.password.message as string}
              </p>
            )}

            {/* Forgot Password */}
            <div className="flex justify-end mt-2">
              <Link
                to="/forgot-password"
                className="text-sm font-[600] text-[#667085] hover:text-[#6C5CE7] transition-colors"
              >
                Forgot password?
              </Link>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] font-[600] py-4 px-4 rounded-[16px] transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4 flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(108,92,231,0.25)]"
          >
            {isSubmitting ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <span>Log In</span>
            )}
          </button>
        </form>

        <div className="mt-8 relative flex items-center justify-center">
          <span className="bg-[#FFFFFF] px-4 text-sm text-[#667085] font-[500] z-10 relative">
            Or continue with
          </span>
          <div className="absolute w-full h-px bg-gray-200 left-0 top-1/2 -translate-y-1/2"></div>
        </div>

        <p className="text-center mt-6 text-sm text-[#667085] font-[500]">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-[#172033] font-[700] hover:text-[#6C5CE7] transition-colors hover:underline"
          >
            Sign up
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
