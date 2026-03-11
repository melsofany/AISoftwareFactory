import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Sparkles, ArrowRight, Shield, Zap, Users, BarChart3, Rocket, Code2 } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">AI Factory</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-400">مرحباً، <span className="text-cyan-400">{user?.name || "المستخدم"}</span></span>
                <Button 
                  onClick={() => setLocation("/")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50"
                >
                  لوحة التحكم
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-24 px-4 sm:px-6 lg:px-8">
        {/* Background Gradient Orbs */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-600/30 rounded-full blur-3xl opacity-20"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <div className="inline-block px-4 py-2 bg-blue-500/20 border border-blue-500/50 rounded-full backdrop-blur-sm">
                  <span className="text-sm text-blue-300 font-semibold flex items-center gap-2">
                    <Zap className="w-4 h-4" />
                    تكنولوجيا الذكاء الاصطناعي المتقدمة
                  </span>
                </div>
                <h1 className="text-6xl md:text-7xl font-bold leading-tight">
                  مصنع <span className="bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">الذكاء</span>
                  <br />
                  <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">الاصطناعي</span>
                </h1>
                <p className="text-xl text-gray-400 leading-relaxed max-w-lg">
                  منصة متطورة تجمع بين قوة الذكاء الاصطناعي وسهولة الاستخدام. أدر مشاريعك، أجرِ محادثات ذكية، وحقق أهدافك بكفاءة عالية.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={() => setLocation("/")}
                  className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-8 py-6 text-lg border-0 flex items-center gap-2 group shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 transition-all"
                >
                  ابدأ الآن
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10 px-8 py-6 text-lg"
                >
                  تعرف على المزيد
                </Button>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10">
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">10K+</div>
                  <p className="text-sm text-gray-400 mt-1">مستخدم نشط</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">500K+</div>
                  <p className="text-sm text-gray-400 mt-1">محادثة معالجة</p>
                </div>
                <div>
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">99.9%</div>
                  <p className="text-sm text-gray-400 mt-1">توفر الخدمة</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-2xl blur-2xl"></div>
              <div className="relative bg-gradient-to-br from-white/10 to-white/5 border border-white/20 rounded-2xl p-8 backdrop-blur-xl space-y-4">
                {/* Feature Card 1 */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Zap className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">معالجة سريعة</h3>
                      <p className="text-sm text-gray-400 mt-1">استجابة فورية وفعالة</p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 2 */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-cyan-500/50 hover:bg-cyan-500/10 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <Shield className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">آمن تماماً</h3>
                      <p className="text-sm text-gray-400 mt-1">تشفير من الدرجة الأولى</p>
                    </div>
                  </div>
                </div>

                {/* Feature Card 3 */}
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 group cursor-pointer">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">تحليلات متقدمة</h3>
                      <p className="text-sm text-gray-400 mt-1">رؤى عميقة وقابلة للتنفيذ</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-6xl font-bold mb-6">المميزات الرئيسية</h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">كل ما تحتاجه لإدارة مشاريعك وتحقيق أهدافك بكفاءة عالية</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Rocket,
                title: "محادثات ذكية",
                description: "تفاعل مع نظام ذكي يفهم احتياجاتك ويقدم حلولاً فعالة وسريعة"
              },
              {
                icon: Users,
                title: "التعاون الفعال",
                description: "اعمل مع فريقك بسهولة وتبادل الأفكار والمشاريع بكل سلاسة"
              },
              {
                icon: Code2,
                title: "تكامل سلس",
                description: "تكامل مع أدوات وخدمات أخرى لتحسين سير العمل"
              }
            ].map((feature, idx) => (
              <div key={idx} className="group p-8 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all duration-300 backdrop-blur-sm">
                <feature.icon className="w-14 h-14 text-blue-400 mb-4 group-hover:scale-110 transition-transform" />
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600/30 to-cyan-600/30 rounded-2xl blur-2xl"></div>
            <div className="relative bg-gradient-to-r from-blue-600/20 to-cyan-600/20 border border-blue-500/50 rounded-2xl p-16 text-center space-y-8 backdrop-blur-xl">
              <h2 className="text-5xl font-bold">جاهز للبدء؟</h2>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">انضم إلى آلاف المستخدمين الذين يستخدمون AI Factory لتحسين إنتاجيتهم وتحقيق أهدافهم</p>
              <Button 
                onClick={() => setLocation("/")}
                className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-10 py-6 text-lg border-0 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
              >
                ابدأ الآن مجاناً
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 bg-slate-950/50 py-12 px-4 sm:px-6 lg:px-8 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500">© 2024 AI Software Factory. جميع الحقوق محفوظة.</p>
          <div className="flex gap-8">
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">سياسة الخصوصية</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">الشروط والأحكام</a>
            <a href="#" className="text-gray-500 hover:text-gray-300 transition-colors">التواصل</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
