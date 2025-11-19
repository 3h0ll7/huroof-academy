import { motion } from "@/lib/framer-motion-lite";
import { Bot, MessageSquare, CheckCircle2, Sparkles, NotebookPen } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const events = [
  {
    icon: MessageSquare,
    ar: "الطالب يسأل عن قوانين نيوتن",
    en: "Student asks about Newton's laws",
  },
  {
    icon: Bot,
    ar: "المساعد يقدم تفسيرًا تفاعليًا ومخططًا",
    en: "Assistant delivers an interactive explanation with a diagram",
  },
  {
    icon: CheckCircle2,
    ar: "يولد اختبارًا سريعًا ويشارك النتائج مع المعلم",
    en: "Generates a quick quiz and shares insights with the teacher",
  },
];

const quickActions = [
  { ar: "صِغ خطة درس", en: "Draft a lesson" },
  { ar: "أنشئ نشاطًا منزليًا", en: "Create homework" },
  { ar: "حرر رسالة للأهل", en: "Write to parents" },
  { ar: "حل تجربة علمية", en: "Solve a lab" },
];

const AssistantShowcase = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section id="assistant" className="py-20">
      <div className="container mx-auto grid gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(30px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0)' }}
          viewport={{ once: true, amount: 0.4 }}
          className="space-y-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">
            {language === "ar" ? "المساعد الذكي" : "Intelligent assistant"}
          </p>
          <h2 className="text-4xl font-bold text-balance">
            {language === "ar"
              ? "حروف AI يبني حوارات طبيعية، متحولة بحسب السياق"
              : "Huroof AI carries natural, context-aware conversations"}
          </h2>
          <p className="text-muted-foreground">
            {language === "ar"
              ? "يتعرّف على مستوى الطالب، يترجم المصطلحات المعقدة، ويحول كل جلسة إلى أنشطة قابلة للتنفيذ"
              : "It senses proficiency, translates complex ideas, and turns every session into actionable moments."}
          </p>

          <div className="space-y-4">
            {events.map((event, index) => (
              <motion.div
                key={event.en}
                initial={{ opacity: 0, transform: isRTL ? 'translateX(40px)' : 'translateX(-40px)' }}
                whileInView={{ opacity: 1, transform: 'translateX(0)' }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3 rounded-2xl border border-dashed border-border/70 bg-card/70 p-4"
              >
                <event.icon className="h-6 w-6 text-secondary" />
                <p>{event[language as "ar" | "en"]}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.4 }}
          className="rounded-3xl border border-primary/10 bg-gradient-to-br from-background to-muted p-8 shadow-2xl"
        >
          <div className="flex items-center gap-3" dir={isRTL ? "rtl" : "ltr"}>
            <Sparkles className="h-6 w-6 text-secondary" />
            <p className="font-semibold">
              {language === "ar" ? "أوامر سريعة" : "Quick actions"}
            </p>
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {quickActions.map((action) => (
              <button
                type="button"
                key={action.en}
                className="rounded-2xl border border-border/50 bg-white/60 px-4 py-3 text-sm font-semibold text-left shadow-sm transition hover:-translate-y-1"
              >
                {action[language as "ar" | "en"]}
              </button>
            ))}
          </div>
          <div className="mt-6 rounded-2xl bg-muted/80 p-4" dir={isRTL ? "rtl" : "ltr"}>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <NotebookPen className="h-4 w-4" />
              {language === "ar" ? "سجل نشاطات اليوم" : "Today's activity log"}
            </div>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-secondary"></span>
                {language === "ar" ? "تم إنشاء 24 خطة درس" : "24 lesson plans generated"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-primary"></span>
                {language === "ar" ? "18 تقريرًا تمت مشاركته" : "18 reports shared"}
              </li>
              <li className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-orange-light"></span>
                {language === "ar" ? "12 مكالمة لأولياء الأمور" : "12 parent calls"}
              </li>
            </ul>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default AssistantShowcase;
