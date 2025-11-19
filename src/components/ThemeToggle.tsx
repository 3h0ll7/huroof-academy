import { Button } from "@/components/ui/button";
import { useThemeMode } from "@/context/ThemeContext";
import { Moon, Sun } from "lucide-react";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useThemeMode();

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleTheme}
      aria-label={theme === "dark" ? "Switch to light mode" : "التبديل إلى الوضع الداكن"}
      className="p-2"
    >
      {theme === "dark" ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4 text-blue-500" />}
    </Button>
  );
};
