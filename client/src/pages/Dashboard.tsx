import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Plus, Send, LogOut, MessageSquare } from "lucide-react";
import { trpc } from "@/lib/trpc";
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

interface Log {
  id: number;
  level: string;
  message: string;
  createdAt: Date;
}

export default function Dashboard() {
  const { logout } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Fetch conversations on mount
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await fetch("/api/conversations");
        if (response.ok) {
          const data = await response.json();
          setConversations(data);
          if (data.length > 0) {
            setCurrentConversation(data[0].id);
            fetchMessages(data[0].id);
          }
        }
      } catch (error) {
        console.error("Failed to fetch conversations:", error);
      }
    };

    fetchConversations();
  }, []);

  // Fetch messages when conversation changes
  useEffect(() => {
    if (currentConversation) {
      fetchMessages(currentConversation);
    }
  }, [currentConversation]);

  const fetchMessages = async (conversationId: number) => {
    try {
      const response = await fetch(`/api/conversations/${conversationId}/messages`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      }
    } catch (error) {
      console.error("Failed to fetch messages:", error);
    }
  };

  const createNewConversation = async () => {
    try {
      const response = await fetch("/api/conversations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: `محادثة جديدة - ${new Date().toLocaleString()}` }),
      });
      if (response.ok) {
        const newConv = await response.json();
        setConversations([newConv, ...conversations]);
        setCurrentConversation(newConv.id);
        setMessages([]);
      }
    } catch (error) {
      console.error("Failed to create conversation:", error);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || !currentConversation || loading) return;

    setLoading(true);
    try {
      const response = await fetch(`/api/conversations/${currentConversation}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (response.ok) {
        setInput("");
        await fetchMessages(currentConversation);
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    localStorage.removeItem("authenticated");
    window.location.href = "/login";
  };

  const isActive = (convId: number) => currentConversation === convId;
  const getButtonClass = (convId: number) => {
    if (isActive(convId)) {
      return "bg-primary text-primary-foreground";
    }
    return "hover:bg-muted text-foreground";
  };

  const getMessageClass = (role: string) => {
    if (role === "user") {
      return "bg-primary text-primary-foreground";
    }
    return "bg-muted text-foreground";
  };

  const getLevelColor = (level: string) => {
    if (level === "error") {
      return "text-red-500";
    }
    if (level === "warning") {
      return "text-yellow-500";
    }
    return "text-green-500";
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
          >
            <Plus className="w-4 h-4" />
            محادثة جديدة
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-2">
            {conversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setCurrentConversation(conv.id)}
                className={`w-full text-right p-3 rounded-lg transition-colors ${getButtonClass(conv.id)}`}
              >
                <div className="flex items-center gap-2 truncate">
                  <MessageSquare className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate text-sm">{conv.title}</span>
                </div>
              </button>
            ))}
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
            <div className="space-y-4 max-w-2xl">
              {messages.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  <p>لا توجد رسائل بعد. ابدأ محادثة جديدة!</p>
                </div>
              ) : (
                messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                  >
                    <Card
                      className={`max-w-xs p-4 ${getMessageClass(msg.role)}`}
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

          {/* Logs Section */}
          <div className="border-t border-border p-4 bg-muted/30 max-h-32">
            <p className="text-xs font-semibold text-muted-foreground mb-2">السجلات</p>
            <ScrollArea className="h-24">
              <div className="space-y-1">
                {logs.map((log) => (
                  <div
                    key={log.id}
                    className="text-xs text-muted-foreground font-mono"
                  >
                    <span className={getLevelColor(log.level)}>
                      [{log.level.toUpperCase()}]
                    </span>{" "}
                    {log.message}
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 bg-card">
          <form onSubmit={handleSendMessage} className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="أدخل أمرك هنا..."
              disabled={loading || !currentConversation}
              className="flex-1"
            />
            <Button
              type="submit"
              disabled={loading || !input.trim() || !currentConversation}
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Execute</span>
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
