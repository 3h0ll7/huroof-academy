import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User } from "lucide-react";
import { streamChat, type Message } from "@/lib/aiChat";
import { useToast } from "@/hooks/use-toast";

const AIChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: input.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) =>
            i === prev.length - 1 ? { ...m, content: assistantContent } : m
          );
        }
        return [...prev, { role: "assistant", content: assistantContent }];
      });
    };

    try {
      await streamChat({
        messages: [...messages, userMessage],
        onDelta: updateAssistant,
        onDone: () => setIsLoading(false),
        onError: (error) => {
          toast({
            title: "خطأ",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Send error:", error);
      toast({
        title: "خطأ",
        description: "حدث خطأ في إرسال الرسالة",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-2xl border-2 border-primary/20">
      <CardHeader className="bg-gradient-to-r from-primary to-navy-light text-white">
        <CardTitle className="text-2xl flex items-center gap-3" dir="rtl">
          <Bot className="w-8 h-8" />
          حروف الذكي - مساعدك التعليمي
        </CardTitle>
        <p className="text-sm text-white/80" dir="rtl">
          اسأل أي سؤال تعليمي وسأساعدك في فهمه وحله
        </p>
      </CardHeader>
      
      <CardContent className="p-0">
        <ScrollArea className="h-[500px] p-6" ref={scrollRef}>
          <div className="space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-12 space-y-4">
                <Bot className="w-16 h-16 mx-auto text-primary opacity-50" />
                <div className="space-y-2" dir="rtl">
                  <p className="text-xl font-semibold text-primary">
                    مرحباً بك في حروف الذكي!
                  </p>
                  <p className="text-muted-foreground">
                    أنا هنا لمساعدتك في جميع المواد الدراسية
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-8 max-w-2xl mx-auto">
                  {[
                    "ساعدني في حل مسألة رياضيات",
                    "اشرح لي مفهوم الجاذبية",
                    "أعطني نصائح للمذاكرة",
                    "ساعدني في كتابة موضوع تعبير",
                  ].map((suggestion, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="text-sm h-auto py-3 px-4 text-right justify-start"
                      onClick={() => setInput(suggestion)}
                      dir="rtl"
                    >
                      {suggestion}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex gap-3 ${
                  msg.role === "user" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <div
                  className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                    msg.role === "user"
                      ? "bg-secondary"
                      : "bg-primary"
                  }`}
                >
                  {msg.role === "user" ? (
                    <User className="w-5 h-5 text-white" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>
                <div
                  className={`flex-1 rounded-2xl px-4 py-3 ${
                    msg.role === "user"
                      ? "bg-secondary/10 text-right"
                      : "bg-muted text-right"
                  }`}
                  dir="rtl"
                >
                  <p className="whitespace-pre-wrap leading-relaxed">
                    {msg.content}
                  </p>
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role === "user" && (
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                <div className="flex-1 rounded-2xl px-4 py-3 bg-muted">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="border-t p-4">
          <div className="flex gap-2" dir="rtl">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="اكتب سؤالك هنا..."
              disabled={isLoading}
              className="flex-1 text-right"
              dir="rtl"
            />
            <Button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
