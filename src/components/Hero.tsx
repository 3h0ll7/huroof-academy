import { motion, useScroll, useTransform } from "@/lib/framer-motion-lite";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Sparkles, Play } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/huroof-logo.jpg";
import { useLanguage } from "@/context/LanguageContext";
import { PhoneLink } from "@/components/PhoneLink";

const heroCopy = {
  heading: {
    ar: "مدارس حروف الأهلية",
    en: "Huroof Private Schools",
  },
  subheading: {
    ar: "حيث يلتقي التعليم بالذكاء الاصطناعي",
    en: "Where learning meets intelligent futures",
  },
  tagline: {
    ar: "نصمم تجربة عربية ثنائية اللغة، مدعومة بمساعد حروف AI، وأحدث الفصول التفاعلية.",
    en: "Bilingual experiences powered by Huroof AI, immersive classrooms, and caring mentors.",
  },
  ctaPrimary: {
    ar: "جرب حروف الذكي",
    en: "Launch Huroof AI",
  },
  ctaSecondary: {
    ar: "اكتشف رحلتنا",
    en: "Discover the journey",
  },
};

const stats = [
  { value: "+1.2K", ar: "جلسات AI شهرية", en: "Monthly AI sessions" },
  { value: "98%", ar: "رضا أولياء الأمور", en: "Parent satisfaction" },
  { value: "2", ar: "بوابات تفاعلية", en: "Interactive portals" },
];

const Hero = () => {
  const { language, isRTL } = useLanguage();
  const { scrollYProgress } = useScroll();
  const floating = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const accent = useTransform(scrollYProgress, [0, 1], [0, 90]);

  return (
    <motion.section
      id="hero"
      className="relative overflow-hidden bg-gradient-to-br from-navy-deep via-navy-light to-primary text-white"
      initial={{ opacity: 0, transform: 'translateY(40px)' }}
      animate={{ opacity: 1, transform: 'translateY(0)' }}
      transition={{ duration: 0.9 }}
    >
      <div className="absolute inset-0">
        <motion.div
          className="absolute -left-20 top-10 h-64 w-64 rounded-full bg-secondary/40 blur-3xl"
          style={{ transform: `translateY(${floating}px)` }}
        />
        <motion.div
          className="absolute -right-24 bottom-0 h-96 w-96 rounded-full bg-orange-light/30 blur-3xl"
          style={{ transform: `translateY(${accent}px)` }}
        />
      </div>

      <div className="container relative z-10 mx-auto grid min-h-[90vh] gap-10 px-4 py-16 lg:grid-cols-2 lg:items-center">
        <div className="space-y-8" dir={isRTL ? "rtl" : "ltr"}>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs uppercase tracking-[0.2em]">
            <Sparkles className="h-4 w-4 text-secondary" />
            {language === "ar" ? "جيل المستقبل" : "Future generation"}
          </span>
          <div className="space-y-4 text-balance">
            <motion.h1 style={{ fontSize: 'clamp(2.25rem, 5vw, 3.75rem)', fontWeight: 900, lineHeight: 1.2 }} initial={{ opacity: 0, transform: 'translateY(20px)' }} whileInView={{ opacity: 1, transform: 'translateY(0)' }}>
              {heroCopy.heading[language]}
            </motion.h1>
            <p className="text-2xl font-semibold text-secondary">
              {heroCopy.subheading[language]}
            </p>
            <p className="text-lg text-white/80 md:text-xl">
              {heroCopy.tagline[language]}
            </p>
          </div>

          <div className={`flex flex-col gap-4 sm:flex-row ${isRTL ? "sm:flex-row-reverse" : ""}`}>
            <Link to="/chat" className="w-full sm:w-auto">
              <Button
                size="lg"
                className={`group flex w-full items-center justify-center gap-3 rounded-full bg-secondary px-8 py-6 text-lg font-semibold shadow-2xl ${isRTL ? "flex-row-reverse" : ""}`}
              >
                {language === "ar" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                {heroCopy.ctaPrimary[language]}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className={`w-full rounded-full border-white/40 bg-white/10 px-8 py-6 text-lg text-white backdrop-blur hover:bg-white/20 ${isRTL ? "flex-row-reverse" : ""}`}
              asChild
            >
              <a href="#portals">
                <Play className="h-4 w-4" />
                {heroCopy.ctaSecondary[language]}
              </a>
            </Button>
          </div>

          <div className="flex flex-wrap gap-3">
            <PhoneLink number="07728881666" label="07728881666" dir={isRTL ? "rtl" : "ltr"} />
            <PhoneLink number="07833446666" label="07833446666" className="bg-white/10 text-white" dir={isRTL ? "rtl" : "ltr"} />
          </div>
        </div>

        <div className="relative">
          <motion.div
            className="mx-auto max-w-sm rounded-[2.5rem] border border-white/20 bg-white/5 p-6 text-center backdrop-blur-xl"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
          >
            <div className="relative mx-auto mb-6 w-48">
              <span className="absolute inset-0 rounded-full bg-secondary/40 blur-2xl" aria-hidden />
              <img
                src={logo}
                alt="Huroof Logo"
                loading="lazy"
                decoding="async"
                fetchPriority="high"
                className="relative h-48 w-48 rounded-full border-4 border-white/20 object-cover shadow-2xl"
              />
            </div>
            <p className="text-lg font-semibold">
              {language === "ar" ? "مجتمع تعلم عربي مبتكر" : "An Arabic-first creative community"}
            </p>
            <p className="text-sm text-white/70">
              {language === "ar"
                ? "بوابات تفاعلية للأهل والمعلمين، فصول ابتكار، ومختبرات ذكية"
                : "Interactive family portals, creative labs, and AI-powered studios"}
            </p>
            <div className="mt-8 grid grid-cols-3 gap-3 text-sm">
              {stats.map((stat) => (
                <div key={stat.value} className="rounded-2xl bg-white/5 p-3">
                  <p className="text-2xl font-bold text-secondary">{stat.value}</p>
                  <p className="text-xs text-white/70">{stat[language as "ar" | "en"]}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Hero;
