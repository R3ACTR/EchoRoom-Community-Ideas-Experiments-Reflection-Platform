"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ArrowRight } from "lucide-react";
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

export function ExperimentForm() {
  const router = useRouter();
  const { addExperiment } = useExperiments();
  const [ideas, setIdeas] = useState<any[]>([]);
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
    hypothesis: "",
    startDate: "",
    endDate: "",
    linkedIdeaId: "",
  });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setIsSubmitting(true);

  try {
    await apiFetch("/experiments", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
      title: formData.title,
      description: formData.hypothesis,
      status: "planned",
      progress: 0,
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

  return (
    <>
    <div className="fixed inset-0 z-0 pointer-events-none">
      <RetroGrid />
    </div>
    <Container className="max-w-3xl py-12 space-y-6">
      
      {/* Back Button — Top Left Outside Card */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="primary"
          onClick={() => router.push("/experiments")}
        >
         ←  Back to Experiments
        </Button>
      </div>

      <MagicCard gradientColor="rgba(59,130,246,0.6)" className="p-8 backdrop-blur-md border border-white/10 shadow-2xl rounded-2xl">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Create New Experiment
          </h1>
          <p className="text-muted-foreground">
            Turn your ideas into actionable experiments.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          
          {/* Title */}
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
              placeholder="E.g., Testing AI mood-based themes on user engagement"
              className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
            />
          </div>

          {/* Hypothesis */}
          <div>
            <div className="flex justify-between mb-2">
              <label className="block text-sm font-medium">
                Hypothesis
              </label>

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
                <ReactMarkdown>
                  {formData.hypothesis || "Nothing to preview..."}
                </ReactMarkdown>
              </div>
            ) : (
              <>
                <textarea
                  name="hypothesis"
                  required
                  rows={4}
                  maxLength={300}
                  value={formData.hypothesis}
                  onChange={handleChange}
                  placeholder="What do you expect to happen? E.g., 'If the interface adapts to the user's mood, session length will increase because...' (Supports Markdown)"
                  className="w-full px-4 py-3 rounded-xl border bg-background focus:ring-2 focus:ring-primary transition"
                />
                <p className="text-xs text-right mt-1 text-muted-foreground">
                  {formData.hypothesis.length}/300 characters
                </p>
              </>
            )}
          </div>

          {/* Dates */}
          <div className="grid md:grid-cols-2 gap-6">
            
            {/* Start Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                Start Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="w-full justify-start flex items-center px-4 py-2 border rounded-md hover:bg-muted"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startDate
                      ? format(new Date(formData.startDate), "PPP")
                      : "Pick start date"}
                  </button>
                </PopoverTrigger>

                {/* Fix: w-auto and p-0 are essential for Shadcn calendars */}
                <PopoverContent
                  align="start"
                  className="w-auto p-0 z-50"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.startDate
                        ? new Date(formData.startDate)
                        : undefined
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setFormData((prev) => ({
                        ...prev,
                        startDate: format(date, "yyyy-MM-dd"),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* End Date */}
            <div>
              <label className="block text-sm font-medium mb-2">
                End Date
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    className="flex w-full items-center justify-start rounded-md border px-4 py-2 hover:bg-muted transition"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.endDate
                      ? format(new Date(formData.endDate), "PPP")
                      : "Pick end date"}
                  </button>
                </PopoverTrigger>

                {/* Fix: w-auto and p-0 are essential for Shadcn calendars */}
                <PopoverContent
                  align="start"
                  className="w-auto p-0 z-50"
                >
                  <Calendar
                    mode="single"
                    selected={
                      formData.endDate
                        ? new Date(formData.endDate)
                        : undefined
                    }
                    disabled={(date) =>
                      formData.startDate
                        ? date < new Date(formData.startDate)
                        : false
                    }
                    onSelect={(date) => {
                      if (!date) return;
                      setFormData((prev) => ({
                        ...prev,
                        endDate: format(date, "yyyy-MM-dd"),
                      }));
                    }}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

          </div>

          {/* Linked Idea */}
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

          {/* Submit */}
          <div className="pt-4 flex justify-end">
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="px-8 py-3 flex items-center gap-2"
            >
              {isSubmitting ? "Creating..." : "Create Experiment"}
              {!isSubmitting }
            </Button>
          </div>

        </form>
      </MagicCard>
    </Container>
    </>
  );
}