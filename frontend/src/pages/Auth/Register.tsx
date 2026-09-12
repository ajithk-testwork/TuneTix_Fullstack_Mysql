import { useState } from "react";
import { useForm } from "react-hook-form";
import API from "../../api/userAPI";
import toast from "react-hot-toast";
import Swal from "sweetalert2";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  User,
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  Loader2,
  GraduationCap,
  BookOpen,
  MonitorPlay,
  Trophy,
  Ticket,
} from "lucide-react";

interface RegisterForm {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}

const Register = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<RegisterForm>();

  const onSubmit = async (data: RegisterForm) => {
    try {
      const res = await API.post("/auth/register", data);

      await Swal.fire({
        title: "Account Created! 🎉",
        text:
          res.data.message || "We've sent a verification code to your email.",
        icon: "success",
        timer: 1800,
        showConfirmButton: false,
        background: "#FFFFFF",
        color: "#172033",
        iconColor: "#12B76A",
        customClass: {
          popup: "rounded-3xl border border-slate-100 shadow-2xl",
        },
      });

      reset();

      
      navigate("/verify-email", {
        state: {
          email: data.email,
          name: data.name,
        },
      });
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Registration Failed", {
        style: {
          background: "#F04438",
          color: "#FFFFFF",
          borderRadius: "12px",
        },
      });
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#F8F9FC] flex items-center justify-center p-4 sm:p-8 overflow-hidden font-sans">
      {/* ================= MODERN AMBIENT BACKGROUND ================= */}

      <div className="absolute top-[-10%] left-[-10%] w-[35rem] h-[35rem] bg-[#6C5CE7]/20 rounded-full blur-[100px] pointer-events-none" />

      <div className="absolute bottom-[-10%] right-[-10%] w-[30rem] h-[30rem] bg-[#00B4D8]/20 rounded-full blur-[100px] pointer-events-none" />

      {/* Subtle Dot Pattern Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#E5E7EB_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none"></div>

      {/* ================= FLOATING LEARNING ICONS ================= */}
      <motion.div
        animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="hidden lg:flex absolute top-32 left-32 w-16 h-16 bg-[#FFFFFF] rounded-2xl shadow-xl border border-gray-100 items-center justify-center z-0"
      >
        <GraduationCap className="w-8 h-8 text-[#6C5CE7]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
        transition={{
          duration: 7,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="hidden lg:flex absolute bottom-32 left-40 w-14 h-14 bg-[#FFFFFF] rounded-2xl shadow-lg border border-gray-100 items-center justify-center z-0"
      >
        <BookOpen className="w-7 h-7 text-[#00B4D8]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, -20, 0], rotate: [0, -8, 0] }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 0.5,
        }}
        className="hidden lg:flex absolute top-40 right-32 w-14 h-14 bg-[#FFFFFF] rounded-2xl shadow-lg border border-gray-100 items-center justify-center z-0"
      >
        <MonitorPlay className="w-7 h-7 text-[#6C5CE7]" />
      </motion.div>

      <motion.div
        animate={{ y: [0, 15, 0], rotate: [0, 10, 0] }}
        transition={{
          duration: 6.5,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="hidden lg:flex absolute bottom-40 right-40 w-16 h-16 bg-[#FFFFFF] rounded-2xl shadow-xl border border-gray-100 items-center justify-center z-0"
      >
        <Trophy className="w-8 h-8 text-[#00B4D8]" />
      </motion.div>

      {/* ================= MAIN REGISTER CARD ================= */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="relative w-full max-w-[420px] bg-[#FFFFFF] rounded-[2rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.05)] px-8 py-10 z-10 border border-gray-100"
      >
        {/* Card Header */}
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-[#6C5CE7]/10 rounded-xl mb-4">
            <Ticket className="w-6 h-6 text-[#6C5CE7]" />
          </div>

          <h1 className="text-3xl font-[800] text-[#172033] leading-tight tracking-tight">
            Create Your Account
          </h1>

          <p className="text-[#667085] text-sm font-[600] mt-2">
            Sign up to discover events and book your tickets
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Full Name */}
          <div>
            <div className="relative flex items-center">
              <User className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type="text"
                placeholder="Full Name"
                {...register("name", { required: "Name is required" })}
                className={`w-full bg-[#F8F9FC] rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 border ${
                  errors.name
                    ? "border-[#F04438] focus:border-[#F04438]"
                    : "border-transparent focus:border-[#6C5CE7] focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#6C5CE7]/10"
                }`}
              />
            </div>
            {errors.name && (
              <p className="text-[#F04438] text-xs mt-1 ml-1 font-[500]">
                {errors.name.message}
              </p>
            )}
          </div>

          {/* Email Address */}
          <div>
            <div className="relative flex items-center">
              <Mail className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type="email"
                placeholder="Your Email"
                {...register("email", { required: "Email is required" })}
                className={`w-full bg-[#F8F9FC] rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 border ${
                  errors.email
                    ? "border-[#F04438] focus:border-[#F04438]"
                    : "border-transparent focus:border-[#6C5CE7] focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#6C5CE7]/10"
                }`}
              />
            </div>
            {errors.email && (
              <p className="text-[#F04438] text-xs mt-1 ml-1 font-[500]">
                {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone Number */}
          <div>
            <div className="relative flex items-center">
              <Phone className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type="text"
                placeholder="Phone Number"
                maxLength={10}
                onInput={(e) => {
                  e.currentTarget.value = e.currentTarget.value
                    .replace(/[^0-9]/g, "")
                    .slice(0, 10);
                }}
                {...register("phoneNumber", {
                  required: "Phone Number is required",
                  pattern: {
                    value: /^[0-9]{10}$/,
                    message: "Must be exactly 10 digits",
                  },
                })}
                className={`w-full bg-[#F8F9FC] rounded-xl pl-12 pr-4 py-3.5 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 border ${
                  errors.phoneNumber
                    ? "border-[#F04438] focus:border-[#F04438]"
                    : "border-transparent focus:border-[#6C5CE7] focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#6C5CE7]/10"
                }`}
              />
            </div>
            {errors.phoneNumber && (
              <p className="text-[#F04438] text-xs mt-1 ml-1 font-[500]">
                {errors.phoneNumber.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <div className="relative flex items-center">
              <Lock className="absolute left-4 w-5 h-5 text-[#667085] pointer-events-none" />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Your Password"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Minimum 6 characters required",
                  },
                })}
                className={`w-full bg-[#F8F9FC] rounded-xl pl-12 pr-12 py-3.5 text-sm text-[#172033] font-[500] placeholder:text-[#667085] placeholder:font-[400] outline-none transition-all duration-200 border ${
                  errors.password
                    ? "border-[#F04438] focus:border-[#F04438]"
                    : "border-transparent focus:border-[#6C5CE7] focus:bg-[#FFFFFF] focus:ring-4 focus:ring-[#6C5CE7]/10"
                }`}
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
              <p className="text-[#F04438] text-xs mt-1 ml-1 font-[500]">
                {errors.password.message}
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-[#6C5CE7] hover:bg-[#4834D4] text-[#FFFFFF] font-[600] py-3.5 px-4 rounded-xl transition-all duration-200 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-2 flex items-center justify-center gap-2 text-base shadow-[0_8px_20px_rgba(108,92,231,0.25)]"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              "Sign Up"
            )}
          </button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-100"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-[#FFFFFF] text-[#667085] font-[500]">
              Or continue with
            </span>
          </div>
        </div>

        {/* Footer Link */}
        <p className="text-center mt-8 text-sm text-[#667085] font-[500]">
          Already Have An Account?{" "}
          <Link
            to="/login"
            className="text-[#172033] font-[700] hover:text-[#6C5CE7] transition-colors hover:underline"
          >
            Login
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Register;
