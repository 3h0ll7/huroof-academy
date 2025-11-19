export type SectionDefinition = {
  id: string;
  label: { ar: string; en: string };
  description: { ar: string; en: string };
};

export const primarySections: SectionDefinition[] = [
  {
    id: "hero",
    label: { ar: "الرئيسية", en: "Home" },
    description: {
      ar: "نقطة البداية للتعريف بالرسالة والهوية البصرية لمدارس حروف.",
      en: "The opening view that captures the Huroof story and brand.",
    },
  },
  {
    id: "vision",
    label: { ar: "المزايا", en: "Features" },
    description: {
      ar: "ملخص لقدرات حروف AI والحلول التعليمية المتاحة.",
      en: "Highlights of Huroof AI capabilities and learning solutions.",
    },
  },
  {
    id: "assistant",
    label: { ar: "المساعد", en: "Assistant" },
    description: {
      ar: "عرض تفصيلي للمساعد الذكي وكيف ييسر يوم الطالب والمعلم.",
      en: "A closer look at the intelligent assistant powering every day.",
    },
  },
  {
    id: "portals",
    label: { ar: "البوابات", en: "Portals" },
    description: {
      ar: "مسارات التواصل بين الأهالي والمعلمين عبر منصة واحدة.",
      en: "The workspace that connects families and educators in one hub.",
    },
  },
  {
    id: "cta",
    label: { ar: "تواصل", en: "Contact" },
    description: {
      ar: "خطوات التسجيل والتواصل مع فريق حروف.",
      en: "How to reach the Huroof team and start enrollment.",
    },
  },
];
