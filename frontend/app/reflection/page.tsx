import { BookOpen, MessageSquare } from "lucide-react";
import { PageLayout } from "../community/PageLayout";

const reflections = [
  { title: "Weekly Skill Share", outcome: "Success", learning: "While people loved it, Friday afternoons are often busy with wrap-up work. We might move it to Wednesday lunch.", author: "Elena T.", date: "Feb 10, 2026" },
  { title: "Async Daily Standups", outcome: "Mixed", learning: "Senior devs loved it, juniors felt disconnected. We need a hybrid approach — async for updates, sync for blockers.", author: "David L.", date: "Mar 1, 2026" },
  { title: "Community Garden - Phase 1", outcome: "Success", learning: "Setting up the initial beds took longer than expected due to soil quality issues, but engagement was higher than predicted.", author: "Sarah J.", date: "Feb 15, 2026" },
];

const outcomeColors: Record<string, string> = {
  Success: "text-green-400 bg-green-400/10",
  Mixed: "text-yellow-400 bg-yellow-400/10",
  Failed: "text-red-400 bg-red-400/10",
};

const ReflectionPage = () => {
  return (
    <PageLayout>
    <main>
      <div className="container py-16">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <BookOpen className="h-8 w-8 text-purple-400" />
            <h1 className="text-4xl font-bold text-foreground">Reflection</h1>
          </div>

          <p className="text-lg text-muted-foreground mb-10">
            Reflection is where learning becomes meaningful.
            Document your thoughts, insights, and lessons learned
            from ideas and experiments.
          </p>

          <div className="space-y-6">
            {reflections.map((ref, i) => (
              <div key={i} className="bg-card border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-colors">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-foreground">{ref.title}</h3>
                  <span className={`text-xs font-medium px-3 py-1 rounded-full ${outcomeColors[ref.outcome]}`}>
                    {ref.outcome}
                  </span>
                </div>
                <div className="bg-secondary/30 border-l-4 border-primary rounded-r-lg p-4 mb-4">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="w-4 h-4 text-primary mt-0.5 shrink-0" />
                    <p className="text-sm text-foreground/80 italic">"{ref.learning}"</p>
                  </div>
                </div>
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>By {ref.author}</span>
                  <span>{ref.date}</span>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-card border border-white/10 rounded-xl p-6 text-center">
            <p className="text-muted-foreground">More reflection features will be available here soon.</p>
          </div>
        </div>
      </div>

    </main>
    </PageLayout>
  );
};

export default ReflectionPage;
