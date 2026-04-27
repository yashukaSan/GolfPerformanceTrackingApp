"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function VerifyContent() {
  const [status, setStatus] = useState("verifying");
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const verifyEmail = async () => {
      const token = searchParams.get("token");
      const type = searchParams.get("type");

      if (!token || type !== "email") {
        setStatus("error");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: "email",
      });

      if (error) {
        setStatus("error");
      } else {
        setStatus("success");
        // Redirect to login after a short delay
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    };

    verifyEmail();
  }, [searchParams, router]);

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
                Your account has been successfully verified. You can now log in.
              </p>
              <p className="text-muted2 text-xs">
                Redirecting to login page...
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