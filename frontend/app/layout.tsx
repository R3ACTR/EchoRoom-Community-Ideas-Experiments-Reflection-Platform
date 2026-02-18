import "../styles/globals.css";
import { ThemeProvider } from "./components/ThemeProvider";
import { ExperimentsProvider } from "./context/ExperimentsContext";
import { IdeasProvider } from "./context/IdeasContext";
import { SmoothCursor } from "@/components/ui/smooth-cursor";

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
            <IdeasProvider>
              {children}
            </IdeasProvider>
            <SmoothCursor />
            {children}
          </ExperimentsProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
