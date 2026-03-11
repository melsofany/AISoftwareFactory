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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Background Gradient Orbs */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-red-500/20 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl -z-10"></div>

      <Card className="w-full max-w-lg mx-4 shadow-2xl border border-slate-700/50 bg-slate-800/80 backdrop-blur-xl">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/30 rounded-full blur-2xl animate-pulse"></div>
              <div className="relative w-24 h-24 bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 rounded-full flex items-center justify-center">
                <AlertCircle className="h-12 w-12 text-red-400" />
              </div>
            </div>
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold bg-gradient-to-r from-red-400 to-orange-400 bg-clip-text text-transparent">
              404
            </h1>
            <p className="text-sm text-slate-400 font-semibold">خطأ - الصفحة غير موجودة</p>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-white">
              عذراً، الصفحة المطلوبة غير موجودة
            </h2>
            <p className="text-slate-400 leading-relaxed">
              يبدو أنك حاولت الوصول إلى صفحة لا تعد موجودة. قد تكون تم نقلها أو حذفها.
              <br />
              <span className="text-sm">لا تقلق، يمكنك العودة إلى الصفحة الرئيسية والمتابعة من هناك.</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <p className="text-xs text-slate-300">
              💡 إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGoHome}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white px-6 py-6 rounded-lg transition-all duration-200 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70 border-0 flex items-center justify-center gap-2 group"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              className="border-slate-600 text-slate-300 hover:bg-slate-800 px-6 py-6 rounded-lg transition-all duration-200"
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
