import { Button } from "@/components/ui/button";
import { useLanguage } from "@/context/LanguageContext";
import { Languages } from "lucide-react";

export const LanguageToggle = () => {
  const { language, toggleLanguage, isRTL } = useLanguage();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      aria-label={language === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className="gap-2 font-semibold"
    >
      <Languages className="h-4 w-4" />
      <span className="text-xs" dir={isRTL ? "rtl" : "ltr"}>
        {language === "ar" ? "عربي" : "English"}
      </span>
    </Button>
  );
};
