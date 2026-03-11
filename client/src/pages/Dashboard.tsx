import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, LogOut, MessageSquare, Copy, Check, Menu, X, Sparkles, AlertTriangle } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

interface Message {
  id: number;
  role: "user" | "assistant";
  content: string;
  createdAt: Date;
}

interface Conversation {
  id: number;
  title: string;
  updatedAt: Date;
}

export default function Dashboard() {
  const [, setLocation] = useLocation();
  const { logout, user, loading: authLoading, error: authError } = useAuth({ redirectOnUnauthenticated: true });
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [dashboardError, setDashboardError] = useState<string | null>(null);

  // Use tRPC hooks instead of direct fetch
  const { 
    data: conversations = [], 
    isLoading: loadingConversations, 
    refetch: refetchConversations,
    error: conversationsError 
  } = trpc.conversations.list.useQuery(undefined, {
    retry: 2,
    retryDelay: 1000,
  });
  
  const { 
    data: messages = [], 
    isLoading: loadingMessages,
    error: messagesError 
  } = trpc.conversations.getMessages.useQuery(
    { conversationId: currentConversationId! },
    { 
      enabled: !!currentConversationId,
      retry: 2,
      retryDelay: 1000,
    }
  );

  const createMutation = trpc.conversations.create.useMutation({
    onSuccess: () => {
      setDashboardError(null);
      refetchConversations();
    },
    onError: (error) => {
      setDashboardError(`خطأ في إنشاء محادثة: ${error.message}`);
    }
  });

  const messageMutation = trpc.conversations.addMessage.useMutation({
    onSuccess: () => {
      setInput("");
      setDashboardError(null);
    },
    onError: (error) => {
      setDashboardError(`خطأ في إرسال الرسالة: ${error.message}`);
    }
  });

  // Handle errors
  useEffect(() => {
    if (conversationsError) {
      setDashboardError(`خطأ في تحميل المحادثات: ${conversationsError.message}`);
    }
  }, [conversationsError]);

  useEffect(() => {
    if (messagesError) {
      setDashboardError(`خطأ في تحميل الرسائل: ${messagesError.message}`);
    }
  }, [messagesError]);

  // Set initial conversation
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId || messageMutation.isPending) return;
    
    try {
      await messageMutation.mutateAsync({
        conversationId: currentConversationId,
        content: input
      });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      await createMutation.mutateAsync({
        title: `محادثة جديدة - ${new Date().toLocaleString('ar-SA')}`
      });
    } catch (error) {
      console.error("Error creating conversation:", error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      setLocation("/login");
    } catch (error) {
      console.error("Error logging out:", error);
      setLocation("/login");
    }
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Show loading state while checking authentication
  if (authLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="text-gray-400">جاري التحميل...</p>
        </div>
      </div>
    );
  }

  // Show error if authentication failed
  if (authError || !user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-md text-center space-y-4">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto" />
          <h2 className="text-xl font-bold text-white">خطأ في المصادقة</h2>
          <p className="text-gray-400">{authError?.message || "حدث خطأ في المصادقة"}</p>
          <Button
            onClick={() => setLocation("/login")}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            العودة إلى تسجيل الدخول
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-white/10 bg-slate-950/80 backdrop-blur-xl flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-white/10 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Chat
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={createNewConversation}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0 shadow-lg shadow-blue-500/50"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>

        {/* Conversations List */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {loadingConversations ? (
              <p className="text-sm text-center text-gray-500 py-4">جاري التحميل...</p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-center text-gray-500 py-4">لا توجد محادثات بعد</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversationId(conv.id)}
                  className={`w-full text-right p-3 rounded-lg transition-all duration-200 ${
                    currentConversationId === conv.id 
                      ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-500/50 text-white shadow-lg shadow-blue-500/20" 
                      : "hover:bg-white/10 text-gray-300 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <MessageSquare className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate text-sm">{conv.title}</span>
                  </div>
                </button>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-white/10 space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2 border-white/20 text-gray-300 hover:bg-white/10 hover:text-white"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-white/10 bg-slate-950/80 backdrop-blur-xl p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            {currentConversationId ? "محادثة ذكية" : "اختر محادثة"}
          </h2>
          <div className="w-6"></div>
        </div>

        {/* Error Message */}
        {dashboardError && (
          <div className="bg-red-500/20 border-b border-red-500/50 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-300">{dashboardError}</p>
            </div>
            <button
              onClick={() => setDashboardError(null)}
              className="text-red-400 hover:text-red-300"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-3xl mx-auto">
              {!currentConversationId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/30 to-cyan-500/30 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-gray-400 text-lg">اختر محادثة أو ابدأ واحدة جديدة!</p>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-400">جاري تحميل الرسائل...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-16 h-16 text-gray-600 mx-auto" />
                    <p className="text-gray-400 text-lg">لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <div className={`group max-w-md lg:max-w-lg`}>
                      <Card
                        className={`p-4 rounded-2xl transition-all duration-200 ${
                          msg.role === "user" 
                            ? "bg-gradient-to-br from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50" 
                            : "bg-white/10 border border-white/20 text-gray-100 hover:border-white/30 backdrop-blur-sm"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${msg.role === "user" ? "text-blue-100" : "text-gray-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </Card>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="mt-2 text-gray-600 hover:text-gray-400 transition-colors opacity-0 group-hover:opacity-100"
                          title="نسخ الرسالة"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-green-500" />
                          ) : (
                            <Copy className="w-4 h-4" />
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-white/10 p-4 bg-slate-950/80 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-focus-within:opacity-100 transition-opacity duration-300"></div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="أدخل رسالتك هنا..."
                disabled={messageMutation.isPending || !currentConversationId}
                className="relative w-full bg-white/5 border border-white/20 text-white placeholder-gray-500 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all"
              />
            </div>
            <Button
              type="submit"
              disabled={messageMutation.isPending || !input.trim() || !currentConversationId}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-gray-600 disabled:to-gray-600 text-white border-0 transition-all shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
            >
              {messageMutation.isPending ? (
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <Send className="w-5 h-5" />
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
