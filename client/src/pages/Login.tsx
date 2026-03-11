import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { AlertCircle, Lock, Rocket, Eye, EyeOff } from "lucide-react";
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
          setLocation("/");
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>

      <div className="w-full max-w-md">
        {/* Logo Section */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl mb-4 mx-auto shadow-lg shadow-blue-500/50">
            <Rocket className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">
            AI Factory
          </h1>
          <p className="text-slate-400">
            منصة الذكاء الاصطناعي المتقدمة
          </p>
        </div>

        {/* Login Card */}
        <Card className="bg-slate-800/80 backdrop-blur-xl border border-slate-700/50 shadow-2xl p-8 space-y-6">
          {/* Welcome Text */}
          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">أهلاً بك</h2>
            <p className="text-slate-400 text-sm">
              يرجى إدخال كلمة المرور للوصول إلى لوحة التحكم
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Password Field */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-semibold text-white">
                كلمة المرور
              </label>
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="أدخل كلمة المرور"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                    className="w-full bg-slate-700/50 border border-slate-600/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300 pr-10"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-300 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-5 h-5" />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/30 rounded-lg animate-in fade-in slide-in-from-top-2 duration-300">
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !password}
              className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white font-semibold py-6 text-base border-0 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
            >
              {loading ? (
                <span className="flex items-center gap-2">
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
              <div className="w-full border-t border-slate-600/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-slate-800/80 text-slate-400">معلومات إضافية</span>
            </div>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4 space-y-2">
            <p className="text-xs text-slate-300 font-semibold">💡 نصيحة:</p>
            <p className="text-xs text-slate-400 leading-relaxed">
              هذا النظام محمي بكلمة مرور آمنة. استخدم كلمة المرور الصحيحة للوصول إلى جميع المميزات المتقدمة.
            </p>
          </div>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-slate-500 text-sm">
            © 2024 <span className="text-transparent bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text font-semibold">AI Software Factory</span>
          </p>
          <p className="text-slate-600 text-xs mt-2">
            جميع الحقوق محفوظة | نسخة 1.0
          </p>
        </div>
      </div>
    </div>
  );
}
