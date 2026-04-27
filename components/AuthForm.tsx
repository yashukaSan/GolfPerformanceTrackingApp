"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

interface AuthFormProps {
  mode?: "login" | "signup";
}

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;
        alert("Check your email to confirm your account!");
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleAuth} className="space-y-4">
      {error && (
        <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-lg">
          {error}
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted2 mb-2 block font-bold">
          Email Address
        </label>
        <input
          type="email"
          required
          placeholder="hero@greendrop.com"
          className="w-full bg-ink border border-border p-4 rounded-xl text-white focus:border-lime outline-none transition-all"
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div>
        <label className="text-[10px] uppercase tracking-widest text-muted2 mb-2 block font-bold">
          Password
        </label>
        <input
          type="password"
          required
          placeholder="••••••••"
          className="w-full bg-ink border border-border p-4 rounded-xl text-white focus:border-lime outline-none transition-all"
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full btn-primary py-4 rounded-xl font-syne font-bold text-sm mt-4 disabled:opacity-50"
      >
        {loading
          ? "Processing..."
          : mode === "login"
            ? "Access Dashboard"
            : "Create Hero Account"}
      </button>
    </form>
  );
}
