import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Lock,
  ShieldCheck,
  Eye,
  EyeOff,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import toast from "react-hot-toast";
import API from "../../../api/userAPI";

interface AdminResetPasswordForm {
  email: string;
  newPassword: string;
  confirmPassword: string;
}

interface LocationState {
  email?: string;
}

const AdminResetPassword = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [showPassword, setShowPassword] = useState(false);

  const [otp, setOtp] = useState("");

  const state = location.state as LocationState | null;

  const stateEmail = state?.email || "";

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<AdminResetPasswordForm>({
    defaultValues: {
      email: stateEmail,
      newPassword: "",
      confirmPassword: "",
    },
  });

  const newPassword = watch("newPassword");

  const onSubmit = async (data: AdminResetPasswordForm) => {
    if (!/^\d{6}$/.test(otp)) {
      toast.error("Please enter a valid 6-digit OTP", {
        style: {
          background: "#F04438",
          color: "#FFFFFF",
          borderRadius: "12px",
        },
      });

      return;
    }

    try {
      const payload = {
        email: data.email,
        otp: otp,
        newPassword: data.newPassword,
      };

      const res = await API.post("/auth/admin/reset-password", payload);

      toast.success(res.data.message || "Admin password reset successfully!", {
        style: {
          background: "#12B76A",
          color: "#FFFFFF",
          borderRadius: "12px",
        },
      });

      // Go back to ADMIN LOGIN
      navigate("/admin/login");
    } catch (error: any) {
      console.error("Admin Reset Password Error:", error);

      toast.error(
        error.response?.data?.message ||
          "Failed to reset password. OTP may be invalid or expired.",
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

      <div className="absolute top-[-10%] left-[-10%] w-[30rem] h-[30rem] bg-blue-500/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-cyan-400/10 rounded-full blur-[100px] pointer-events-none" />

      {/* ================= CARD ================= */}

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
            Reset Admin Password
          </h1>

          <p className="text-[#667085] font-[500] text-sm leading-6">
            Enter the 6-digit OTP sent to your admin email and create a new
            password.
          </p>
        </div>

        {/* ================= FORM ================= */}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* EMAIL */}

          {!stateEmail && (
            <div>
              <label className="block text-sm font-[600] text-[#172033] mb-2 ml-1">
                Admin Email
              </label>

              <input
                type="email"
                placeholder="admin@example.com"
                {...register("email", {
                  required: "Admin email is required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email",
                  },
                })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.email ? "border-[#F04438]" : "border-transparent"
                } rounded-[16px] px-4 py-4 text-sm text-[#172033] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
              />

              {errors.email && (
                <p className="text-[#F04438] text-xs mt-1 ml-1">
                  {errors.email.message}
                </p>
              )}
            </div>
          )}

          {/* OTP */}

          <div>
            <label className="block text-sm font-[600] text-[#172033] mb-2 ml-1">
              Verification Code
            </label>

            <input
              type="text"
              inputMode="numeric"
              maxLength={6}
              value={otp}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, "").slice(0, 6);

                setOtp(value);
              }}
              placeholder="000000"
              className="w-full bg-[#F8F9FC] border border-transparent rounded-2xl px-4 py-4 text-center text-2xl tracking-[10px] font-[700] text-[#172033] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all"
            />
          </div>

          {/* NEW PASSWORD */}

          <div>
            <label className="block text-sm font-[600] text-[#172033] mb-2 ml-1">
              New Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.newPassword ? "border-[#F04438]" : "border-transparent"
                } rounded-[16px] pl-12 pr-12 py-4 text-sm text-[#172033] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#667085]"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {errors.newPassword && (
              <p className="text-[#F04438] text-xs mt-1 ml-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>

          {/* CONFIRM PASSWORD */}

          <div>
            <label className="block text-sm font-[600] text-[#172033] mb-2 ml-1">
              Confirm New Password
            </label>

            <div className="relative">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-[#667085]"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Confirm New Password"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                className={`w-full bg-[#F8F9FC] border ${
                  errors.confirmPassword
                    ? "border-[#F04438]"
                    : "border-transparent"
                } rounded-[16px] pl-12 pr-4 py-4 text-sm text-[#172033] outline-none focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10`}
              />
            </div>

            {errors.confirmPassword && (
              <p className="text-[#F04438] text-xs mt-1 ml-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* SUBMIT */}

          <button
            type="submit"
            disabled={isSubmitting || otp.length !== 6}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-[600] py-4 px-4 rounded-[16px] transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-[0_8px_20px_rgba(37,99,235,0.25)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />

                <span>Resetting Password...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />

                <span>Reset Admin Password</span>
              </>
            )}
          </button>
        </form>

        {/* ================= BACK ================= */}

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

export default AdminResetPassword;
