import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Loader2, ArrowRight, Zap, Shield, Rocket, Users, BarChart3, Lock } from "lucide-react";
import { getLoginUrl } from "@/const";
import { Streamdown } from 'streamdown';
import { useLocation } from "wouter";

/**
 * صفحة رئيسية عصرية وجذابة مع تصميم حديث
 */
export default function Home() {
  let { user, loading, error, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleDashboard = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
              <Rocket className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              AI Factory
            </span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-slate-300">مرحباً، {user?.name || "المستخدم"}</span>
                <Button 
                  onClick={handleDashboard}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
                >
                  لوحة التحكم
                </Button>
                <Button 
                  onClick={logout}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-800"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative">
        <div className="max-w-7xl mx-auto">
          {/* Background Gradient Orbs */}
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl -z-10"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl -z-10"></div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full">
                  <span className="text-sm text-blue-300 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    تكنولوجيا متقدمة
                  </span>
                </div>
                <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                  مصنع <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">الذكاء الاصطناعي</span>
                </h1>
                <p className="text-xl text-slate-300 leading-relaxed">
                  منصة متطورة لإدارة المشاريع والمحادثات الذكية. استخدم قوة الذكاء الاصطناعي لتحسين إنتاجيتك وتحقيق أهدافك.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleDashboard}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg border-0 flex items-center gap-2 group"
                >
                  ابدأ الآن
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-slate-600 text-white hover:bg-slate-800 px-8 py-6 text-lg"
                >
                  تعرف على المزيد
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8">
                <div>
                  <div className="text-3xl font-bold text-blue-400">100+</div>
                  <p className="text-sm text-slate-400">مستخدم نشط</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-cyan-400">50K+</div>
                  <p className="text-sm text-slate-400">محادثة معالجة</p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-400">99.9%</div>
                  <p className="text-sm text-slate-400">توفر الخدمة</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl border border-blue-500/30 p-8 flex items-center justify-center">
                <div className="space-y-4 w-full">
                  {/* Animated Card 1 */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <Zap className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">معالجة سريعة</p>
                        <p className="text-xs text-slate-400">استجابة فورية</p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Card 2 */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-cyan-500/30 rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-cyan-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">آمن تماماً</p>
                        <p className="text-xs text-slate-400">تشفير من الدرجة الأولى</p>
                      </div>
                    </div>
                  </div>

                  {/* Animated Card 3 */}
                  <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 transform hover:scale-105 transition-transform">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-500/30 rounded-lg flex items-center justify-center">
                        <BarChart3 className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold">تحليلات متقدمة</p>
                        <p className="text-xs text-slate-400">رؤى عميقة وقابلة للتنفيذ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-800/50 border-t border-slate-700/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">المميزات الرئيسية</h2>
            <p className="text-xl text-slate-400">كل ما تحتاجه لإدارة مشاريعك بكفاءة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="group p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Rocket className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">محادثات ذكية</h3>
              <p className="text-slate-400">تفاعل مع نظام ذكي يفهم احتياجاتك ويقدم حلولاً فعالة</p>
            </div>

            {/* Feature 2 */}
            <div className="group p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl hover:border-cyan-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Users className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">التعاون الفعال</h3>
              <p className="text-slate-400">اعمل مع فريقك بسهولة وتبادل الأفكار والمشاريع</p>
            </div>

            {/* Feature 3 */}
            <div className="group p-8 bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-xl hover:border-blue-500/50 transition-all duration-300">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Lock className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-bold mb-2">أمان عالي</h3>
              <p className="text-slate-400">بيانات محمية بأعلى معايير الأمان والخصوصية</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-gradient-to-r from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-2xl p-12 space-y-6">
            <h2 className="text-4xl font-bold">جاهز للبدء؟</h2>
            <p className="text-xl text-slate-300">انضم إلى آلاف المستخدمين الذين يستخدمون AI Factory لتحسين إنتاجيتهم</p>
            <Button 
              onClick={handleDashboard}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg border-0"
            >
              ابدأ الآن مجاناً
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 bg-slate-900/50 py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <p className="text-slate-400">© 2024 AI Software Factory. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors">سياسة الخصوصية</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">الشروط والأحكام</a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors">التواصل</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
