import { motion } from "@/lib/framer-motion-lite";
import { Brain, FileEdit, FileText, BarChart3, Shield, Lightbulb } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

const featureList = [
  {
    icon: Brain,
    title: { ar: "المرشد الذكي", en: "AI Mentor" },
    description: {
      ar: "محادثات شخصية تكيف مستوى الأسئلة وتقدم شروحات بالصوت والنص لتلبية احتياجات كل طالب.",
      en: "Personalised conversations that adapt difficulty, deliver narrated explanations, and coach every learner.",
    },
    gradient: "from-primary to-navy-light",
  },
  {
    icon: FileEdit,
    title: { ar: "محسن الكتابة", en: "Writing Coach" },
    description: {
      ar: "يدقق التعبير العربي والإنجليزي، يقترح بدائل قوية، ويعيد صياغة التقارير في ثوانٍ.",
      en: "Polishes Arabic & English essays, suggests stronger vocabulary, and rewrites reports in seconds.",
    },
    gradient: "from-secondary to-orange-light",
  },
  {
    icon: FileText,
    title: { ar: "ملخص النصوص", en: "Smart Summaries" },
    description: {
      ar: "يلخص الفصول الطويلة إلى نقاط رئيسية مدعومة بمفاهيم العلوم والتقنية ومصادر جاهزة للطباعة.",
      en: "Condenses long chapters into key ideas with science-ready prompts and printable sheets.",
    },
    gradient: "from-navy-deep to-primary",
  },
  {
    icon: BarChart3,
    title: { ar: "مولد التقارير", en: "Insightful Reports" },
    description: {
      ar: "لوحات تقدم لحظية لأولياء الأمور مع إشعارات ذكية ومقاييس رفاهية الطلاب.",
      en: "Live progress dashboards for families with smart alerts and wellbeing metrics.",
    },
    gradient: "from-orange-bright to-secondary",
  },
  {
    icon: Shield,
    title: { ar: "بيئة آمنة", en: "Safe Campus" },
    description: {
      ar: "بوابات دخول ذكية، تتبع حضور لحظي، وخطط استجابة مدعومة بالذكاء الاصطناعي.",
      en: "Smart entry gates, live attendance, and AI-assisted response playbooks.",
    },
    gradient: "from-primary via-navy-light to-secondary",
  },
  {
    icon: Lightbulb,
    title: { ar: "تعليم مبتكر", en: "Innovative Learning" },
    description: {
      ar: "منهج متكامل للعلوم والفنون، طابعات ثلاثية الأبعاد، ومسابقات ابتكار تعزز التفكير الخلاق.",
      en: "Integrated science-and-arts curriculum, 3D printing labs, and innovation leagues fueling creative thinking.",
    },
    gradient: "from-navy-deep via-primary to-secondary",
  },
];

const Features = () => {
  const { language, isRTL } = useLanguage();

  return (
    <section id="vision" className="bg-background py-20">
      <div className="container mx-auto space-y-12 px-4">
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(30px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0)' }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">
            {language === "ar" ? "مضامين التعلم" : "Learning DNA"}
          </p>
          <h2 className="text-3xl font-bold md:text-5xl" dir={isRTL ? "rtl" : "ltr"}>
            {language === "ar" ? "نُهندس رحلة تعليمية متوازنة" : "We engineer a balanced learning journey"}
          </h2>
          <p className="mt-4 text-muted-foreground" dir={isRTL ? "rtl" : "ltr"}>
            {language === "ar"
              ? "من الروضة إلى الصفوف العليا، تتكامل التكنولوجيا مع الرعاية الإنسانية لتشكيل مهارات المستقبل."
              : "From kindergarten to upper grades, technology and care intertwine to shape future-proof skills."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {featureList.map((feature, index) => (
            <motion.article
              key={feature.title.en}
              initial={{ opacity: 0, transform: 'translateY(40px)' }}
              whileInView={{ opacity: 1, transform: 'translateY(0)' }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.05, duration: 0.6 }}
              className="group relative overflow-hidden rounded-3xl border border-border/60 bg-card/60 p-6 shadow-sm"
            >
              <div className={`absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-20 bg-gradient-to-br ${feature.gradient}`}></div>
              <div className="relative flex flex-col gap-4" dir={isRTL ? "rtl" : "ltr"}>
                <div className={`w-16 rounded-2xl bg-gradient-to-br ${feature.gradient} p-4 text-white shadow-lg`}>
                  <feature.icon className="h-8 w-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold">{feature.title[language]}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description[language]}</p>
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{language === "ar" ? "جاهز للجيل زد" : "Gen-Z ready"}</span>
                  <span>{language === "ar" ? "مُراقَب بالذكاء الاصطناعي" : "AI monitored"}</span>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
