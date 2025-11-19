import { motion } from "@/lib/framer-motion-lite";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useLanguage } from "@/context/LanguageContext";
import { Phone, Settings2 } from "lucide-react";
import { PhoneLink } from "@/components/PhoneLink";
import { Link } from "react-router-dom";

export const StickyNavbar = () => {
  const { language, isRTL } = useLanguage();

  return (
    <motion.header
      initial={{ opacity: 0, transform: 'translateY(-20px)' }}
      animate={{ opacity: 1, transform: 'translateY(0)' }}
      transition={{ duration: 0.6 }}
      className="sticky top-0 z-30 backdrop-blur-lg bg-background/80 border-b border-white/10"
    >
      <nav className="container mx-auto flex flex-wrap items-center justify-between gap-4 py-4" dir={isRTL ? "rtl" : "ltr"}>
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

        <div className={`flex items-center gap-1 ${isRTL ? "flex-row-reverse" : ""}`}>
          <Link
            to="/settings"
            className="inline-flex items-center gap-2 rounded-full border border-secondary/40 px-4 py-2 text-sm font-semibold text-secondary hover:bg-secondary/10"
          >
            <Settings2 className="h-4 w-4" />
            <span>{language === "ar" ? "الإعدادات" : "Settings"}</span>
          </Link>
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
