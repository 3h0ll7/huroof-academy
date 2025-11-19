import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { PlusCircle, Trash2, History, Sparkles } from "lucide-react";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useChatHistory } from "@/hooks/useChatHistory";
import type { Message } from "@/lib/aiChat";

const Dashboard = () => {
  const { language, isRTL } = useLanguage();
  const { user } = useAuth();
  const { conversations, createConversation, upsertConversation, removeConversation } = useChatHistory(user?.id);
  const [activeConversationId, setActiveConversationId] = useState<string | null>(null);

  useEffect(() => {
    if (!activeConversationId && conversations.length) {
      setActiveConversationId(conversations[0].id);
    }
  }, [conversations, activeConversationId]);

  const activeConversation = useMemo(() => conversations.find((conversation) => conversation.id === activeConversationId), [
    conversations,
    activeConversationId,
  ]);

  const handleMessagesChange = (messages: Message[]) => {
    if (!activeConversationId) return;
    upsertConversation(activeConversationId, messages);
  };

  const handleStartConversation = () => {
    const conversation = createConversation(language === "ar" ? "محادثة جديدة" : "New conversation");
    setActiveConversationId(conversation.id);
  };

  const hasConversations = conversations.length > 0;

  return (
    <div className="min-h-screen bg-muted/40" dir={isRTL ? "rtl" : "ltr"}>
      <div className="container mx-auto flex flex-col gap-6 py-10 lg:flex-row">
        <aside className="w-full lg:w-72">
          <Card className="h-full border border-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-base">
                <History className="h-4 w-4" />
                {language === "ar" ? "سجل المحادثات" : "Chat history"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button className="w-full gap-2" onClick={handleStartConversation}>
                <PlusCircle className="h-4 w-4" />
                {language === "ar" ? "محادثة جديدة" : "New chat"}
              </Button>
              <ScrollArea className="h-[420px] pr-3">
                <div className="space-y-2">
                  {!hasConversations && (
                    <div className="rounded-xl border border-dashed border-muted-foreground/40 px-4 py-6 text-center text-sm text-muted-foreground">
                      {language === "ar" ? "لا يوجد سجل بعد" : "No history yet"}
                    </div>
                  )}
                  {conversations.map((conversation) => (
                    <button
                      type="button"
                      key={conversation.id}
                      onClick={() => setActiveConversationId(conversation.id)}
                      className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                        conversation.id === activeConversationId
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border hover:bg-muted"
                      }`}
                    >
                      <span className="line-clamp-1">{conversation.title}</span>
                      <Trash2
                        className="h-4 w-4 text-destructive"
                        onClick={(event) => {
                          event.stopPropagation();
                          removeConversation(conversation.id);
                          if (conversation.id === activeConversationId) {
                            setActiveConversationId(null);
                          }
                        }}
                      />
                    </button>
                  ))}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </aside>

        <section className="flex-1 space-y-6">
          <div className="rounded-3xl bg-gradient-to-r from-primary to-secondary p-6 text-white shadow-xl">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-1">
                <p className="text-sm uppercase tracking-widest text-white/70">
                  {language === "ar" ? "مرحباً" : "Welcome"} {user?.email}
                </p>
                <h1 className="text-3xl font-bold">{language === "ar" ? "لوحة حروف AI" : "Huroof AI Dashboard"}</h1>
                <p className="text-white/80">
                  {language === "ar"
                    ? "استفد من مساعد الذكاء الاصطناعي، وارفع الصور أو ملفات PDF لتحليلها"
                    : "Chat with the AI assistant, upload images or PDFs for instant analysis."}
                </p>
              </div>
              <Sparkles className="h-16 w-16 text-white/80" />
            </div>
          </div>

          <AIChat
            key={activeConversationId ?? "empty"}
            variant="full"
            initialMessages={activeConversation?.messages ?? []}
            onMessagesChange={handleMessagesChange}
            enablePdfUpload
          />
        </section>
      </div>
    </div>
  );
};

export default Dashboard;
