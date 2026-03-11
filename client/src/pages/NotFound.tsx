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
    <div className="min-h-screen w-full flex items-center justify-center bg-white px-4">
      <Card className="w-full max-w-lg shadow-lg border border-gray-200 bg-white">
        <CardContent className="pt-12 pb-12 text-center space-y-8">
          {/* Error Icon */}
          <div className="flex justify-center">
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <AlertCircle className="h-12 w-12 text-red-600" />
            </div>
          </div>

          {/* Error Code */}
          <div className="space-y-2">
            <h1 className="text-7xl font-bold text-red-600">404</h1>
            <p className="text-sm text-gray-600 font-semibold">خطأ - الصفحة غير موجودة</p>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-900">
              عذراً، الصفحة المطلوبة غير موجودة
            </h2>
            <p className="text-gray-600 leading-relaxed">
              يبدو أنك حاولت الوصول إلى صفحة لا تعد موجودة. قد تكون تم نقلها أو حذفها.
              <br />
              <span className="text-sm">لا تقلق، يمكنك العودة إلى الصفحة الرئيسية والمتابعة من هناك.</span>
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-xs text-gray-700">
              💡 إذا كنت تعتقد أن هذا خطأ، يرجى التواصل مع فريق الدعم
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
            <Button
              onClick={handleGoHome}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-6 rounded-lg transition-all flex items-center justify-center gap-2"
            >
              <Home className="w-5 h-5" />
              العودة للرئيسية
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-6 rounded-lg transition-all"
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
