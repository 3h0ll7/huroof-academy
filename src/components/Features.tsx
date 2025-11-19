import { Card, CardContent } from "@/components/ui/card";
import { Brain, FileEdit, FileText, BarChart3, Shield, Heart, Lightbulb } from "lucide-react";

const features = [
  {
    icon: Brain,
    title: "المرشد الذكي",
    titleEn: "AI Tutor",
    description: "نظام تفاعلي شخصي يقدم حلولاً وشروحات للمسائل في أي وقت، مع القدرة على إجراء حوارات متعمقة وتكييف مستوى الأسئلة لتعزيز التعلم",
    gradient: "from-primary to-navy-light"
  },
  {
    icon: FileEdit,
    title: "محسن الكتابة",
    titleEn: "Writing Improver",
    description: "أداة لمراجعة النصوص المكتوبة واكتشاف الأخطاء الإملائية والنحوية، وتقديم اقتراحات لتحسين الأسلوب والتركيب اللغوي",
    gradient: "from-secondary to-orange-light"
  },
  {
    icon: FileText,
    title: "ملخص النصوص",
    titleEn: "Text Summarizer",
    description: "تلخيص فصول كاملة من الكتب أو المقالات العلمية واستخراج النقاط الأساسية والمفاهيم الرئيسية لتعزيز تجربة المعلم",
    gradient: "from-navy-deep to-primary"
  },
  {
    icon: BarChart3,
    title: "مولد التقارير",
    titleEn: "Report Generator",
    description: "أتمتة عملية إنشاء تقارير أداء الطلاب الدورية وتقارير التواصل مع أولياء الأمور بشكل آلي ودقيق",
    gradient: "from-orange-bright to-secondary"
  },
  {
    icon: Shield,
    title: "بيئة آمنة ومحفزة",
    titleEn: "Safe Environment",
    description: "مرافق حديثة ومجهزة مصممة خصيصاً لتوفير بيئة تعليمية آمنة ومريحة للطلاب في الروضة والابتدائية",
    gradient: "from-primary via-navy-light to-secondary"
  },
  {
    icon: Heart,
    title: "رعاية شاملة",
    titleEn: "Comprehensive Care",
    description: "نهتم بالجانب النفسي والاجتماعي للطلاب، نقدر تميزهم الشخصي ونعزز قيم التعاون بين الزملاء والمعلمين",
    gradient: "from-secondary via-orange-light to-primary"
  },
  {
    icon: Lightbulb,
    title: "تعليم مبتكر",
    titleEn: "Innovative Education",
    description: "نطبق أحدث المناهج التعليمية المدعومة بتقنيات الذكاء الاصطناعي لتحفيز التفكير الإبداعي والتفكير النقدي الفذ",
    gradient: "from-navy-deep via-primary to-secondary"
  }
];

const Features = () => {
  return (
    <section className="py-20 bg-background">
      <div className="container px-4 mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16 space-y-4">
          <h2 className="text-4xl md:text-5xl font-bold text-primary" dir="rtl">
            بناء قادة المستقبل، اليوم
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed" dir="rtl">
            في مدارس حروف الأهلية، لا نكتفي بنقل المعرفة، بل نبتهشر رؤيتنا بتدريب حلم ممكن بتكنولوجيا متطورة وفكر متطور عالمياً
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              className="group relative overflow-hidden border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:-translate-y-2"
            >
              {/* Gradient Background on Hover */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}></div>
              
              <CardContent className="p-6 space-y-4 relative z-10">
                {/* Icon */}
                <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>

                {/* Title */}
                <div className="space-y-1">
                  <h3 className="text-2xl font-bold text-primary" dir="rtl">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-muted-foreground font-semibold">
                    {feature.titleEn}
                  </p>
                </div>

                {/* Description */}
                <p className="text-foreground/80 leading-relaxed" dir="rtl">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
