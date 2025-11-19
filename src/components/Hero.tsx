import { Button } from "@/components/ui/button";
import { ArrowLeft, Sparkles } from "lucide-react";
import logo from "@/assets/huroof-logo.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-primary via-navy-deep to-navy-light">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-orange-bright/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="container relative z-10 px-4 py-16 mx-auto">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo */}
          <div className="relative">
            <div className="absolute inset-0 bg-secondary/20 rounded-full blur-2xl scale-110"></div>
            <img 
              src={logo} 
              alt="Huroof Private Schools" 
              className="relative w-48 h-48 md:w-64 md:h-64 rounded-full object-cover shadow-2xl border-4 border-white/10"
            />
          </div>

          {/* Main Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight" dir="rtl">
              مدارس حروف الأهلية
            </h1>
            <p className="text-xl md:text-2xl text-white/90 font-semibold">
              HUROOF PRIVATE SCHOOLS
            </p>
          </div>

          {/* Tagline */}
          <div className="max-w-3xl space-y-4">
            <div className="flex items-center justify-center gap-2">
              <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
              <h2 className="text-2xl md:text-4xl font-bold text-white" dir="rtl">
                حيث يلتقي التعليم بالذكاء الاصطناعي
              </h2>
              <Sparkles className="w-6 h-6 text-secondary animate-pulse" />
            </div>
            <p className="text-lg md:text-xl text-white/80 leading-relaxed" dir="rtl">
              نقدم تجربة تعليمية متكاملة مدعومة بتقنيات الذكاء الاصطناعي "حروف AI" للمكنين الطلاب والمعلمين من تحقيق أقصى إمكاناتهم في بيئة مبتكرة
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-8">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-white font-bold text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
              dir="rtl"
            >
              <ArrowLeft className="ml-2 h-5 w-5" />
              جرب حروف الذكي
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 hover:bg-white/20 text-white border-white/30 font-bold text-lg px-8 py-6 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105"
              dir="rtl"
            >
              احجز زيارة للمدرسة
            </Button>
          </div>

          {/* Contact Info */}
          <div className="pt-8 text-white/70 space-y-2" dir="rtl">
            <p className="text-sm md:text-base">النجف - حي عدن - مقابل شارع الزهور</p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-sm md:text-base">
              <p>للتواصل: 07728881666 - 07833446666</p>
              <p className="hidden sm:block">|</p>
              <p>إدارة الروضة والابتدائية: 07733334452</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
