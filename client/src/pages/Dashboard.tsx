import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, LogOut, MessageSquare, Copy, Check, Menu, X } from "lucide-react";
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
  const { logout } = useAuth();
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
    onSuccess: () => {
      refetchConversations();
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

  const handleLogout = async () => {
    await logout();
    setLocation("/login");
  };

  const copyToClipboard = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="flex h-screen bg-white">
      {/* Sidebar */}
      <div className={`${sidebarOpen ? "w-64" : "w-0"} transition-all duration-300 border-r border-gray-200 bg-gray-50 flex flex-col overflow-hidden`}>
        {/* Sidebar Header */}
        <div className="p-4 border-b border-gray-200 space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-lg font-bold text-gray-900">AI Chat</h1>
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <Button
            onClick={createNewConversation}
            className="w-full gap-2 bg-blue-600 hover:bg-blue-700 text-white"
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
                      ? "bg-blue-100 border border-blue-300 text-gray-900" 
                      : "hover:bg-gray-200 text-gray-700 border border-transparent"
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
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2 border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="border-b border-gray-200 bg-white p-4 flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="md:hidden text-gray-600 hover:text-gray-900 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
          <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-blue-600" />
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
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-gray-500 text-lg">اختر محادثة أو ابدأ واحدة جديدة!</p>
                  </div>
                </div>
              ) : loadingMessages ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin mx-auto"></div>
                    <p className="text-gray-500">جاري تحميل الرسائل...</p>
                  </div>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <div className="text-center space-y-4">
                    <MessageSquare className="w-16 h-16 text-gray-300 mx-auto" />
                    <p className="text-gray-500 text-lg">لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
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
                        className={`p-4 rounded-lg transition-all duration-200 ${
                          msg.role === "user" 
                            ? "bg-blue-600 text-white shadow-md" 
                            : "bg-gray-100 text-gray-900 border border-gray-200"
                        }`}
                      >
                        <p className="text-sm leading-relaxed">{msg.content}</p>
                        <p className={`text-xs mt-2 opacity-70 ${msg.role === "user" ? "text-blue-100" : "text-gray-600"}`}>
                          {new Date(msg.createdAt).toLocaleTimeString('ar-SA', { hour: '2-digit', minute: '2-digit' })}
                        </p>
                      </Card>
                      {msg.role === "assistant" && (
                        <button
                          onClick={() => copyToClipboard(msg.content, msg.id)}
                          className="mt-2 text-gray-500 hover:text-gray-700 transition-colors opacity-0 group-hover:opacity-100"
                          title="نسخ الرسالة"
                        >
                          {copiedId === msg.id ? (
                            <Check className="w-4 h-4 text-green-600" />
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
        <div className="border-t border-gray-200 p-4 bg-white">
          <form onSubmit={handleSendMessage} className="flex gap-3 max-w-3xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="أدخل رسالتك هنا..."
              disabled={messageMutation.isPending || !currentConversationId}
              className="flex-1 bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all"
            />
            <Button
              type="submit"
              disabled={messageMutation.isPending || !input.trim() || !currentConversationId}
              className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white border-0 transition-all"
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
