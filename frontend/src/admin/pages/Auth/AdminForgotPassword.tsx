import { useForm } from "react-hook-form";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, KeyRound, Loader2, ArrowLeft, ShieldCheck } from "lucide-react";
import toast from "react-hot-toast";
import API from "../../../api/userAPI";

interface AdminForgotPasswordForm {
  email: string;
}

const AdminForgotPassword = () => {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AdminForgotPasswordForm>();

  const onSubmit = async (data: AdminForgotPasswordForm) => {
    try {
      const res = await API.post("/auth/admin/forgot-password", {
        email: data.email,
      });

      toast.success(res.data.message || "Reset OTP sent to your email!", {
        style: {
          background: "#12B76A",
          color: "#FFFFFF",
          borderRadius: "12px",
        },
      });

      navigate("/admin/reset-password", {
        state: {
          email: data.email,
        },
      });
    } catch (error: any) {
      console.error("Admin Forgot Password Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to process request. Please try again.",
        {
          style: {
            background: "#F04438",
            color: "#FFFFFF",
            borderRadius: "12px",
          },
        },
      );
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[#F8F9FC] p-4 sm:p-6 overflow-hidden font-sans">
      {/* ================= BACKGROUND ================= */}

      <div
        className="absolute inset-0 z-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(#d1d5db 1px, transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />

      {/* Decorative circles */}

      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= MAIN CARD ================= */}

      <motion.div
        initial={{
          opacity: 0,
          y: 20,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.5,
          ease: "easeOut",
        }}
        className="relative z-10 w-full max-w-[420px] bg-white rounded-[32px] p-8 sm:p-10 shadow-[0_8px_40px_rgb(0,0,0,0.04)] border border-gray-100"
      >
        {/* ================= HEADER ================= */}

        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-4 border border-blue-100">
            <ShieldCheck className="w-7 h-7 text-blue-600" />
          </div>

          <h1 className="text-[28px] font-[800] tracking-tight text-[#172033] mb-2">
            Admin Forgot Password
          </h1>

          <p className="text-[#667085] font-[500] text-sm leading-6">
            Enter your admin email address and we'll send you a 6-digit OTP to
            reset your password.
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}

          <div>
            <label className="block text-sm font-[600] text-[#172033] mb-2 ml-1">
              Admin Email Address
            </label>

            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />

              <input
                type="email"
                placeholder="admin@example.com"
                autoComplete="email"
                {...register("email", {
                  required: "Admin email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Please enter a valid email address",
                  },
                })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.email ? "border-[#F04438]" : "border-transparent"
                } rounded-[16px] pl-12 pr-4 py-4 text-sm text-[#172033] font-[500] placeholder:text-[#667085] outline-none transition-all duration-200 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
              />
            </div>

            {errors.email && (
              <p className="text-[#F04438] text-xs mt-1.5 ml-1 font-[500]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Submit */}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-[600] py-4 px-4 rounded-[16px] transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />

                <span>Sending OTP...</span>
              </>
            ) : (
              <>
                <KeyRound className="w-5 h-5" />

                <span>Send Reset OTP</span>
              </>
            )}
          </button>
        </form>

        {/* ================= BACK TO ADMIN LOGIN ================= */}

        <div className="text-center mt-8 pt-6 border-t border-gray-100">
          <Link
            to="/admin/login"
            className="inline-flex items-center gap-2 text-sm font-[600] text-[#667085] hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Admin Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminForgotPassword;
