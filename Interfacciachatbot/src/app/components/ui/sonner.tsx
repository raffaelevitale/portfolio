import { Toaster as Sonner, ToasterProps } from "sonner";
import { useTheme } from "../ThemeContext";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        style: {
          fontFamily: '"Lexend", sans-serif',
          fontSize: '13px',
          borderRadius: '12px',
        },
      }}
      style={
        {
          "--normal-bg": theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          "--normal-text": theme === "dark" ? "#F5F5F5" : "#111111",
          "--normal-border": theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          "--success-bg": theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          "--success-text": "#10B981",
          "--success-border": theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
          "--error-bg": theme === "dark" ? "#1E1E1E" : "#FFFFFF",
          "--error-text": "#F73C1C",
          "--error-border": theme === "dark" ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)",
        } as React.CSSProperties
      }
      {...props}
    />
  );
};

export { Toaster };
