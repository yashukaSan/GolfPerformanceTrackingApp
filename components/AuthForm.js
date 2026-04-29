// ✅ NOTE: This file (AuthForm.js) is an older version superseded by AuthForm.tsx.
// AuthForm.tsx is the one actually used by the login/signup pages.
// This file is kept for reference but should be DELETED to avoid confusion.
//
// If you must use this JS version, the signUp call below was WRONG in the original:
//   supabase.auth.signUp({ email, password }, authOptions)  ← INCORRECT (2 args)
// It should be:
//   supabase.auth.signUp({ email, password, options: authOptions })  ← CORRECT

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function AuthForm({ mode }) {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAuth = async (type) => {
    setLoading(true);

    const redirectUrl = `${window.location.origin}/auth/verify`;

    const { data, error } =
      type === "LOGIN"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({
            email,
            password,
            // ✅ FIX: options must be inside the object, not a second argument
            options: { emailRedirectTo: redirectUrl },
          });

    if (error) {
      alert(`Error: ${error.message}`);
    } else if (type === "SIGNUP") {
      if (data?.user && !data.user.email_confirmed_at) {
        alert("Signup successful! Check your email for verification link.");
      } else {
        alert("Signup successful! You can now log in.");
      }
    } else {
      router.replace("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="bg-ink2 p-8 rounded-lg border border-border">
      <h2 className="font-syne mb-6">Welcome to GreenDrop</h2>
      <input
        type="email"
        placeholder="Email"
        className="w-full px-3 py-2 bg-ink border border-border rounded text-white placeholder-muted2 mb-4"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="w-full px-3 py-2 bg-ink border border-border rounded text-white placeholder-muted2"
        onChange={(e) => setPassword(e.target.value)}
      />
      <div className="mt-8 flex gap-4">
        <button onClick={() => handleAuth("LOGIN")} className="btn-primary" disabled={loading}>
          {loading ? "..." : "Login"}
        </button>
        <button onClick={() => handleAuth("SIGNUP")} className="btn-ghost" disabled={loading}>
          Sign Up
        </button>
      </div>
    </div>
  );
}
