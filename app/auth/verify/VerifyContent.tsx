"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VerifyContent() {
  const [status, setStatus] = useState("verifying");
  const router = useRouter();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        console.log("Verification: Starting email verification...");

        // Process Supabase magic link and get session
        const { data, error } = await supabase.auth.getSessionFromUrl({
          storeSession: true
        });

        if (error) {
          console.error("Verification error:", error);
          setStatus("error");
          return;
        }

        console.log("Verification data:", data);

        if (data.session?.user) {
          console.log("User verified:", data.session.user.email);

          // Ensure session is properly stored by setting it explicitly
          await supabase.auth.setSession({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token
          });

          // Force a page reload to ensure session is properly stored
          window.location.href = "/dashboard";
        } else {
          console.log("No session found after verification");
          setStatus("error");
        }
      } catch (err) {
        console.error("Verification error:", err);
        setStatus("error");
      }
    };

    verifyEmail();
  }, []);

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
              <h1 className="font-syne text-2xl font-bold text-lime mb-4">
                Email Verified!
              </h1>
              <p className="text-muted2 text-sm mb-6">
                Your account has been successfully verified. Redirecting to your dashboard.
              </p>
              <p className="text-muted2 text-xs">
                If you are not redirected, <Link href="/login" className="text-lime hover:underline">click here to login</Link>.
              </p>
            </>
          )}

          {status === "error" && (
            <>
              <h1 className="font-syne text-2xl font-bold text-red-400 mb-4">
                Verification Failed
              </h1>
              <p className="text-muted2 text-sm mb-6">
                The verification link is invalid or has expired. Please try signing up again.
              </p>
              <Link
                href="/signup"
                className="btn-primary inline-block"
              >
                Sign Up Again
              </Link>
            </>
          )}
        </div>
      </div>
    </main>
  );
}