import { useLanguage } from "@/context/LanguageContext";

export const GoogleMapSection = () => {
  const { language, isRTL } = useLanguage();

  return (
    <div className="space-y-4 rounded-3xl border border-white/20 bg-white/10 p-6 text-white backdrop-blur-xl">
      <div className="space-y-2" dir={isRTL ? "rtl" : "ltr"}>
        <p className="text-sm font-semibold text-secondary">
          {language === "ar" ? "موقعنا على الخريطة" : "Our location on the map"}
        </p>
        <p className="text-sm text-white/80">
          {language === "ar"
            ? "استكشف موقع مدارس حروف وتعرّف على أفضل طريقة للوصول إلينا."
            : "See exactly where Huroof Schools are located and plan your visit."}
        </p>
      </div>
      <div className="relative w-full overflow-hidden rounded-2xl border border-white/20">
        <div className="aspect-[16/9] w-full">
          <iframe
            title={language === "ar" ? "خريطة مدارس حروف" : "Huroof Schools map"}
            src="https://www.google.com/maps?q=PjivX4ZkoMbLFyCk6&output=embed"
            className="h-full w-full"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </div>
  );
};
