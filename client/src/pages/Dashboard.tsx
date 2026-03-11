import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, LogOut, MessageSquare } from "lucide-react";
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

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <div className="w-64 border-r border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <h1 className="text-xl font-bold text-foreground mb-4">نظام إدارة المهام</h1>
          <Button
            onClick={createNewConversation}
            className="w-full gap-2"
            variant="default"
            disabled={createMutation.isPending}
          >
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {loadingConversations ? (
              <p className="text-sm text-center text-muted-foreground">جاري التحميل...</p>
            ) : (
              conversations.map((conv) => (
                <button
                  key={conv.id}
                  onClick={() => setCurrentConversationId(conv.id)}
                  className={`w-full text-right p-3 rounded-lg transition-colors ${
                    currentConversationId === conv.id ? "bg-primary text-primary-foreground" : "hover:bg-muted text-foreground"
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

        <div className="p-4 border-t border-border">
          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full gap-2"
          >
            <LogOut className="w-4 h-4" />
            تسجيل الخروج
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Chat Area */}
        <div className="flex-1 overflow-hidden flex flex-col">
          <ScrollArea className="flex-1 p-6">
            <div className="space-y-4 max-w-2xl mx-auto">
              {!currentConversationId ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>اختر محادثة أو ابدأ واحدة جديدة!</p>
                </div>
              ) : loadingMessages ? (
                <p className="text-center">جاري تحميل الرسائل...</p>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
                </div>
              ) : (
                messages.map((msg: any) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-xs p-4 ${
                        msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.content}</p>
                      <p className="text-xs opacity-70 mt-2">
                        {new Date(msg.createdAt).toLocaleTimeString()}
                      </p>
                    </Card>
                  </div>
                ))
              )}
            </div>
          </ScrollArea>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2 max-w-2xl mx-auto">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="أدخل أمرك هنا..."
              disabled={messageMutation.isPending || !currentConversationId}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={messageMutation.isPending || !input.trim() || !currentConversationId}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">إرسال</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
