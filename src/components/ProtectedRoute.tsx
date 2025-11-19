import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { Loader2 } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { user, loading } = useAuth();
  const location = useLocation();
  const { language } = useLanguage();

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-3 rounded-2xl border border-border px-6 py-4">
          <Loader2 className="h-5 w-5 animate-spin" />
          <span>{language === "ar" ? "جار التحقق من الجلسة..." : "Validating your session..."}</span>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth/sign-in" replace state={{ from: location.pathname }} />;
  }

  return children;
};
