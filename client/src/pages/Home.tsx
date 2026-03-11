import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { getLoginUrl } from "@/const";
import { useLocation } from "wouter";
import { Sparkles, ArrowRight, Shield, Zap, Users } from "lucide-react";

export default function Home() {
  const { user, isAuthenticated, logout } = useAuth();
  const [, setLocation] = useLocation();

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">AI Factory</span>
          </div>
          <div className="flex items-center gap-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-gray-600">مرحباً، {user?.name || "المستخدم"}</span>
                <Button 
                  onClick={() => setLocation("/")}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  لوحة التحكم
                </Button>
                <Button 
                  onClick={handleLogout}
                  variant="outline"
                  className="border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  تسجيل الخروج
                </Button>
              </>
            ) : (
              <Button 
                onClick={() => window.location.href = getLoginUrl()}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                تسجيل الدخول
              </Button>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-3 py-1 bg-blue-100 rounded-full">
                <span className="text-sm text-blue-700 font-semibold">✨ تكنولوجيا متقدمة</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight">
                مصنع الذكاء الاصطناعي
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed">
                منصة متطورة لإدارة المشاريع والمحادثات الذكية. استخدم قوة الذكاء الاصطناعي لتحسين إنتاجيتك.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                onClick={() => setLocation("/")}
                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg flex items-center gap-2"
              >
                ابدأ الآن
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button 
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-6 text-lg"
              >
                تعرف على المزيد
              </Button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="space-y-6">
            {/* Feature Card 1 */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">معالجة سريعة</h3>
                  <p className="text-sm text-gray-600 mt-1">استجابة فورية وفعالة</p>
                </div>
              </div>
            </div>

            {/* Feature Card 2 */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Shield className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">آمن تماماً</h3>
                  <p className="text-sm text-gray-600 mt-1">تشفير من الدرجة الأولى</p>
                </div>
              </div>
            </div>

            {/* Feature Card 3 */}
            <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Users className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">تعاون فعال</h3>
                  <p className="text-sm text-gray-600 mt-1">اعمل مع فريقك بسهولة</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-50 py-20 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">المميزات الرئيسية</h2>
            <p className="text-xl text-gray-600">كل ما تحتاجه لإدارة مشاريعك بكفاءة</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Sparkles,
                title: "محادثات ذكية",
                description: "تفاعل مع نظام ذكي يفهم احتياجاتك ويقدم حلولاً فعالة"
              },
              {
                icon: Users,
                title: "التعاون الفعال",
                description: "اعمل مع فريقك بسهولة وتبادل الأفكار والمشاريع"
              },
              {
                icon: Shield,
                title: "أمان عالي",
                description: "بيانات محمية بأعلى معايير الأمان والخصوصية"
              }
            ].map((feature, idx) => (
              <div key={idx} className="p-8 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-lg transition-all">
                <feature.icon className="w-12 h-12 text-blue-600 mb-4" />
                <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="bg-blue-600 rounded-lg p-12 text-center text-white space-y-6">
          <h2 className="text-4xl font-bold">جاهز للبدء؟</h2>
          <p className="text-xl text-blue-100">انضم إلى آلاف المستخدمين الذين يستخدمون AI Factory</p>
          <Button 
            onClick={() => setLocation("/")}
            className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-6 text-lg font-semibold"
          >
            ابدأ الآن مجاناً
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <p className="text-gray-600">© 2024 AI Software Factory. جميع الحقوق محفوظة.</p>
          <div className="flex gap-6">
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">سياسة الخصوصية</a>
            <a href="#" className="text-gray-600 hover:text-gray-900 transition-colors">الشروط والأحكام</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
