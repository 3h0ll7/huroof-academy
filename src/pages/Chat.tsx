import AIChat from "@/components/AIChat";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/huroof-logo.jpg";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { PhoneLink } from "@/components/PhoneLink";

const Chat = () => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <header className="sticky top-0 z-10 border-b bg-white/60 backdrop-blur">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Huroof" className="h-12 w-12 rounded-full border-2 border-primary/20 object-cover" />
            <div dir={isRTL ? "rtl" : "ltr"}>
              <h1 className="text-xl font-bold text-primary">
                {language === "ar" ? "مدارس حروف الأهلية" : "Huroof Private Schools"}
              </h1>
              <p className="text-xs text-muted-foreground">
                {language === "ar" ? "حروف الذكي" : "Huroof Assistant"}
              </p>
            </div>
          </Link>
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link to="/">
              <Button variant="outline" dir={isRTL ? "rtl" : "ltr"}>
                <ArrowRight className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
                {language === "ar" ? "العودة للرئيسية" : "Back home"}
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-8 px-4 py-12">
        <AIChat />
        <div className="rounded-3xl border border-dashed border-primary/30 bg-primary/5 p-6" dir={isRTL ? "rtl" : "ltr"}>
          <p className="text-sm font-semibold text-secondary">
            {language === "ar" ? "قنوات تواصل" : "Stay connected"}
          </p>
          <div className="mt-4 flex flex-wrap gap-3">
            <PhoneLink number="07728881666" label="07728881666" dir={isRTL ? "rtl" : "ltr"} />
            <PhoneLink number="07833446666" label="07833446666" className="bg-white text-secondary" dir={isRTL ? "rtl" : "ltr"} />
          </div>
        </div>
      </main>

      <footer className="py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-sm text-muted-foreground" dir={isRTL ? "rtl" : "ltr"}>
            {language === "ar"
              ? "💡 نصيحة: يمكنك سؤال حروف الذكي عن أي مادة دراسية أو مفهوم تعليمي"
              : "💡 Tip: Ask Huroof AI about any subject or concept"}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
