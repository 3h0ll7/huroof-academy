import { createContext, useContext, useEffect, useMemo, useState } from "react";

export type SupportedLanguage = "ar" | "en";

interface LanguageContextValue {
  language: SupportedLanguage;
  isRTL: boolean;
  toggleLanguage: () => void;
  setLanguage: (lang: SupportedLanguage) => void;
}

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);

const getInitialLanguage = (): SupportedLanguage => {
  if (typeof window === "undefined") return "ar";
  const stored = window.localStorage.getItem("huroof-lang") as SupportedLanguage | null;
  if (stored) return stored;
  const browser = window.navigator.language?.toLowerCase() ?? "ar";
  return browser.startsWith("ar") ? "ar" : "en";
};

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [language, setLanguage] = useState<SupportedLanguage>(getInitialLanguage);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const rtl = language === "ar";
    document.documentElement.lang = rtl ? "ar" : "en";
    document.documentElement.dir = rtl ? "rtl" : "ltr";
    window.localStorage.setItem("huroof-lang", language);
  }, [language]);

  const value = useMemo(
    () => ({
      language,
      isRTL: language === "ar",
      toggleLanguage: () => setLanguage((prev) => (prev === "ar" ? "en" : "ar")),
      setLanguage,
    }),
    [language],
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within LanguageProvider");
  }
  return context;
};
