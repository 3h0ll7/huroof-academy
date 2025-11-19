import { Suspense, lazy } from "react";
import Hero from "@/components/Hero";
import { StickyNavbar } from "@/components/StickyNavbar";
import { useSectionObserver } from "@/hooks/useSectionObserver";
import { useLanguage } from "@/context/LanguageContext";

const Features = lazy(() => import("@/components/Features"));
const CTASection = lazy(() => import("@/components/CTASection"));
const AssistantShowcase = lazy(() => import("@/components/AssistantShowcase"));
const Portals = lazy(() => import("@/components/Portals"));

const sections = [
  { id: "hero", label: { ar: "الرئيسية", en: "Home" } },
  { id: "vision", label: { ar: "المزايا", en: "Features" } },
  { id: "assistant", label: { ar: "المساعد", en: "Assistant" } },
  { id: "portals", label: { ar: "البوابات", en: "Portals" } },
  { id: "cta", label: { ar: "تواصل", en: "Contact" } },
];
const sectionIds = sections.map((section) => section.id);

const SectionSkeleton = () => (
  <div className="container mx-auto animate-pulse space-y-6 px-4">
    <div className="h-10 rounded-full bg-muted" />
    <div className="h-64 rounded-3xl bg-muted" />
  </div>
);

const Index = () => {
  const { language } = useLanguage();
  const activeSection = useSectionObserver(sectionIds, "hero");

  return (
    <div className="min-h-screen bg-background text-foreground">
      <StickyNavbar sections={sections} activeSection={activeSection} />
      <main className="space-y-20 pb-20">
        <Hero />
        <Suspense fallback={<SectionSkeleton />}>
          <Features />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <AssistantShowcase />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <Portals />
        </Suspense>
        <Suspense fallback={<SectionSkeleton />}>
          <CTASection />
        </Suspense>
      </main>
      <footer className="border-t bg-muted/40 py-10 text-center text-sm text-muted-foreground" dir={language === "ar" ? "rtl" : "ltr"}>
        {language === "ar"
          ? "© 2025 مدارس حروف الأهلية - تجربة تعليمية مدعومة بالذكاء الاصطناعي"
          : "© 2025 Huroof Private Schools - AI-empowered learning experience"}
      </footer>
    </div>
  );
};

export default Index;
