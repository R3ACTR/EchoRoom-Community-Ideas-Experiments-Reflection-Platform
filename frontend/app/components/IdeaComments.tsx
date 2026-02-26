"use client";

import { useState, useEffect } from "react";
import { apiFetch } from "../lib/api";
import { MagicCard } from "@/components/ui/magic-card";
import Button from "./ui/Button";
import { MessageSquare, Send, User, Clock, ArrowUpDown } from "lucide-react";

interface Comment {
    id: number;
    username: string;
    content: string;
    createdAt: string;
}

interface IdeaCommentsProps {
    ideaId: number;
    onCountChange?: (count: number) => void;
}

export default function IdeaComments({ ideaId, onCountChange }: IdeaCommentsProps) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState("");
    const [loading, setLoading] = useState(true);
    const [posting, setPosting] = useState(false);
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [newestFirst, setNewestFirst] = useState(true);

    useEffect(() => {
        // Check for logged in user in localStorage
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch (e) {
                console.error("Failed to parse user from localStorage");
            }
        }

        const fetchComments = async () => {
            try {
                const data = await apiFetch<Comment[]>(`/ideas/${ideaId}/comments`);
                setComments(data);
            } catch (err) {
                console.error("Failed to fetch comments", err);
            } finally {
                setLoading(false);
            }
        };

        fetchComments();
    }, [ideaId]);

    // Sync comment count to parent whenever it changes
    useEffect(() => {
        onCountChange?.(comments.length);
    }, [comments.length]);

    const handlePostComment = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim() || posting) return;

        setPosting(true);
        try {
            const res = await apiFetch<Comment>(`/ideas/${ideaId}/comments`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    ...(localStorage.getItem("token") ? { "Authorization": `Bearer ${localStorage.getItem("token")}` } : {})
                },
                body: JSON.stringify({ content: newComment }),
            });

            setComments((prev) => [...prev, res]);
            setNewComment("");
        } catch (err: any) {
            alert(err.message || "Failed to post comment. Make sure you are logged in.");
        } finally {
            setPosting(false);
        }
    };

    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString() + " " + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    const sortedComments = [...comments].sort((a, b) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();
        return newestFirst ? dateB - dateA : dateA - dateB;
    });

    return (
        <div className="mt-12 w-full">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <MessageSquare className="w-6 h-6 text-blue-500" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Discussion ({comments.length})
                    </h2>
                </div>
                {comments.length > 1 && (
                    <button
                        onClick={() => setNewestFirst((p) => !p)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium
                            bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300
                            hover:bg-slate-200 dark:hover:bg-slate-700
                            border border-slate-200 dark:border-slate-700
                            transition-all duration-200"
                        title={newestFirst ? "Show oldest first" : "Show newest first"}
                    >
                        <ArrowUpDown className="w-3.5 h-3.5" />
                        {newestFirst ? "Newest first" : "Oldest first"}
                    </button>
                )}
            </div>

            {/* New Comment Form */}
            <MagicCard
                className="p-[1px] rounded-2xl mb-8"
                gradientColor="rgba(59,130,246,0.4)"
            >
                <div className="bg-white/50 dark:bg-slate-900/50 backdrop-blur-xl p-6 rounded-2xl border border-slate-200 dark:border-white/10">
                    {user ? (
                        <form onSubmit={handlePostComment} className="space-y-4">
                            <div className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-400 mb-2">
                                <User className="w-4 h-4" />
                                <span>Posting as <strong>{user.username || "Community Member"}</strong></span>
                            </div>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Join the conversation..."
                                className="w-full p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:outline-none transition min-h-[100px] resize-y"
                            />
                            <div className="flex justify-end">
                                <button
                                    type="submit"
                                    disabled={posting || !newComment.trim()}
                                    className="flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium text-white
                                        bg-gradient-to-r from-blue-500 to-blue-600
                                        hover:from-blue-600 hover:to-blue-700
                                        disabled:opacity-50 disabled:cursor-not-allowed
                                        transition-all duration-200 shadow-md hover:shadow-lg"
                                >
                                    {posting ? "Posting..." : <><Send className="w-4 h-4" /> Post Comment</>}
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="text-center py-4">
                            <p className="text-slate-600 dark:text-slate-400 mb-4">
                                Please log in to join the discussion.
                            </p>
                            <Button onClick={() => window.location.href = '/login'} variant="outline" className="rounded-full">
                                Log In
                            </Button>
                        </div>
                    )}
                </div>
            </MagicCard>

            {/* Comments List */}
            <div className="space-y-4">
                {loading ? (
                    <div className="text-center py-8 text-slate-500">Loading comments...</div>
                ) : comments.length === 0 ? (
                    <div className="text-center py-12 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                        <p className="text-slate-500 dark:text-slate-400 italic">No comments yet. Be the first to share your thoughts!</p>
                    </div>
                ) : (
                    sortedComments.map((comment) => (
                        <MagicCard
                            key={comment.id}
                            className="p-[1px] rounded-2xl"
                            gradientColor="rgba(59,130,246,0.2)"
                        >
                            <div className="bg-white/80 dark:bg-slate-900/60 backdrop-blur-md p-6 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400">
                                            <User className="w-4 h-4" />
                                        </div>
                                        <span className="font-semibold text-slate-900 dark:text-white">
                                            {comment.username}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-slate-400">
                                        <Clock className="w-3 h-3" />
                                        <span>{formatDate(comment.createdAt)}</span>
                                    </div>
                                </div>
                                <p className="text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </MagicCard>
                    ))
                )}
            </div>
        </div>
    );
}
