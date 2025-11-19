import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, LogIn, Mail } from "lucide-react";

const SignIn = () => {
  const { language, isRTL } = useLanguage();
  const { signInWithGoogle, signInWithEmail } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;
    setIsLoading(true);
    const { error } = await signInWithEmail(email, password);
    setIsLoading(false);
    if (error) {
      toast({
        title: language === "ar" ? "تعذر تسجيل الدخول" : "Sign-in failed",
        description: error,
        variant: "destructive",
      });
      return;
    }
    const redirectTo = (location.state as { from?: string } | null)?.from ?? "/dashboard";
    navigate(redirectTo, { replace: true });
  };

  const handleGoogle = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      console.error(error);
      toast({
        title: language === "ar" ? "خطأ في Google" : "Google error",
        description: language === "ar" ? "تعذر إتمام تسجيل الدخول عبر Google" : "Google sign-in failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl border border-primary/10 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">
              {language === "ar" ? "تسجيل الدخول" : "Sign in"}
            </CardTitle>
            <CardDescription className="text-base">
              {language === "ar" ? "ادخل إلى لوحة حروف AI الخاصة بك" : "Access your Huroof AI dashboard"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button type="button" variant="outline" className="w-full gap-2" onClick={handleGoogle}>
              <LogIn className="h-4 w-4" />
              {language === "ar" ? "متابعة باستخدام Google" : "Continue with Google"}
            </Button>

            <div className="relative">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-background px-3 text-sm text-muted-foreground">
                {language === "ar" ? "أو" : "or"}
              </span>
            </div>

            <form className="space-y-4" onSubmit={handleEmailLogin}>
              <div className="space-y-2 text-left">
                <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder={language === "ar" ? "example@huroof.com" : "example@huroof.com"}
                  required
                />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="password">{language === "ar" ? "كلمة المرور" : "Password"}</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
                {language === "ar" ? "تسجيل الدخول بالبريد" : "Sign in with email"}
              </Button>
            </form>

            <div className="flex flex-col gap-2 text-sm text-muted-foreground">
              <Link to="/auth/forgot-password" className="text-primary hover:underline">
                {language === "ar" ? "هل نسيت كلمة المرور؟" : "Forgot password?"}
              </Link>
              <p>
                {language === "ar" ? "لا تملك حساباً؟" : "No account?"}{" "}
                <Link to="/auth/sign-up" className="text-primary hover:underline">
                  {language === "ar" ? "أنشئ حساباً" : "Create one"}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignIn;
