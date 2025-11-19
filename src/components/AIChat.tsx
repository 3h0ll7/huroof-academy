import { useState, useRef, useEffect, useCallback } from "react";
import { motion } from "@/lib/framer-motion-lite";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send, Loader2, Bot, User, Sparkles, ImagePlus, FileUp } from "lucide-react";
import { streamChat, type Message, type Attachment } from "@/lib/aiChat";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/context/LanguageContext";

interface AIChatProps {
  variant?: "full" | "compact";
  initialMessages?: Message[];
  onMessagesChange?: (messages: Message[]) => void;
  enablePdfUpload?: boolean;
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

const AIChat = ({ variant = "full", initialMessages, onMessagesChange, enablePdfUpload = false }: AIChatProps) => {
  const [messages, setMessagesState] = useState<Message[]>(initialMessages ?? []);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const pdfInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { language, isRTL } = useLanguage();
  const placeholder =
    language === "ar" ? "اكتب سؤالك أو اطلب نشاطًا إبداعيًا..." : "Ask anything about lessons or creativity...";
  const uploadLabel = language === "ar" ? "ارفع صورة" : "Upload image";
  const pdfLabel = language === "ar" ? "رفع PDF" : "Upload PDF";

  useEffect(() => {
    if (initialMessages !== undefined) {
      setMessagesState(initialMessages);
    }
  }, [initialMessages]);

  const setMessages = useCallback(
    (value: Message[] | ((prev: Message[]) => Message[])) => {
      setMessagesState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        onMessagesChange?.(next);
        return next;
      });
    },
    [onMessagesChange],
  );

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const sendMessage = async (prefill?: string, attachments?: Attachment[]) => {
    if (isLoading) return;
    const content = (prefill ?? input).trim();
    if (!content && !attachments?.length) return;

    const userMessage: Message = {
      role: "user",
      content: content || (language === "ar" ? "حلل هذه الصورة" : "Analyze this image"),
      ...(attachments?.length ? { attachments } : {}),
    };
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

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const file = inputElement.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast({
        title: language === "ar" ? "ملف غير مدعوم" : "Unsupported file",
        description: language === "ar" ? "يُسمح فقط برفع صور بصيغة ‎JPG/PNG‎" : "Only JPG/PNG images are allowed.",
        variant: "destructive",
      });
      inputElement.value = "";
      return;
    }

    const maxSize = 8 * 1024 * 1024; // 8 MB
    if (file.size > maxSize) {
      toast({
        title: language === "ar" ? "الصورة كبيرة جداً" : "Image too large",
        description:
          language === "ar"
            ? "يرجى اختيار صورة أصغر من 8 ميغابايت"
            : "Please choose an image smaller than 8 MB.",
        variant: "destructive",
      });
      inputElement.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const prompt =
        language === "ar"
          ? "حلل هذه الصورة واذكر أبرز الملاحظات التعليمية"
          : "Analyze this image and share the most relevant learning insights";
      const attachment: Attachment = {
        type: "image",
        dataUrl,
        mimeType: file.type,
        name: file.name,
      };
      sendMessage(prompt, [attachment]);
      inputElement.value = "";
    };
    reader.onerror = () => {
      toast({
        title: language === "ar" ? "تعذر قراءة الملف" : "File error",
        description:
          language === "ar" ? "حدث خطأ أثناء تحميل الصورة" : "An error occurred while uploading the image.",
        variant: "destructive",
      });
      inputElement.value = "";
    };
    reader.readAsDataURL(file);
  };

  const handlePdfUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const inputElement = event.target;
    const file = inputElement.files?.[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast({
        title: language === "ar" ? "صيغة غير مدعومة" : "Unsupported file",
        description: language === "ar" ? "يُسمح فقط برفع ملفات PDF" : "Only PDF files are allowed",
        variant: "destructive",
      });
      inputElement.value = "";
      return;
    }

    const maxSize = 12 * 1024 * 1024;
    if (file.size > maxSize) {
      toast({
        title: language === "ar" ? "الملف كبير جداً" : "File is too large",
        description: language === "ar" ? "يرجى اختيار ملف أصغر من 12 ميغابايت" : "Choose a file smaller than 12 MB",
        variant: "destructive",
      });
      inputElement.value = "";
      return;
    }

    try {
      const rawText = await file.text();
      const normalized = rawText.replace(/[^\x20-\x7E\u0600-\u06FF\n]/g, " ");
      const excerpt = normalized.replace(/\s+/g, " ").slice(0, 600).trim();
      const safeExcerpt =
        excerpt ||
        (language === "ar"
          ? `اسم الملف: ${file.name}. قم بتقديم ملخص للمحتوى المتوقع.`
          : `File name: ${file.name}. Provide an educated summary based on expected content.`);
      const prompt =
        language === "ar"
          ? `حلل ملف PDF التالي وقدم أبرز النقاط:
${safeExcerpt}`
          : `Analyze the following PDF and summarize the key ideas:
${safeExcerpt}`;
      const attachment: Attachment = {
        type: "document",
        name: file.name,
        mimeType: file.type,
        excerpt: safeExcerpt,
      };
      await sendMessage(prompt, [attachment]);
    } catch (error) {
      console.error(error);
      toast({
        title: language === "ar" ? "تعذر قراءة الملف" : "File error",
        description: language === "ar" ? "حدث خطأ أثناء تحليل ملف PDF" : "PDF parsing failed",
        variant: "destructive",
      });
    } finally {
      inputElement.value = "";
    }
  };

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
                  {msg.content && <p>{msg.content}</p>}
                  {msg.attachments?.map((attachment, index) => {
                    if (attachment.type === "image" && attachment.dataUrl) {
                      return (
                        <div
                          key={`${attachment.name ?? "image"}-${index}`}
                          className="mt-3 overflow-hidden rounded-xl border border-border/50 bg-background/60"
                        >
                          <img src={attachment.dataUrl} alt={attachment.name ?? "uploaded"} className="h-full w-full object-cover" />
                          {attachment.name && (
                            <p className="px-3 py-2 text-xs text-muted-foreground">{attachment.name}</p>
                          )}
                        </div>
                      );
                    }
                    if (attachment.type === "document") {
                      return (
                        <div
                          key={`${attachment.name ?? "document"}-${index}`}
                          className="mt-3 rounded-xl border border-dashed border-border/60 bg-background/80 p-4 text-xs text-muted-foreground"
                        >
                          <p className="font-semibold text-foreground">{attachment.name ?? "PDF"}</p>
                          {attachment.excerpt && <p className="mt-2 line-clamp-3">{attachment.excerpt}</p>}
                        </div>
                      );
                    }
                    return null;
                  })}
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
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg"
            className="hidden"
            onChange={handleImageUpload}
          />
          {enablePdfUpload && (
            <input ref={pdfInputRef} type="file" accept="application/pdf" className="hidden" onChange={handlePdfUpload} />
          )}
          <div className="flex flex-wrap gap-2" dir={isRTL ? "rtl" : "ltr"}>
            <Button
              type="button"
              variant="outline"
              className="flex items-center gap-2 rounded-full border-dashed px-3 py-2 text-sm"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              <ImagePlus className="h-4 w-4" />
              {uploadLabel}
            </Button>
            {enablePdfUpload && (
              <Button
                type="button"
                variant="outline"
                className="flex items-center gap-2 rounded-full border-dashed px-3 py-2 text-sm"
                onClick={() => pdfInputRef.current?.click()}
                disabled={isLoading}
              >
                <FileUp className="h-4 w-4" />
                {pdfLabel}
              </Button>
            )}
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              disabled={isLoading}
              className={`min-w-0 flex-1 ${isRTL ? "text-right" : "text-left"}`}
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
