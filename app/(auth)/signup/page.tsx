"use client";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { Suspense } from "react";

function SignupContent() {
  const router = useRouter();
  const setPlan = (plan: string) => {
    router.replace(`?plan=${plan}`);
  };
  const searchParams = useSearchParams();
  const selectedPlan = searchParams.get("plan") || "monthly";

  return (
    <main className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
      {/* Brand Logo */}
      <Link href="/" className="mb-10">
        <div className="font-syne text-3xl font-extrabold text-lime tracking-tighter">
          GREENDROP
        </div>
      </Link>

      <div className="w-full max-w-xl">
        <div className="bg-ink2 border border-border p-10 rounded-3xl shadow-2xl">
          {/* Header */}
          <div className="mb-10 text-center">
            <h1 className="font-syne text-3xl font-bold text-white mb-2">
              Create Your Account
            </h1>
            <p className="text-muted2 text-sm">
              Join the platform where your performance fuels impact.
            </p>
          </div>

          {/* Plan Selection Summary - PRD Section 04 */}
          <div className="grid grid-cols-2 gap-4 mb-10">
            <button
              onClick={() => setPlan("monthly")}
              className={`p-4 rounded-xl border-2 transition-all ${selectedPlan === "monthly" ? "border-lime bg-lime/5" : "border-border"}`}
            >
              <p className="text-[10px] uppercase font-bold text-muted2">
                Monthly Hero
              </p>
              <p className="text-xl font-bold">
                £9<span className="text-xs">/mo</span>
              </p>
            </button>
            <button
              onClick={() => setPlan("yearly")}
              className={`p-4 rounded-xl border-2 transition-all ${selectedPlan === "yearly" ? "border-lime bg-lime/5" : "border-border"}`}
            >
              <div className="flex justify-between items-start">
                <p className="text-[10px] uppercase font-bold text-muted2">
                  Annual Legend
                </p>
                <span className="bg-lime text-black text-[8px] px-2 py-0.5 rounded-full font-bold">
                  BEST VALUE
                </span>
              </div>
              <p className="text-xl font-bold">
                £79<span className="text-xs">/yr</span>
              </p>
            </button>
          </div>

          {/* Reusing AuthForm with a 'signup' mode */}
          <AuthForm mode="signup" />

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted2 text-xs">
              Already a member?{" "}
              <Link
                href="/login"
                className="text-lime hover:underline font-bold"
              >
                Log in to dashboard
              </Link>
            </p>
          </div>
        </div>

        {/* Legal Disclaimer - PRD Section 15 */}
        <p className="mt-8 text-center text-[10px] text-muted2 max-w-sm mx-auto leading-relaxed">
          By joining, you agree to our Terms of Service. A minimum of 10% of
          your subscription is allocated to your chosen charity monthly.
        </p>
      </div>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignupContent />
    </Suspense>
  );
}
