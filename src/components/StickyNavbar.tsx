import { motion } from "@/lib/framer-motion-lite";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { Phone } from "lucide-react";
import { PhoneLink } from "@/components/PhoneLink";
import { cn } from "@/lib/utils";

interface StickyNavbarProps {
  sections: { id: string; label: { ar: string; en: string } }[];
  activeSection: string;
}

export const StickyNavbar = ({ sections, activeSection }: StickyNavbarProps) => {
  const { language, isRTL } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, transform: 'translateY(-20px)' }}
      animate={{ opacity: 1, transform: 'translateY(0)' }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-30 backdrop-blur-lg bg-background/80 border-b border-white/10"
    >
      <nav className="container mx-auto flex flex-wrap items-center justify-between gap-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <span className="absolute inset-0 rounded-full bg-secondary/20 blur-xl" aria-hidden />
            <div className="relative h-12 w-12 rounded-2xl bg-gradient-to-br from-primary to-secondary text-white font-bold flex items-center justify-center">
              ح
            </div>
          </div>
          <div className="leading-tight" dir={isRTL ? "rtl" : "ltr"}>
            <p className="text-sm uppercase tracking-widest text-secondary">Huroof AI</p>
            <p className="font-semibold text-lg">
              {language === "ar" ? "مدارس حروف الأهلية" : "Huroof Private Schools"}
            </p>
          </div>
        </div>

        <ul
          className={cn("flex flex-1 flex-wrap items-center gap-2 text-sm font-semibold", isRTL && "flex-row-reverse")}
          aria-label={language === "ar" ? "التنقل بين أقسام الصفحة" : "Navigate sections"}
          dir={isRTL ? "rtl" : "ltr"}
        >
          {sections.map((section) => (
            <li key={section.id}>
              <a
                href={`#${section.id}`}
                className={cn(
                  "rounded-full px-4 py-2 transition-all",
                  "hover:bg-secondary/10",
                  activeSection === section.id
                    ? "bg-secondary text-secondary-foreground shadow"
                    : "text-muted-foreground",
                )}
                aria-current={activeSection === section.id ? "page" : undefined}
                dir={isRTL ? "rtl" : "ltr"}
              >
                {section.label[language]}
              </a>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-1">
          <LanguageToggle />
          <ThemeToggle />
          <PhoneLink
            number="07728881666"
            label={language === "ar" ? "تواصل واتساب" : "WhatsApp"}
            className="hidden sm:inline-flex"
            dir={isRTL ? "rtl" : "ltr"}
          >
            <Phone className={`${isRTL ? "ml-2" : "mr-2"} h-4 w-4`} />
            {language === "ar" ? "تواصل" : "Chat"}
          </PhoneLink>
        </div>
      </nav>
    </motion.header>
  );
};
