"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarIcon, ArrowRight } from "lucide-react";
import Container from "./ui/Container";
import ReactMarkdown from "react-markdown";

import { useExperiments } from "../context/ExperimentsContext";

export function ExperimentForm() {
    const [preview, setPreview] = useState(false);

    const router = useRouter();
    const { addExperiment } = useExperiments();
    const [formData, setFormData] = useState({
        title: "",
        hypothesis: "",
        startDate: "",
        endDate: "",
        linkedIdeaId: "",
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    const ideas = [
        { id: "1", title: "Idea 1: New Feature X" },
        { id: "2", title: "Idea 2: Improve Performance Y" },
        { id: "3", title: "Idea 3: Redesign UI Z" },
    ];

    const handleChange = (
        e: React.ChangeEvent<
            HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
        >
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);



            // Simulate a short delay for UX
            setTimeout(() => {
                setIsSubmitting(false);
                router.push("/experiments");
            }, 500);
        } catch (error) {
            console.error("Failed to create experiment:", error);
            setIsSubmitting(false);
        }
    };

    return (
        <Container className="max-w-2xl py-12">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Create New Experiment</h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Turn your ideas into actionable experiments.
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title */}
                <div>
                    <label
                        htmlFor="title"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Experiment Title
                    </label>
                    <input
                        type="text"
                        id="title"
                        name="title"
                        required
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
                        placeholder="E.g., A/B Test for Landing Page"
                    />
                </div>

                {/* Hypothesis */}
                <div>
                    <div className="flex items-center justify-between mb-1">
                        <label
                            htmlFor="hypothesis"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                        >
                            Hypothesis
                        </label>

                        <button
                            type="button"
                            onClick={() => setPreview((p) => !p)}
                            className="text-xs px-3 py-1 rounded-md border bg-gray-100 hover:bg-gray-200 dark:bg-slate-700 dark:hover:bg-slate-600"
                        >
                            {preview ? "Write" : "Preview"}
                        </button>
                    </div>

                    {preview ? (
                        <div className="w-full px-4 py-3 border rounded-lg bg-white dark:bg-slate-800 dark:border-slate-700 prose max-w-none min-h-[120px]">
                            <ReactMarkdown>
                                {formData.hypothesis || "Nothing to preview..."}
                            </ReactMarkdown>
                        </div>
                    ) : (
                        <>
                            <textarea
                                id="hypothesis"
                                name="hypothesis"
                                required
                                rows={4}
                                value={formData.hypothesis}
                                onChange={handleChange}
                                maxLength={300}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
                                placeholder="Supports Markdown: **bold**, # heading, - list"
                            />

                            <p className="text-xs text-right mt-1 text-gray-500">
                                {formData.hypothesis.length}/300 characters
                            </p>
                        </>
                    )}
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label
                            htmlFor="startDate"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            Start Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="startDate"
                                name="startDate"
                                required
                                value={formData.startDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
                            />
                            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>

                    <div>
                        <label
                            htmlFor="endDate"
                            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                        >
                            End Date
                        </label>
                        <div className="relative">
                            <input
                                type="date"
                                id="endDate"
                                name="endDate"
                                required
                                value={formData.endDate}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
                            />
                            <CalendarIcon className="absolute right-3 top-2.5 h-5 w-5 text-gray-400 pointer-events-none" />
                        </div>
                    </div>
                </div>

                {/* Linked Idea */}
                <div>
                    <label
                        htmlFor="linkedIdeaId"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                    >
                        Link to an Idea (Optional)
                    </label>
                    <select
                        id="linkedIdeaId"
                        name="linkedIdeaId"
                        value={formData.linkedIdeaId}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-slate-800 dark:border-slate-700"
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
                <div className="pt-4">
                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? "Creating..." : "Create Experiment"}
                        {!isSubmitting && <ArrowRight className="w-5 h-5" />}
                    </button>
                </div>
            </form>
        </Container>
    );
}
