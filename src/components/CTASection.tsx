import { motion } from "@/lib/framer-motion-lite";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, ArrowLeft, ArrowRight, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext";
import { PhoneLink } from "@/components/PhoneLink";
import { GoogleMapSection } from "@/components/GoogleMapSection";

const CTASection = () => {
  const { language, isRTL } = useLanguage();

  const cards = [
    {
      icon: Phone,
      label: { ar: "اتصل مباشرة", en: "Call us" },
      details: "07728881666",
    },
    {
      icon: MessageCircle,
      label: { ar: "رسالة واتساب", en: "WhatsApp" },
      details: "07833446666",
    },
  ];

  return (
    <section id="cta" className="relative overflow-hidden bg-gradient-to-br from-primary via-navy-deep to-navy-light py-24 text-white">
      <motion.div className="absolute inset-0 opacity-60" initial={{ opacity: 0 }} whileInView={{ opacity: 0.6 }}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.2),transparent_60%)]" />
      </motion.div>
      <div className="container relative z-10 mx-auto space-y-12 px-4">
        <motion.div
          initial={{ opacity: 0, transform: 'translateY(40px)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0)' }}
          viewport={{ once: true, amount: 0.4 }}
          className="mx-auto max-w-3xl text-center"
        >
          <p className="text-sm uppercase tracking-[0.3em] text-secondary">
            {language === "ar" ? "الخطوة التالية" : "Next step"}
          </p>
          <h2 className="text-4xl font-bold" dir={isRTL ? "rtl" : "ltr"}>
            {language === "ar" ? "انضم إلى مجتمع حروف التعليمي" : "Join the Huroof learning community"}
          </h2>
          <p className="mt-4 text-white/80" dir={isRTL ? "rtl" : "ltr"}>
            {language === "ar"
              ? "احجز زيارة، تواصل مع فريق التسجيل، أو ابدأ تجربة مساعد حروف AI الآن"
              : "Schedule a visit, connect with enrollment, or launch the Huroof AI experience now."}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {cards.map((card, index) => (
            <motion.div key={card.details} initial={{ opacity: 0, transform: 'translateY(20px)' }} whileInView={{ opacity: 1, transform: 'translateY(0)' }} transition={{ delay: index * 0.1 }}>
              <Card className="border-white/20 bg-white/10 text-white">
                <CardContent className="space-y-4 p-6" dir={isRTL ? "rtl" : "ltr"}>
                  <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
                    <card.icon className="h-7 w-7" />
                  </div>
                  <p className="text-lg font-semibold">{card.label[language]}</p>
                  <PhoneLink number={card.details} label={card.details} className="bg-white/20 text-white" dir={isRTL ? "rtl" : "ltr"} />
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <div className={`flex flex-col gap-4 rounded-3xl bg-white/10 p-8 backdrop-blur-xl md:flex-row md:items-center ${isRTL ? "md:flex-row-reverse" : ""}`}>
          <div className="flex-1 space-y-2" dir={isRTL ? "rtl" : "ltr"}>
            <p className="flex items-center gap-2 text-sm font-semibold text-secondary">
              <MapPin className="h-4 w-4" />
              {language === "ar" ? "موقعنا" : "Our campus"}
            </p>
            <p className="text-2xl font-bold">{language === "ar" ? "النجف - حي عدن - مقابل شارع الزهور" : "Najaf, Aden District - Opposite Al-Zuhur St."}</p>
            <p className="text-sm text-white/70">
              {language === "ar" ? "موقف خاص، مسارات آمنة، ومرافق صديقة لذوي الهمم" : "Dedicated parking, safe corridors, and accessible facilities."}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link to="/chat" className="flex-1">
              <Button size="lg" className="flex w-full items-center justify-center gap-2 rounded-full bg-secondary text-lg font-semibold">
                {language === "ar" ? <ArrowLeft className="h-5 w-5" /> : <ArrowRight className="h-5 w-5" />}
                {language === "ar" ? "ابدأ مع حروف AI" : "Start with Huroof AI"}
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="flex-1 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10"
              asChild
            >
              <a href="https://maps.app.goo.gl/tkQsdJw2" target="_blank" rel="noreferrer">
                {language === "ar" ? "استكشف الخريطة" : "Open map"}
              </a>
            </Button>
          </div>
        </div>

        <GoogleMapSection />
      </div>
    </section>
  );
};

export default CTASection;
