import { useState } from "react";
import { AnimatePresence, motion } from "@/lib/framer-motion-lite";
import { MessageCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import AIChat from "@/components/AIChat";
import { useLanguage } from "@/context/LanguageContext";
import { useLocation } from "react-router-dom";

export const AIAssistantWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { language } = useLanguage();
  const location = useLocation();

  if (location.pathname === "/chat" || location.pathname.startsWith("/dashboard") || location.pathname.startsWith("/auth")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-3">
      <AnimatePresence>
        {isOpen && (
          <div
            style={{ width: 'min(380px, 90vw)', opacity: isOpen ? 1 : 0, transform: isOpen ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)', transition: 'all 0.3s ease' }}
          >
            <AIChat variant="compact" />
          </div>
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
          initial={{ opacity: 0, transform: 'translateY(10px)' }}
          animate={{ opacity: 1, transform: 'translateY(0)' }}
          style={{ borderRadius: '9999px', backgroundColor: 'hsl(var(--background) / 0.8)', padding: '0.5rem 1rem', fontSize: '0.875rem', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)' }}
        >
          {language === "ar" ? "جرّب مساعدنا الذكي" : "Try our AI guide"}
        </motion.span>
      )}
    </div>
  );
};
