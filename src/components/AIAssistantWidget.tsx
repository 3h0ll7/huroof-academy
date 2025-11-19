import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { useLocation } from "react-router-dom";

export const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const location = useLocation();

  if (location.pathname === "/chat") {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="w-[min(380px,90vw)]"
          >
            <AIChat variant="compact" />
          </motion.div>
        )}
      </AnimatePresence>

      <Button
        size="lg"
        className="h-14 w-14 rounded-full bg-secondary text-white shadow-2xl hover:scale-105"
        onClick={() => setIsOpen((prev) => !prev)}
        aria-expanded={isOpen}
        aria-label={language === "ar" ? "افتح مساعد حروف" : "Open Huroof assistant"}
      >
        {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
      </Button>
      {!isOpen && (
        <motion.span
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-full bg-background/80 px-4 py-2 text-sm shadow-lg"
        >
          {language === "ar" ? "جرّب مساعدنا الذكي" : "Try our AI guide"}
        </motion.span>
      )}
    </div>
  );
};
