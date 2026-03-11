import { cn } from "@/lib/utils";
import { AlertTriangle, RotateCcw, Copy, Check } from "lucide-react";
import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  copied: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, copied: false };
  }

  static getDerivedStateFromError(error: Error): Omit<State, 'copied'> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("[ErrorBoundary] Caught error:", error);
    console.error("[ErrorBoundary] Error info:", errorInfo);
  }

  handleCopyError = () => {
    const errorText = this.state.error?.stack || this.state.error?.message || "Unknown error";
    navigator.clipboard.writeText(errorText).then(() => {
      this.setState({ copied: true });
      setTimeout(() => this.setState({ copied: false }), 2000);
    });
  };

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error?.message || "حدث خطأ غير متوقع";
      const errorStack = this.state.error?.stack || "";

      return (
        <div className="flex items-center justify-center min-h-screen p-8 bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
          <div className="flex flex-col items-center w-full max-w-2xl p-8 bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl">
            <AlertTriangle
              size={48}
              className="text-red-500 mb-6 flex-shrink-0"
            />

            <h2 className="text-2xl font-bold mb-2 text-white">حدث خطأ غير متوقع</h2>
            <p className="text-gray-300 text-center mb-6">
              يرجى محاولة إعادة تحميل الصفحة أو الاتصال بالدعم الفني إذا استمرت المشكلة
            </p>

            <div className="p-4 w-full rounded-lg bg-slate-800/50 border border-red-500/30 overflow-auto mb-6 max-h-48">
              <div className="flex items-start justify-between mb-2">
                <p className="text-xs text-gray-400 font-semibold">تفاصيل الخطأ:</p>
                <button
                  onClick={this.handleCopyError}
                  className="text-gray-400 hover:text-gray-200 transition-colors"
                  title="نسخ تفاصيل الخطأ"
                >
                  {this.state.copied ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              <pre className="text-xs text-red-300 whitespace-pre-wrap break-words font-mono">
                {errorMessage}
                {errorStack && `\n\n${errorStack}`}
              </pre>
            </div>

            <div className="flex gap-3 w-full">
              <button
                onClick={() => window.location.reload()}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                  "bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
                  "text-white font-semibold cursor-pointer transition-all",
                  "shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
                )}
              >
                <RotateCcw size={16} />
                إعادة تحميل الصفحة
              </button>
              <button
                onClick={() => window.location.href = "/"}
                className={cn(
                  "flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-lg",
                  "bg-white/10 border border-white/20 hover:bg-white/20",
                  "text-gray-300 font-semibold cursor-pointer transition-all"
                )}
              >
                الذهاب للصفحة الرئيسية
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
