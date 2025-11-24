import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/context/LanguageContext";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ShieldCheck } from "lucide-react";

const SignUp = () => {
  const { language, isRTL } = useLanguage();
  const { signUpWithEmail, signUpWithPhone } = useAuth();
  const { toast } = useToast();
  const [signupMethod, setSignupMethod] = useState<"email" | "phone">("email");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSignup = async (event: React.FormEvent) => {
    event.preventDefault();
    if (password !== confirmPassword) {
      toast({
        title: language === "ar" ? "كلمات المرور غير متطابقة" : "Passwords do not match",
        variant: "destructive",
      });
      return;
    }
    
    setIsLoading(true);
    const { error } = signupMethod === "email"
      ? await signUpWithEmail(email, password)
      : await signUpWithPhone(phone, password);
    setIsLoading(false);
    
    if (error) {
      toast({ title: language === "ar" ? "تعذر إنشاء الحساب" : "Sign-up failed", description: error, variant: "destructive" });
      return;
    }
    toast({
      title: language === "ar" ? "تم إنشاء الحساب" : "Account created",
      description: signupMethod === "email" 
        ? (language === "ar" ? "تحقق من بريدك الإلكتروني لتفعيل الحساب" : "Check your inbox to confirm your account")
        : (language === "ar" ? "تحقق من رسائلك النصية لتفعيل الحساب" : "Check your SMS to confirm your account"),
    });
  };

  return (
    <div className="min-h-screen bg-background" dir={isRTL ? "rtl" : "ltr"}>
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-4 py-10">
        <Card className="w-full max-w-xl border border-primary/10 shadow-xl">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-3xl font-bold">
              {language === "ar" ? "إنشاء حساب" : "Create an account"}
            </CardTitle>
            <CardDescription className="text-base">
              {language === "ar" ? "فعّل لوحة حروف AI المخصصة لك" : "Unlock your personalized Huroof AI space"}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex gap-2 rounded-lg bg-muted p-1">
              <Button
                type="button"
                variant={signupMethod === "email" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setSignupMethod("email")}
              >
                {language === "ar" ? "البريد الإلكتروني" : "Email"}
              </Button>
              <Button
                type="button"
                variant={signupMethod === "phone" ? "default" : "ghost"}
                className="flex-1"
                onClick={() => setSignupMethod("phone")}
              >
                {language === "ar" ? "رقم الهاتف" : "Phone"}
              </Button>
            </div>

            <form className="space-y-4" onSubmit={handleSignup}>
              {signupMethod === "email" ? (
                <div className="space-y-2 text-left">
                  <Label htmlFor="email">{language === "ar" ? "البريد الإلكتروني" : "Email"}</Label>
                  <Input id="email" type="email" value={email} onChange={(event) => setEmail(event.target.value)} required />
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
                <Input id="password" type="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
              </div>
              <div className="space-y-2 text-left">
                <Label htmlFor="confirm">{language === "ar" ? "تأكيد كلمة المرور" : "Confirm password"}</Label>
                <Input id="confirm" type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} required />
              </div>
              <Button type="submit" className="w-full gap-2" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
                {language === "ar" ? "إنشاء الحساب" : "Create account"}
              </Button>
            </form>

            <p className="text-center text-sm text-muted-foreground">
              {language === "ar" ? "لديك حساب بالفعل؟" : "Already registered?"}{" "}
              <Link to="/auth/sign-in" className="text-primary hover:underline">
                {language === "ar" ? "سجّل الدخول" : "Sign in"}
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SignUp;
