"use client";
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react"; // ✅ FIX: EyeClosed doesn't exist in lucide-react — use EyeOff

interface AuthFormProps {
  mode?: "login" | "signup";
}

export default function AuthForm({ mode = "login" }: AuthFormProps) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPwd, setShowPwd] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        const trimmedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signUp({
          email: trimmedEmail,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/verify`,
          },
        });
        if (error) {
          if (
            error.message.toLowerCase().includes("already registered") ||
            error.message.toLowerCase().includes("already signed up")
          ) {
            setError("This email is already registered. Please log in instead.");
          } else {
            throw error;
          }
          return;
        }
        setSignupSuccess(true);
      } else {
        const trimmedEmail = email.trim().toLowerCase();
        const { error } = await supabase.auth.signInWithPassword({
          email: trimmedEmail,
          password,
        });
        if (error) throw error;
        // ✅ FIX: was router.push — use replace so the back button doesn't return to login
        router.replace("/dashboard");
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError(null);
    try {
      const trimmedEmail = email.trim().toLowerCase();
      const { error } = await supabase.auth.resend({
        type: "signup",
        email: trimmedEmail,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/verify`,
        },
      });
      if (error) throw error;
      alert("Verification email sent! Check your inbox.");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {signupSuccess && mode === "signup" ? (
        <div className="space-y-4">
          <div className="p-4 bg-lime/10 border border-lime text-lime text-sm rounded-lg">
            <p className="font-bold mb-2">✓ Email sent!</p>
            <p className="text-xs">
              Check your inbox for a verification link. Click it to confirm your account.
            </p>
          </div>
          <button
            onClick={handleResend}
            disabled={loading}
            className="w-full bg-lime/20 border border-lime text-lime py-3 rounded-xl font-syne font-bold text-sm transition-all hover:bg-lime/30 disabled:opacity-50"
          >
            {loading ? "Resending..." : "Resend Email"}
          </button>
          <button
            onClick={() => setSignupSuccess(false)}
            className="w-full text-muted2 py-2 text-xs hover:text-white transition-all"
          >
            Change email
          </button>
        </div>
      ) : (
        <form onSubmit={handleAuth} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/50 text-red-500 text-xs rounded-lg">
              <p>{error}</p>
              {error.toLowerCase().includes("already registered") && mode === "signup" && (
                <Link href="/login" className="text-lime hover:underline font-bold block mt-2">
                  Go to login →
                </Link>
              )}
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
              value={email}
              className="w-full bg-ink border border-border p-4 rounded-xl text-white focus:border-lime outline-none transition-all"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* ✅ FIX: Rewrote the password field — original had a broken outer white div wrapping
              an inner dark input with double borders and an invalid `border-r-none` class.
              Now uses a single clean container with proper icon placement. */}
          <div>
            <label className="text-[10px] uppercase tracking-widest text-muted2 mb-2 block font-bold">
              Password
            </label>
            <div className="relative flex items-center">
              <input
                type={showPwd ? "text" : "password"}
                required
                placeholder="••••••••"
                value={password}
                className="w-full bg-ink border border-border p-4 pr-12 rounded-xl text-white focus:border-lime outline-none transition-all"
                onChange={(e) => setPassword(e.target.value)}
              />
              <button
                type="button"
                onClick={() => setShowPwd((prev) => !prev)}
                className="absolute right-4 text-muted2 hover:text-white transition-colors cursor-pointer"
                aria-label={showPwd ? "Hide password" : "Show password"}
              >
                {showPwd ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>
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
      )}
    </>
  );
}
