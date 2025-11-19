import { useState, useRef, useEffect } from "react";
import { motion } from "@/lib/framer-motion-lite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User, Sparkles } from "lucide-react";
import { streamChat, type Message } from "@/lib/aiChat";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface AIChatProps {
  variant?: "full" | "compact";
}

const quickReplies = [
  {
    ar: "لخص لي درس الماء للصف الثالث",
    en: "Summarize the water cycle for grade 3",
  },
  {
    ar: "اصنع خطة مذاكرة أسبوعية",
    en: "Create a weekly study plan",
  },
  {
    ar: "ساعدني في واجب الرياضيات",
    en: "Help me with algebra homework",
  },
  {
    ar: "اعطني أفكارًا لمشروع علمي",
    en: "Give me ideas for a science project",
  },
];

const AIChat = ({ variant = "full" }: AIChatProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();
  const placeholder =
    language === "ar" ? "اكتب سؤالك أو اطلب نشاطًا إبداعيًا..." : "Ask anything about lessons or creativity...";

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (prefill?: string) => {
    const content = prefill ?? input;
    if (!content.trim() || isLoading) return;

    const userMessage: Message = { role: "user", content: content.trim() };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    let assistantContent = "";
    const updateAssistant = (chunk: string) => {
      assistantContent += chunk;
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === "assistant") {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: assistantContent } : m));
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
            title: language === "ar" ? "خطأ" : "Error",
            description: error.message,
            variant: "destructive",
          });
          setIsLoading(false);
        },
      });
    } catch (error) {
      console.error("Send error:", error);
      toast({
        title: language === "ar" ? "خطأ" : "Error",
        description: language === "ar" ? "حدث خطأ في إرسال الرسالة" : "Message failed to send",
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

  const scrollHeight = variant === "compact" ? "h-[360px]" : "h-[520px]";

  return (
    <Card
      className="w-full shadow-2xl border border-primary/15 backdrop-blur supports-[backdrop-filter]:bg-background/80"
      aria-live="polite"
    >
      <CardHeader className="bg-gradient-to-r from-primary to-navy-light text-white space-y-2">
        <CardTitle className="flex items-center gap-3 text-2xl" dir={isRTL ? "rtl" : "ltr"}>
          <Bot className="w-8 h-8" />
          {language === "ar" ? "حروف الذكي" : "Huroof AI"}
        </CardTitle>
        <CardDescription className="text-white/90" dir={isRTL ? "rtl" : "ltr"}>
          {language === "ar"
            ? "محادثات تفاعلية، ملخصات فورية، وأفكار إبداعية للطلاب والمعلمين"
            : "Interactive answers, instant summaries, and creative prompts for learners"}
        </CardDescription>
        <div className="flex flex-wrap gap-2 text-xs text-white/80" dir={isRTL ? "rtl" : "ltr"}>
          <span className="rounded-full border border-white/30 px-3 py-1">
            {language === "ar" ? "متاح 24/7" : "Available 24/7"}
          </span>
          <span className="rounded-full border border-white/30 px-3 py-1">GPT-4o Mini</span>
          <span className="rounded-full border border-white/30 px-3 py-1">
            {language === "ar" ? "يدعم العربية" : "Arabic ready"}
          </span>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className={`${scrollHeight} p-6`} ref={scrollRef}>
          <div className="space-y-4" role="log" aria-live="polite">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10"
                >
                  <Sparkles className="h-8 w-8 text-secondary" />
                </motion.div>
                <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
                  <p className="text-xl font-semibold text-primary">
                    {language === "ar" ? "مرحباً بك!" : "Welcome!"}
                  </p>
                  <p className="text-muted-foreground">
                    {language === "ar"
                      ? "اختر اقتراحاً أو اكتب سؤالك لبدء المحادثة"
                      : "Pick a suggestion or type your question to begin"}
                  </p>
                </div>
              </div>
            )}

            {messages.map((msg, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, transform: 'translateY(16px)' }}
                animate={{ opacity: 1, transform: 'translateY(0)' }}
                style={{ display: 'flex', gap: '0.75rem', flexDirection: msg.role === "user" ? 'row-reverse' : 'row' }}
              >
                <div
                  className={`flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full ${
                    msg.role === "user" ? "bg-secondary" : "bg-primary"
                  }`}
                >
                  {msg.role === "user" ? <User className="h-5 w-5 text-white" /> : <Bot className="h-5 w-5 text-white" />}
                </div>
                <div
                  className={`flex-1 rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.role === "user" ? "bg-secondary/10" : "bg-muted"
                  }`}
                  dir={isRTL ? "rtl" : "ltr"}
                >
                  {msg.content}
                </div>
              </motion.div>
            ))}

            {isLoading && (
              <div className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary">
                  <Bot className="h-5 w-5 text-white" />
                </div>
                <div className="flex flex-1 items-center rounded-2xl bg-muted px-4 py-3">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                  <span className="ml-3 text-sm text-muted-foreground">
                    {language === "ar" ? "يكتب الإجابة..." : "Crafting a response..."}
                  </span>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="space-y-3 border-t p-4">
          <div className="flex gap-2" dir={isRTL ? "rtl" : "ltr"}>
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className={`flex-1 ${isRTL ? "text-right" : "text-left"}`}
              dir={isRTL ? "rtl" : "ltr"}
            />
            <Button
              onClick={() => sendMessage()}
              disabled={isLoading || !input.trim()}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex flex-wrap gap-2" dir={isRTL ? "rtl" : "ltr"}>
            {quickReplies.map((suggestion, index) => (
              <Button
                key={`${suggestion.ar}-${index}`}
                variant="outline"
                size="sm"
                className="h-auto rounded-full border-dashed px-3 py-1 text-xs"
                onClick={() => (variant === "compact" ? sendMessage(suggestion[language]) : setInput(suggestion[language]))}
                disabled={isLoading}
              >
                {suggestion[language]}
              </Button>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIChat;
