import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, LogOut, MessageSquare, Trash2, Edit2, Copy, Check, Sparkles, Menu, X } from "lucide-react";
import { trpc } from "@/lib/trpc";
import { useLocation } from "wouter";

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
  const [currentConversationId, setCurrentConversationId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);

  // Use tRPC hooks instead of direct fetch
  const { data: conversations = [], isLoading: loadingConversations, refetch: refetchConversations } = trpc.conversations.list.useQuery();
  const { data: messages = [], isLoading: loadingMessages } = trpc.conversations.getMessages.useQuery(
    { conversationId: currentConversationId! },
    { enabled: !!currentConversationId }
  );

  const createMutation = trpc.conversations.create.useMutation({
    onSuccess: (newConv) => {
      refetchConversations();
      if (newConv) {
        // Handle result structure based on db.insert return
        // Since drizzle insert often returns an array or object with row info
        // We'll assume we need to find the new ID or just refetch
      }
    }
  });

  const messageMutation = trpc.conversations.addMessage.useMutation({
    onSuccess: () => {
      setInput("");
    }
  });

  // Set initial conversation
  useEffect(() => {
    if (conversations.length > 0 && !currentConversationId) {
      setCurrentConversationId(conversations[0].id);
    }
  }, [conversations, currentConversationId]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversationId || messageMutation.isPending) return;
    
    await messageMutation.mutateAsync({
      conversationId: currentConversationId,
      content: input
    });
  };

  const createNewConversation = async () => {
    await createMutation.mutateAsync({
      title: `محادثة جديدة - ${new Date().toLocaleString()}`
    });
  };

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    setLocation("/login");
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-slate-700/50 bg-slate-900/80 backdrop-blur-xl flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-slate-700/50 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-blue-400" />
              AI Chat
            </h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={createNewConversation}
            className="w-full gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-0"
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
              <p className="text-sm text-center text-slate-400 py-4">جاري التحميل...</p>
            ) : conversations.length === 0 ? (
              <p className="text-sm text-center text-slate-400 py-4">لا توجد محادثات بعد</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversationId(conv.id)}
                  className={`w-full text-right p-3 rounded-lg transition-all duration-200 group ${
                    currentConversationId === conv.id 
                      ? "bg-gradient-to-r from-blue-500/30 to-cyan-500/30 border border-blue-500/50 text-white shadow-lg shadow-blue-500/20" 
                      : "hover:bg-slate-800/50 text-slate-300 border border-transparent"
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
        <div className="p-4 border-t border-slate-700/50 space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2 border-slate-600 text-slate-300 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-slate-700/50 bg-slate-900/80 backdrop-blur-xl p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-slate-400 hover:text-white transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-blue-400" />
            {currentConversationId ? "محادثة ذكية" : "اختر محادثة"}
          </h2>
          <div className="w-6"></div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-3xl mx-auto">
              {!currentConversationId ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                      <Sparkles className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-lg">اختر محادثة أو ابدأ واحدة جديدة!</p>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-slate-600 border-t-blue-500 rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-400">جاري تحميل الرسائل...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
                      <MessageSquare className="w-10 h-10 text-blue-400" />
                    </div>
                    <p className="text-slate-400 text-lg">لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
                  </div>
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
                  >
                    <div className={`group max-w-md lg:max-w-lg`}>
                      <Card
                        className={`p-4 rounded-2xl transition-all duration-200 ${
                          msg.role === "user" 
                            ? "bg-gradient-to-br from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50" 
                            : "bg-slate-800/50 border border-slate-700/50 text-slate-100 hover:border-slate-600/50"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${msg.role === "user" ? "text-blue-100" : "text-slate-400"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </Card>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="mt-2 text-slate-500 hover:text-slate-300 transition-colors opacity-0 group-hover:opacity-100"
                          title="نسخ الرسالة"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-green-400" />
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
        <div className="border-t border-slate-700/50 p-4 bg-slate-900/80 backdrop-blur-xl">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
            <div className="flex-1 relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-lg blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="أدخل رسالتك هنا..."
                disabled={messageMutation.isPending || !currentConversationId}
                className="relative w-full bg-slate-800/50 border border-slate-700/50 text-white placeholder-slate-500 focus:border-blue-500 focus:ring-blue-500/20 transition-all duration-300"
              />
            </div>
            <Button
              type="submit"
              disabled={messageMutation.isPending || !input.trim() || !currentConversationId}
              className="bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-slate-600 disabled:to-slate-600 text-white border-0 transition-all duration-300 shadow-lg shadow-blue-500/50 hover:shadow-blue-500/70"
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
