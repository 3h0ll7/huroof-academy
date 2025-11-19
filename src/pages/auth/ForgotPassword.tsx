import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { MailCheck } from "lucide-react";

const ForgotPassword = () => {
  const { language, isRTL } = useLanguage();
  const { resetPassword } = useAuth();
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    const { error } = await resetPassword(email);
    setIsLoading(false);
    if (error) {
      toast({ title: language === "ar" ? "تعذر الإرسال" : "Request failed", description: error, variant: "destructive" });
      return;
    }
    toast({
      title: language === "ar" ? "تم إرسال الرابط" : "Email sent",
      description: language === "ar" ? "تحقق من بريدك لإعادة تعيين كلمة المرور" : "Check your inbox for the reset link",
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl border border-primary/10 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">
              {language === "ar" ? "إعادة تعيين كلمة المرور" : "Reset password"}
            </CardTitle>
            <CardDescription className="text-base">
              {language === "ar" ? "أدخل بريدك لإرسال رابط الاستعادة" : "Enter your email to receive the reset link"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2 text-left">
                <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                <MailCheck className="h-4 w-4" />
                {language === "ar" ? "أرسل رابط التفعيل" : "Send reset link"}
              </Button>
            </form>
            <p className="text-center text-sm text-muted-foreground">
              <Link to="/auth/sign-in" className="text-primary hover:underline">
                {language === "ar" ? "العودة لتسجيل الدخول" : "Back to sign in"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ForgotPassword;
