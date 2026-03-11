import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle, Home, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";

export default function NotFound() {
  const [, setLocation] = useLocation();

  const handleGoHome = () => {
    setLocation("/");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 relative overflow-hidden px-4">
      {/* Background Elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/20 rounded-full blur-3xl opacity-20"></div>
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-orange-600/20 rounded-full blur-3xl opacity-20"></div>

      <Card className="w-full max-w-lg shadow-2xl border border-white/20 bg-white/10 backdrop-blur-xl relative z-10">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/50 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-sm text-gray-400 font-semibold">خطأ - الصفحة غير موجودة</p>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              عذراً، الصفحة المطلوبة غير موجودة
            </h2>
            <p className="text-gray-400 leading-relaxed">
              يبدو أنك حاولت الوصول إلى صفحة لا تعد موجودة. قد تكون تم نقلها أو حذفها.
              <br />
              <span className="text-sm">لا تقلق، يمكنك العودة إلى الصفحة الرئيسية والمتابعة من هناك.</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/20 border border-blue-500/50 rounded-lg p-4 backdrop-blur-sm">
            <p className="text-xs text-gray-300">
              💡 إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-6 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 border-0"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-white/20 text-gray-300 hover:bg-white/10 hover:text-white px-6 py-6 rounded-lg transition-all"
              onClick={() => window.history.back()}
            >
              العودة للخلف
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
