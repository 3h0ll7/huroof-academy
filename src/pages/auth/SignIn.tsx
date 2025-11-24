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
  const { signInWithEmail, signInWithPhone } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [loginMethod, setLoginMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    if (loginMethod === "email" && (!email || !password)) return;
    if (loginMethod === "phone" && (!phone || !password)) return;
    
    setIsLoading(true);
    const { error } = loginMethod === "email" 
      ? await signInWithEmail(email, password)
      : await signInWithPhone(phone, password);
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
            <div className="flex gap-2 rounded-lg bg-muted p-1">
              <Button
                type="button"
                variant={loginMethod === "email" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginMethod("email")}
              >
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </Button>
              <Button
                type="button"
                variant={loginMethod === "phone" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setLoginMethod("phone")}
              >
                {language === "ar" ? "رقم الهاتف" : "Phone"}
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleLogin}>
              {loginMethod === "email" ? (
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
              ) : (
                <div className="space-y-2 text-left">
                  <Label htmlFor="phone">{language === "ar" ? "رقم الهاتف" : "Phone Number"}</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(event) => setPhone(event.target.value)}
                    placeholder={language === "ar" ? "+966xxxxxxxxx" : "+966xxxxxxxxx"}
                    required
                  />
                </div>
              )}
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
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogIn className="h-4 w-4" />}
                {language === "ar" ? "تسجيل الدخول" : "Sign in"}
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
