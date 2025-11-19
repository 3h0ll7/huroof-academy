import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Phone, MessageCircle, Calendar, ArrowLeft } from "lucide-react";

const CTASection = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-primary via-navy-deep to-navy-light relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-bright/10 rounded-full blur-3xl"></div>

      <div className="container px-4 mx-auto relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-12">
          {/* Main CTA */}
          <div className="space-y-6">
            <h2 className="text-4xl md:text-5xl font-bold text-white leading-tight" dir="rtl">
              انضم إلى مجتمع حروف التعليمي
            </h2>
            <p className="text-xl text-white/90 leading-relaxed max-w-2xl mx-auto" dir="rtl">
              ابدأ رحلة تعليمية استثنائية مع تقنيات الذكاء الاصطناعي الأكثر تطوراً
            </p>
          </div>

          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                  <Phone className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-white" dir="rtl">اتصل بنا</h3>
                <div className="space-y-1 text-white/80 text-sm" dir="rtl">
                  <p>07728881666</p>
                  <p>07833446666</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                  <MessageCircle className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-white" dir="rtl">واتساب</h3>
                <p className="text-white/80 text-sm" dir="rtl">
                  تواصل معنا مباشرة
                </p>
              </CardContent>
            </Card>

            <Card className="border-white/10 bg-white/5 backdrop-blur-md hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <CardContent className="p-6 text-center space-y-3">
                <div className="w-14 h-14 mx-auto rounded-full bg-secondary/20 flex items-center justify-center">
                  <Calendar className="w-7 h-7 text-secondary" />
                </div>
                <h3 className="text-lg font-bold text-white" dir="rtl">احجز زيارة</h3>
                <p className="text-white/80 text-sm" dir="rtl">
                  الروضة: 07733334452
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Primary CTA Button */}
          <div className="pt-8">
            <Button 
              size="lg" 
              className="bg-secondary hover:bg-secondary/90 text-white font-bold text-xl px-12 py-7 rounded-full shadow-2xl hover:shadow-3xl transition-all duration-300 hover:scale-110"
              dir="rtl"
            >
              <ArrowLeft className="ml-3 h-6 w-6" />
              ابدأ مع حروف AI الآن
            </Button>
          </div>

          {/* Location */}
          <div className="pt-8 text-white/70 space-y-2" dir="rtl">
            <p className="text-lg font-semibold">📍 موقعنا</p>
            <p className="text-base">النجف - حي عدن - مقابل شارع الزهور</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CTASection;
