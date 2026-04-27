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
    let authOptions = {};
    if (type === "SIGNUP") {
      const redirectUrl = `${window.location.origin}/auth/verify`;
      console.log("Redirect URL:", redirectUrl);
      authOptions = {
        emailRedirectTo: redirectUrl
      };
    }
    console.log("Auth options:", authOptions);
    const { data, error } =
      type === "LOGIN"
        ? await supabase.auth.signInWithPassword({ email, password })
        : await supabase.auth.signUp({ email, password }, authOptions);

    console.log("Auth response:", { data, error });

    if (error) {
      console.error("Auth error:", error);
      alert(`Error: ${error.message}`);
    } else if (type === "SIGNUP") {
      console.log("Signup successful, data:", data);
      if (data?.user && !data.user.email_confirmed_at) {
        alert("Signup successful! Check your email for verification link.");
      } else {
        alert("Signup successful! You can now log in.");
      }
    } else {
      alert("Login successful! Redirecting...");
      router.push("/dashboard");
    }
    setLoading(false);
  };

  return (
    <div className="bg-ink2 p-8 rounded-lg border border-border">
      <h2 className="font-syne mb-6">
        Welcome to GreenDrop
      </h2>
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
        <button
          onClick={() => handleAuth("LOGIN")}
          className="btn-primary"
          disabled={loading}
        >
          {loading ? "..." : "Login"}
        </button>
        <button
          onClick={() => handleAuth("SIGNUP")}
          className="btn-ghost"
          disabled={loading}
        >
          Sign Up
        </button>
      </div>
    </div>
  );
}
