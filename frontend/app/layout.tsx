import "../styles/globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ExperimentsProvider } from "./context/ExperimentsContext";
import EchionAssistant from "@/app/components/Echion";

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
      <head>
        <meta charSet="utf-8" />
      </head>
      <body className="bg-gray-50 dark:bg-slate-900 text-gray-900 dark:text-white transition-colors">
        <ThemeProvider>
          <ExperimentsProvider>
            {children}    
            <EchionAssistant />
          </ExperimentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
