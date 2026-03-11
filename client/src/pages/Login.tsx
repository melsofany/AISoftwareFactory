import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, Eye, EyeOff, Sparkles } from "lucide-react";
import { useLocation } from "wouter";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await fetch("/api/auth/verify-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          localStorage.setItem("authenticated", "true");
          // استخدام setTimeout للتأكد من أن الكوكي تم حفظه قبل إعادة التوجيه
          setTimeout(() => {
            window.location.href = "/";
          }, 100);
        } else {
          setError("كلمة المرور غير صحيحة");
        }
      } else {
        setError("حدث خطأ أثناء التحقق من كلمة المرور");
      }
    } catch (err) {
      setError("حدث خطأ في الاتصال بالخادم");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-6 shadow-2xl shadow-blue-500/50">
            <Sparkles className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">AI Factory</h1>
          <p className="text-lg text-gray-400">منصة الذكاء الاصطناعي المتقدمة</p>
        </div>

        {/* Login Card - Glassmorphism */}
        <Card className="bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl p-8 space-y-8">
          {/* Welcome Text */}
          <div className="space-y-3">
            <h2 className="text-3xl font-bold text-white">أهلاً بك</h2>
            <p className="text-gray-300 text-base">
              يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="space-y-3">
              <label htmlFor="password" className="block text-sm font-semibold text-gray-200">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 to-cyan-500/30 rounded-xl blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="أدخل كلمة المرور"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="relative w-full bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all pr-12 py-3"
                  autoFocus
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/20 border border-red-500/50 rounded-lg backdrop-blur-sm animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-300">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white font-bold py-3 text-base border-0 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 rounded-lg"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  جاري التحقق...
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <Lock className="w-5 h-5" />
                  دخول آمن
                </span>
              )}
            </Button>
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white/10 text-gray-400">معلومات إضافية</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 space-y-2 backdrop-blur-sm">
            <p className="text-xs text-gray-200 font-semibold">💡 نصيحة:</p>
            <p className="text-xs text-gray-300 leading-relaxed">
              هذا النظام محمي بكلمة مرور آمنة. استخدم كلمة المرور الصحيحة للوصول إلى جميع المميزات المتقدمة.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            © 2024 <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-bold">AI Software Factory</span>
          </p>
        </div>
      </div>
    </div>
  );
}
