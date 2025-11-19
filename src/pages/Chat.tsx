import AIChat from "@/components/AIChat";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/huroof-logo.jpg";

const Chat = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Header */}
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container px-4 py-4 mx-auto">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center gap-3">
              <img 
                src={logo} 
                alt="Huroof" 
                className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
              />
              <div dir="rtl">
                <h1 className="text-xl font-bold text-primary">مدارس حروف الأهلية</h1>
                <p className="text-xs text-muted-foreground">حروف الذكي</p>
              </div>
            </Link>
            
            <Link to="/">
              <Button variant="outline" dir="rtl">
                <ArrowRight className="ml-2 h-4 w-4" />
                العودة للرئيسية
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container px-4 py-12 mx-auto">
        <AIChat />
      </main>

      {/* Footer Note */}
      <footer className="py-8">
        <div className="container px-4 mx-auto">
          <p className="text-center text-sm text-muted-foreground" dir="rtl">
            💡 نصيحة: يمكنك سؤال حروف الذكي عن أي مادة دراسية أو مفهوم تعليمي
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Chat;
