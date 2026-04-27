"use client";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
      {/* Brand Identity - PRD Section 14 */}
      <Link href="/" className="mb-12">
        <div className="font-syne text-3xl font-extrabold text-lime tracking-tighter">
          GREENDROP
        </div>
      </Link>

      <div className="w-full max-w-md">
        {/* Auth Container */}
        <div className="bg-ink2 border border-border p-10 rounded-3xl shadow-2xl">
          <div className="mb-8">
            <h1 className="font-syne text-3xl font-bold text-white mb-2">
              Welcome Back
            </h1>
            <p className="text-muted2 text-sm">
              Log in to track your scores and impact.
            </p>
          </div>

          {/* Reusing the AuthForm component built for the logic layer */}
          <AuthForm />

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted2 text-xs">
              Don't have an account?{" "}
              <Link
                href="/signup"
                className="text-lime hover:underline font-bold"
              >
                Join the Hero platform
              </Link>
            </p>
          </div>
        </div>

        {/* Security Footer - PRD Section 15 */}
        <div className="mt-8 flex justify-center gap-6 text-[10px] text-muted2 uppercase tracking-widest">
          <span>Secure AES-256</span>
          <span>•</span>
          <span>SSL Protected</span>
          <span>•</span>
          <span>PCI Compliant</span>
        </div>
      </div>
    </main>
  );
}
