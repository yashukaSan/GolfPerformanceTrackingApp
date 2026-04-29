"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// ✅ FIX: `supabase.auth.getSessionFromUrl()` is deprecated in @supabase/supabase-js v2.
// With @supabase/ssr's createBrowserClient, the client automatically detects and exchanges
// the `token_hash` + `type` query params Supabase appends to the emailRedirectTo URL.
// We just need to call `getSession()` after a brief wait for the exchange to complete,
// or use `onAuthStateChange` to react to the SIGNED_IN event.

export default function VerifyContent() {
  const [status, setStatus] = useState("verifying");
  const router = useRouter();

  useEffect(() => {
    // Listen for the auth state change that Supabase fires automatically
    // when it processes the token_hash in the URL on page load.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === "SIGNED_IN" && session?.user) {
          setStatus("success");
          // Small delay so the user sees the success message
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);
        } else if (event === "TOKEN_REFRESHED") {
          // Token was refreshed — session is valid
          setStatus("success");
          setTimeout(() => {
            router.replace("/dashboard");
          }, 1500);
        }
      }
    );

    // Fallback: if already signed in (page refresh), redirect immediately
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setStatus("success");
        setTimeout(() => router.replace("/dashboard"), 1500);
      } else {
        // If after a reasonable wait nothing happens, show error
        const timeout = setTimeout(() => {
          setStatus((prev) => (prev === "verifying" ? "error" : prev));
        }, 5000);
        return () => clearTimeout(timeout);
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
      <Link href="/" className="mb-10">
        <div className="font-syne text-3xl font-extrabold text-lime tracking-tighter">
          GREENDROP
        </div>
      </Link>

      <div className="w-full max-w-md">
        <div className="bg-ink2 border border-border p-10 rounded-3xl shadow-2xl text-center">
          {status === "verifying" && (
            <>
              <div className="animate-pulse w-12 h-12 rounded-full bg-lime/20 border border-lime mx-auto mb-6" />
              <h1 className="font-syne text-2xl font-bold text-white mb-4">
                Verifying your email...
              </h1>
              <p className="text-muted2 text-sm">
                Please wait while we confirm your email address.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="w-12 h-12 rounded-full bg-lime/20 border border-lime flex items-center justify-center mx-auto mb-6 text-lime text-2xl">
                ✓
              </div>
              <h1 className="font-syne text-2xl font-bold text-lime mb-4">
                Email Verified!
              </h1>
              <p className="text-muted2 text-sm mb-6">
                Your account is confirmed. Redirecting to your dashboard...
              </p>
              <p className="text-muted2 text-xs">
                Not redirecting?{" "}
                <Link href="/login" className="text-lime hover:underline">
                  Click here to log in
                </Link>.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="w-12 h-12 rounded-full bg-red-500/20 border border-red-500 flex items-center justify-center mx-auto mb-6 text-red-400 text-2xl">
                ✕
              </div>
              <h1 className="font-syne text-2xl font-bold text-red-400 mb-4">
                Verification Failed
              </h1>
              <p className="text-muted2 text-sm mb-6">
                The verification link is invalid or has expired. Please try signing up again.
              </p>
              <Link href="/signup" className="btn-primary inline-block">
                Sign Up Again
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
