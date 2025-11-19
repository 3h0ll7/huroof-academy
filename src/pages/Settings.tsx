import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { primarySections } from "@/lib/navigation";

const Settings = () => {
  const { language, isRTL } = useLanguage();
  const backIcon = isRTL ? <ChevronLeft className="h-5 w-5" /> : <ChevronRight className="h-5 w-5" />;

  return (
    <div className="min-h-screen bg-background text-foreground" dir={isRTL ? "rtl" : "ltr"}>
      <header className="border-b bg-muted/50">
        <div className="container mx-auto flex items-center justify-between px-4 py-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-secondary">
            {backIcon}
            <span>{language === "ar" ? "العودة للرئيسية" : "Back to home"}</span>
          </Link>
          <div className={`flex items-center gap-2 ${isRTL ? "flex-row-reverse" : ""}`}>
            <LanguageToggle />
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto space-y-10 px-4 py-12">
        <section className="max-w-3xl" dir={isRTL ? "rtl" : "ltr"}>
          <p className="text-sm uppercase tracking-[0.4em] text-secondary">
            {language === "ar" ? "لوحة التحكّم" : "Control center"}
          </p>
          <h1 className="mt-2 text-4xl font-black">
            {language === "ar" ? "الإعدادات والتفضيلات" : "Settings & preferences"}
          </h1>
          <p className="mt-4 text-lg text-muted-foreground">
            {language === "ar"
              ? "هنا يمكنك تغيير اللغة، وضع الواجهة، والوصول إلى أقسام الموقع مثل الرئيسية والمزايا والمساعد والبوابات والتواصل."
              : "Use this hub to switch languages, themes, and jump to the main sections such as Home, Features, Assistant, Portals, and Contact."}
          </p>
        </section>

        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {primarySections.map((section) => (
            <article key={section.id} className="flex h-full flex-col justify-between rounded-3xl border border-border/60 bg-card/80 p-6 shadow-sm">
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-[0.3em] text-secondary/70">
                  {language === "ar" ? "قسم" : "Section"}
                </p>
                <h2 className="text-2xl font-semibold">{section.label[language]}</h2>
                <p className="text-sm text-muted-foreground">{section.description[language]}</p>
              </div>
              <a
                href={`/#${section.id}`}
                className="mt-6 inline-flex items-center justify-between rounded-2xl bg-secondary/10 px-4 py-3 text-sm font-semibold text-secondary transition hover:bg-secondary/20"
              >
                <span>{language === "ar" ? "اذهب إلى هذا القسم" : "View section"}</span>
                {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
              </a>
            </article>
          ))}
        </section>
      </main>
    </div>
  );
};

export default Settings;
