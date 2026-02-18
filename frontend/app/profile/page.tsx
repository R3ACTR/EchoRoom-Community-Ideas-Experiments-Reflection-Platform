"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagicCard } from "@/components/ui/magic-card";
import { Meteors } from "@/components/ui/meteors";
import { ShinyButton } from "@/components/ui/shiny-button";
import HomeIcon from "@/components/ui/home-icon";
import { ArrowLeft, Save, Edit2, Loader2 } from "lucide-react";

interface UserData {
  name: string;
  email: string;
  role: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formData, setFormData] = useState({ name: "", email: "" });
  const router = useRouter();

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (!storedUser) {
      router.push("/login");
      return;
    }
    try {
      const userData: UserData = JSON.parse(storedUser);
      setUser(userData);
      setFormData({ name: userData.name || "", email: userData.email });
    } catch {
      router.push("/login");
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSave = async () => {
    if (!formData.name.trim()) {
      setError("Name is required.");
      return;
    }

    setError("");
    setSuccess("");
    setSaving(true);

    try {
      const users = JSON.parse(localStorage.getItem("users") || "[]");
      const userIndex = users.findIndex((u: UserData) => u.email === user?.email);

      if (userIndex !== -1) {
        users[userIndex].name = formData.name;
        users[userIndex].email = formData.email;
        localStorage.setItem("users", JSON.stringify(users));
      }

      const updatedUser: UserData = { 
        ...user!, 
        name: formData.name, 
        email: formData.email,
        role: user?.role || "user"
      };
      localStorage.setItem("user", JSON.stringify(updatedUser));
      setUser(updatedUser);
      setIsEditing(false);
      setSuccess("Profile updated successfully!");
    } catch {
      setError("Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({ name: user?.name || "", email: user?.email || "" });
    setIsEditing(false);
    setError("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
      </main>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <main className="relative min-h-screen bg-slate-50 dark:bg-slate-950 flex items-start justify-center px-4 py-16">
      <Meteors number={18} className="opacity-40 dark:opacity-60" />

      <div className="relative z-10 w-full max-w-md">
        <MagicCard className="p-[1px] rounded-xl" gradientColor="rgba(99,102,241,0.8)">
          <div className="p-6 bg-white/80 dark:bg-slate-900/70 backdrop-blur-xl rounded-xl shadow-xl">
            <Link href="/ideas" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 dark:hover:text-white transition mb-4">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm">Back to Ideas</span>
            </Link>

            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Profile</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/30 rounded-lg transition"
                >
                  <Edit2 className="w-4 h-4" />
                  Edit
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg p-3 mb-4 text-sm border border-red-200 dark:border-red-800">
                ⚠️ {error}
              </div>
            )}

            {success && (
              <div className="bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 rounded-lg p-3 mb-4 text-sm border border-green-200 dark:border-green-800">
                ✓ {success}
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">
                  Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                  />
                ) : (
                  <p className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {user.name || "Not set"}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">
                  Email
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-900 dark:text-white placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition"
                  />
                ) : (
                  <p className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white">
                    {user.email}
                  </p>
                )}
              </div>

              <div>
                <label className="text-sm font-medium text-slate-900 dark:text-white mb-1.5 block">
                  Role
                </label>
                <p className="px-4 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white capitalize">
                  {user.role}
                </p>
              </div>
            </div>

            {isEditing && (
              <div className="flex gap-3 mt-6">
                <ShinyButton
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 font-semibold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </>
                  )}
                </ShinyButton>
                <button
                  onClick={handleCancel}
                  disabled={saving}
                  className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </MagicCard>
      </div>
    </main>
  );
}
