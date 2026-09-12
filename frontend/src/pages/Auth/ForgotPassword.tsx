import { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/userAPI";
import toast from "react-hot-toast";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, KeyRound, Loader2, ArrowLeft } from "lucide-react";

interface ForgotPasswordForm {
  email: string;
}

const ForgotPassword = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>();

  const onSubmit = async (data: ForgotPasswordForm) => {
    try {
      const res = await API.post("/auth/forgot-password", data);

      toast.success(res.data.message || "Reset OTP sent to your email!", {
        style: {
          background: "#12B76A",
          color: "#FFF",
          borderRadius: "12px",
        },
      });

      // Navigate to reset-password page and pass the email via state
      navigate("/reset-password", {
        state: { email: data.email },
      });
    } catch (err: any) {
      toast.error(
        err.response?.data?.message || "Failed to process request. Try again.",
        {
          style: {
            background: "#F04438",
            color: "#FFF",
            borderRadius: "12px",
          },
        }
      );
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
            <KeyRound className="w-7 h-7 text-[#6C5CE7]" />
          </div>
          <h1 className="text-[28px] font-[800] tracking-tight text-[#172033] mb-2">
            Forgot Password
          </h1>
          <p className="text-[#667085] font-[500] text-sm leading-6">
            Enter your registered email address and we'll send you an OTP to reset your password.
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
                {errors.email?.message}
              </p>
            )}
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
              <span>Send Reset OTP</span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/login"
            className="inline-flex items-center gap-2 text-sm font-[600] text-[#667085] hover:text-[#6C5CE7] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;