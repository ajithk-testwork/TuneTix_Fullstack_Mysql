import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Mail, Lock, ShieldCheck, Loader2, Eye, EyeOff } from "lucide-react";
import adminAPI from "../../../api/adminAPI";

const AdminLogin = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setIsLoading(true);
    setError("");

    try {
      const response = await adminAPI.post("/auth/admin/login", {
        email,
        password,
      });

      const data = response.data;

      const user = data.user || data.data?.user;

      if (!user) {
        setError("Invalid server response.");
        return;
      }

    
      if (user.role !== "ADMIN" && user.role !== "SUPER_ADMIN") {
        setError("Access denied. This login is only for administrators.");
        return;
      }

   
      localStorage.setItem("adminToken", data.token);

      localStorage.setItem("adminRole", user.role);

      localStorage.setItem("adminDetails", JSON.stringify(user));

      navigate("/admin");
    } catch (error: any) {
      setError(
        error.response?.data?.message || "Unable to connect to the server.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-blue-50 flex items-center justify-center">
            <ShieldCheck className="text-blue-600" size={32} />
          </div>

          <h1 className="text-3xl font-bold text-gray-900">Admin Login</h1>

          <p className="text-gray-500 text-sm mt-2">
            Sign in to access the admin dashboard
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 rounded-xl p-3 text-sm">
              {error}
            </div>
          )}

          {/* EMAIL */}

          <div>
            <label className="text-sm font-medium text-gray-700">
              Admin Email
            </label>

            <div className="relative mt-2">
              <Mail
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="admin@example.com"
                className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />
            </div>
          </div>

          {/* PASSWORD */}

          <div>
            <div className="flex justify-between">
              <label className="text-sm font-medium text-gray-700">
                Password
              </label>

              <Link
                to="/admin/forgot-password"
                className="text-sm text-blue-600 font-semibold"
              >
                Forgot password?
              </Link>
            </div>

            <div className="relative mt-2">
              <Lock
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={20}
              />

              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-12 py-3.5 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-blue-500"
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3.5 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <ShieldCheck size={20} />
                Admin Login
              </>
            )}
          </button>
        </form>

        <div className="text-center mt-6 pt-5 border-t">
          <Link
            to="/login"
            className="text-sm text-gray-500 hover:text-blue-600"
          >
            ← User Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
