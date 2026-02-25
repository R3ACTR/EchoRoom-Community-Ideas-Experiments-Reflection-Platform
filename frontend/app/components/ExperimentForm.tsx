"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ArrowRight, ArrowLeft, AlertCircle, CheckCircle2, Beaker, Target, XCircle } from "lucide-react";
import { format } from "date-fns";
import ReactMarkdown from "react-markdown";
import { apiFetch } from "../lib/api";
import Container from "./ui/Container";
import Button from "./ui/Button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { MagicCard } from "@/components/ui/magic-card";
import { useEffect } from "react";
import { useExperiments } from "../context/ExperimentsContext";
import { RetroGrid } from "@/components/ui/retro-grid";

const STEPS = [
  { id: "basics", title: "The Basics", description: "What are we testing?" },
  { id: "hypothesis", title: "Hypothesis", description: "Predict the outcome." },
  { id: "measurement", title: "Measurement", description: "Define success." },
  { id: "falsifiability", title: "Falsifiability", description: "When does it fail?" },
  { id: "timeline", title: "Timeline", description: "When will it happen?" },
];

export function ExperimentForm() {
  const router = useRouter();
  const { addExperiment } = useExperiments();
  const [ideas, setIdeas] = useState<any[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [aiInsights, setAiInsights] = useState<any[]>([]);
  const [isFetchingInsights, setIsFetchingInsights] = useState(false);

  useEffect(() => {
    const fetchIdeas = async () => {
      try {
        const data = await apiFetch<any[]>("/ideas");
        setIdeas(data);
      } catch (error) {
        console.error("Failed to fetch ideas:", error);
      }
    };

    fetchIdeas();
  }, []);

  const [preview, setPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    title: "",
    description: "", // Now generic notes
    hypothesis: "",
    successMetric: "",
    falsifiability: "",
    startDate: "",
    endDate: "",
    linkedIdeaId: "",
  });

  useEffect(() => {
    const fetchAIInsights = async () => {
      if (formData.title.trim().length < 5 || formData.description.trim().length < 5) {
         setAiInsights([]);
         return;
      }

      setIsFetchingInsights(true);
      try {
        const response: any = await apiFetch("/insights/suggest-patterns", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: formData.title,
            description: formData.description
          }),
        });
        setAiInsights(response || []);
      } catch (error) {
        console.error("Failed to fetch AI insights:", error);
      } finally {
        setIsFetchingInsights(false);
      }
    };

    const timer = setTimeout(fetchAIInsights, 1000);
    return () => clearTimeout(timer);
  }, [formData.title, formData.description]);
  const [dateError, setDateError] = useState<string>("");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
      setPreview(false);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
      setPreview(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < STEPS.length - 1) {
      nextStep();
      return;
    }

    setIsSubmitting(true);

    try {
      await apiFetch("/experiments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: formData.title,
          description: formData.description || `Experiment: ${formData.title}`,
          hypothesis: formData.hypothesis,
          successMetric: formData.successMetric,
          falsifiability: formData.falsifiability,
          status: "planned",
          progress: 0,
          endDate: formData.endDate,
          linkedIdeaId: formData.linkedIdeaId || null,
        }),
      });

      router.push("/experiments");
    } catch (error) {
      console.error("Failed to create experiment:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2">
      {STEPS.map((step, index) => (
        <div key={step.id} className="flex flex-col items-center flex-1 min-w-[80px]">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors mb-2 ${index <= currentStep
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-muted-foreground border border-white/10"
              }`}
          >
            {index < currentStep ? <CheckCircle2 className="w-5 h-5" /> : index + 1}
          </div>
          <span className={`text-[10px] uppercase tracking-wider font-semibold ${index === currentStep ? "text-primary" : "text-muted-foreground"
            }`}>
            {step.id}
          </span>
        </div>
      ))}
    </div>
  );

  return (
    <>
      <div className="fixed inset-0 z-0 pointer-events-none">
        <RetroGrid />
      </div>
      <Container className="max-w-3xl py-12 space-y-6 relative z-10">
        <div className="flex justify-start">
          <Button
            type="button"
            variant="primary"
            onClick={() => router.push("/experiments")}
          >
            ← Back to Experiments
          </Button>
        </div>

        <MagicCard gradientColor="rgba(59,130,246,0.6)" className="p-8 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl">
          <div className="mb-6">
            <h1 className="text-3xl font-bold mb-1">
              {STEPS[currentStep].title}
            </h1>
            <p className="text-muted-foreground">
              {STEPS[currentStep].description}
            </p>
          </div>

          {renderStepIndicator()}

          <form onSubmit={handleSubmit} className="space-y-8">
            {currentStep === 0 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    Experiment Title
                  </label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="E.g., Testing AI mood-based themes"
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                  />
                </div>

                {/* AI Insights Panel */}
                {(isFetchingInsights || aiInsights.length > 0) && (
                  <div className="bg-primary/5 border border-primary/20 rounded-xl p-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-500">
                    <div className="flex items-center gap-2 text-primary font-semibold text-sm">
                      <Beaker className="w-4 h-4 animate-pulse" />
                      {isFetchingInsights ? "AI is thinking..." : "AI Community Insights"}
                    </div>
                    {!isFetchingInsights && aiInsights.map((insight) => (
                      <div key={insight.id} className="bg-background/50 border border-primary/10 rounded-lg p-3 space-y-1">
                        <div className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4 text-green-500" />
                          <span className="font-medium text-sm">{insight.label}</span>
                        </div>
                        <p className="text-xs text-muted-foreground ml-6">
                          {insight.data.description}
                        </p>
                        {insight.data.confidence && (
                          <div className="ml-6 mt-2 flex items-center gap-2">
                            <div className="h-1.5 w-16 bg-muted rounded-full overflow-hidden">
                              <div
                                className="h-full bg-primary"
                                style={{ width: `${insight.data.confidence * 100}%` }}
                              />
                            </div>
                            <span className="text-[10px] text-muted-foreground">
                              {Math.round(insight.data.confidence * 100)}% confidence
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium mb-2">
                    Link to an Idea (Optional)
                  </label>
                  <select
                    name="linkedIdeaId"
                    value={formData.linkedIdeaId}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                  >
                    <option value="">-- Select an Idea --</option>
                    {ideas.map((idea) => (
                      <option key={idea.id} value={idea.id}>
                        {idea.title}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {currentStep === 1 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-blue-500/10 border border-blue-500/20 p-4 rounded-xl flex items-start gap-4 mb-4">
                  <Beaker className="w-6 h-6 text-blue-500 shrink-0 mt-1" />
                  <p className="text-sm text-blue-200">
                    A good hypothesis follows a predictable pattern: <strong>"If we [do X], then [Y will happen]."</strong>
                  </p>
                </div>

                <div className="flex justify-between mb-2">
                  <label className="block text-sm font-medium">Hypothesis Statement</label>
                  <button
                    type="button"
                    onClick={() => setPreview((p) => !p)}
                    className="text-xs px-3 py-1 rounded-md border hover:bg-muted transition"
                  >
                    {preview ? "Write" : "Preview"}
                  </button>
                </div>

                {preview ? (
                  <div className="px-4 py-3 rounded-xl border bg-background prose max-w-none min-h-[120px]">
                    <ReactMarkdown>{formData.hypothesis || "Nothing to preview..."}</ReactMarkdown>
                  </div>
                ) : (
                  <>
                    <textarea
                      name="hypothesis"
                      required
                      rows={6}
                      maxLength={500}
                      value={formData.hypothesis}
                      onChange={handleChange}
                      placeholder="E.g., If we add a mood selector to the onboarding, then user retention will increase by 15% because users feel more understood from the start."
                      className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                    />
                    <p className="text-xs text-right mt-1 text-muted-foreground">
                      {formData.hypothesis.length}/500 characters
                    </p>
                  </>
                )}
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-xl flex items-start gap-4 mb-4">
                  <Target className="w-6 h-6 text-green-500 shrink-0 mt-1" />
                  <p className="text-sm text-green-200">
                    How will you measure success? Be specific. <strong>"We will see a [X]% increase in [Y]."</strong>
                  </p>
                </div>

                <label className="block text-sm font-medium">Success Metric</label>
                <textarea
                  name="successMetric"
                  required
                  rows={4}
                  maxLength={300}
                  value={formData.successMetric}
                  onChange={handleChange}
                  placeholder="E.g., 20% increase in weekly active users (WAU)."
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                />
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex items-start gap-4 mb-4">
                  <XCircle className="w-6 h-6 text-red-500 shrink-0 mt-1" />
                  <p className="text-sm text-red-200">
                    Scientific rigor requires falsifiability. <strong>"The experiment fails if..."</strong>
                  </p>
                </div>

                <label className="block text-sm font-medium">Falsifiability Condition</label>
                <textarea
                  name="falsifiability"
                  required
                  rows={4}
                  maxLength={300}
                  value={formData.falsifiability}
                  onChange={handleChange}
                  placeholder="E.g., The experiment fails if the retention rate stays below 5% after the first month."
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                />
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                <div className="grid md:grid-cols-2 gap-6">
                  {dateError && (
                    <div className="md:col-span-2">
                      <div className="flex items-start gap-3 px-4 py-3 rounded-lg bg-red-950/30 border border-red-800/50">
                        <AlertCircle className="h-5 w-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-sm font-medium text-red-300">{dateError}</p>
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium mb-2">Start Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="w-full justify-start flex items-center px-4 py-2 border rounded-md hover:bg-muted">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.startDate ? format(new Date(formData.startDate), "PPP") : "Pick start date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0 z-50">
                        <Calendar
                          mode="single"
                          selected={formData.startDate ? new Date(formData.startDate) : undefined}
                          onSelect={(date) => {
                            if (!date) return;
                            setFormData(prev => ({ ...prev, startDate: format(date, "yyyy-MM-dd") }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">End Date</label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <button type="button" className="flex w-full items-center justify-start rounded-md border px-4 py-2 hover:bg-muted transition">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {formData.endDate ? format(new Date(formData.endDate), "PPP") : "Pick end date"}
                        </button>
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0 z-50">
                        <Calendar
                          mode="single"
                          selected={formData.endDate ? new Date(formData.endDate) : undefined}
                          disabled={(date) => formData.startDate ? date < new Date(formData.startDate) : false}
                          onSelect={(date) => {
                            if (!date) return;
                            setFormData(prev => ({ ...prev, endDate: format(date, "yyyy-MM-dd") }));
                          }}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                  <textarea
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Any extra context or setup required..."
                    className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                  />
                </div>
              </div>
            )}

            <div className="pt-4 flex justify-between gap-4">
              <Button
                type="button"
                variant="secondary"
                onClick={prevStep}
                disabled={currentStep === 0 || isSubmitting}
                className="px-8"
              >
                Back
              </Button>

              <Button
                type="submit"
                variant="primary"
                disabled={isSubmitting}
                className="px-8"
              >
                {currentStep === STEPS.length - 1 ? (
                  isSubmitting ? "Creating..." : "Finish Experiment"
                ) : (
                  <>
                    Next 
                  </>
                )}
              </Button>
            </div>
          </form>
        </MagicCard>
      </Container>
    </>
  );
}

