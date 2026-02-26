import "../styles/globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ExperimentsProvider } from "./context/ExperimentsContext";
import EchionAssistant from "@/app/components/Echion";
import LoadingScreen from "@/components/ui/LoadingScreen";
import { AnimatePresence } from "framer-motion";

export const metadata = {
  title: "EchoRoom",
  description: "Turn Ideas into Actionable Learning",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors">
        <ThemeProvider>
          <ExperimentsProvider>
            <AnimatePresence mode="wait">
          <LoadingScreen />
        </AnimatePresence>
            {children}    
            <EchionAssistant />
          </ExperimentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}