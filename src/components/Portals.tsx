import { motion } from "framer-motion";
import { Users, GraduationCap, Trophy, BarChart, Bell } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const portals = [
  {
    id: "parents",
    title: { ar: "بوابة أولياء الأمور", en: "Parents Portal" },
    summary: {
      ar: "لوحة مؤشرات لحظية للحضور، الواجبات، وتقارير الرفاهية.",
      en: "Live dashboards for attendance, homework, and wellbeing reports.",
    },
    icon: Users,
    highlights: [
      { ar: "إشعارات فورية", en: "Instant alerts" },
      { ar: "تقييمات أسبوعية", en: "Weekly insights" },
      { ar: "دردشة مع المعلمين", en: "Chat with teachers" },
    ],
  },
  {
    id: "teachers",
    title: { ar: "بوابة المعلمين", en: "Teachers Portal" },
    summary: {
      ar: "مخططات درس مدعومة بالذكاء الاصطناعي، جداول تلقائية، وتتبع أهداف الطلاب.",
      en: "AI lesson blueprints, automated schedules, and student goal tracking.",
    },
    icon: GraduationCap,
    highlights: [
      { ar: "مصحح ذكي", en: "Smart grader" },
      { ar: "مكتبة أنشطة", en: "Activity library" },
      { ar: "تحليلات تقدم", en: "Progress analytics" },
    ],
  },
];

const extras = [
  { icon: Trophy, label: { ar: "مسابقات رقمية", en: "Digital competitions" } },
  { icon: BarChart, label: { ar: "مؤشرات رفاهية", en: "Wellbeing metrics" } },
  { icon: Bell, label: { ar: "تنبيهات ذكية", en: "Smart nudges" } },
];

const Portals = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section id="portals" className="bg-muted/40 py-20">
      <div className="container mx-auto space-y-12 px-4">
        <div className="text-center" dir={isRTL ? "rtl" : "ltr"}>
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">
            {language === "ar" ? "بوابات رقمية" : "Digital portals"}
          </p>
          <h2 className="text-4xl font-bold">
            {language === "ar" ? "منصة موحدة للأهل والمعلمين" : "A unified workspace for families and educators"}
          </h2>
          <p className="mt-4 text-muted-foreground">
            {language === "ar"
              ? "تصميم عصري مستوحى من لوحات البيانات، يستجيب لكل الأجهزة، ويقدم رؤية 360° عن الطالب"
              : "A modern dashboard aesthetic that adapts to every device and reveals a 360° student view."}
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {portals.map((portal, idx) => (
            <motion.div
              key={portal.id}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true, amount: 0.3 }}
              className="rounded-3xl border border-border/80 bg-card/80 p-8 shadow-xl"
            >
              <div className="flex items-center gap-4" dir={isRTL ? "rtl" : "ltr"}>
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                  <portal.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{portal.title[language]}</h3>
                  <p className="text-sm text-muted-foreground">{portal.summary[language]}</p>
                </div>
              </div>
              <div className={`mt-6 grid gap-3 text-sm ${isRTL ? "text-right" : "text-left"}`}>
                {portal.highlights.map((highlight) => (
                  <div key={highlight.en} className="flex items-center justify-between rounded-2xl border border-dashed border-border/60 px-4 py-3">
                    <span>{highlight[language]}</span>
                    <span className="text-xs text-muted-foreground">
                      {language === "ar" ? "مُحدث آليًا" : "Auto-refreshed"}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4" dir={isRTL ? "rtl" : "ltr"}>
          {extras.map((extra) => (
            <motion.div
              key={extra.label.en}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 rounded-full border border-dashed border-secondary/40 px-4 py-2 text-sm"
            >
              <extra.icon className="h-4 w-4 text-secondary" />
              {extra.label[language]}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Portals;
