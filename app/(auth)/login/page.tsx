"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [debugInfo, setDebugInfo] = useState<string>("");

  const checkAuth = async () => {
    console.log("Login: Checking authentication..."); // Debug log
    const { data: { session }, error } = await supabase.auth.getSession();
    console.log("Login: Session found:", session, "Error:", error); // Debug log
    setDebugInfo(`Session: ${session ? 'Found' : 'Not found'}, User: ${session?.user?.email || 'None'}, Error: ${error?.message || 'None'}`);
    return session;
  };

  useEffect(() => {
    const initCheck = async () => {
      const session = await checkAuth();
      if (session?.user) {
        console.log("Login: User authenticated, redirecting to dashboard"); // Debug log
        // User is already logged in, redirect to dashboard
        setIsAuthenticated(true);
        // Use replace instead of push to avoid back button issues
        router.replace("/dashboard");
      } else {
        console.log("Login: No session found, showing login form"); // Debug log
        setLoading(false);
      }
    };
    initCheck();
  }, [router]);

  if (loading) return <div className="min-h-screen bg-ink flex items-center justify-center text-white">Loading...</div>;
  if (isAuthenticated)
    return (
      <main className="min-h-screen bg-ink flex items-center justify-center p-6 text-white">
        <div className="text-center space-y-3">
          <p className="text-lg font-bold">Already Signed In</p>
          <p className="text-sm text-muted2">Redirecting to your dashboard...</p>
        </div>
      </main>
    );
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

          {/* Debug Info */}
          {debugInfo && (
            <div className="mt-4 p-3 bg-gray-500/10 border border-gray-500 text-gray-300 text-xs rounded-lg">
              <p className="font-bold mb-1">Debug Info:</p>
              <p>{debugInfo}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={checkAuth}
                  className="px-3 py-1 bg-blue-500/20 border border-blue-500 text-blue-400 rounded text-xs hover:bg-blue-500/30"
                >
                  Refresh Session Check
                </button>
                <button
                  onClick={async () => {
                    await supabase.auth.signOut();
                    setDebugInfo("Signed out");
                    setLoading(false);
                    setIsAuthenticated(false);
                  }}
                  className="px-3 py-1 bg-red-500/20 border border-red-500 text-red-400 rounded text-xs hover:bg-red-500/30"
                >
                  Force Sign Out
                </button>
              </div>
            </div>
          )}

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
