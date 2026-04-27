"use client";
import { Suspense } from "react";
import VerifyContent from "./VerifyContent";

export default function VerifyPage() {
  return (
    <Suspense fallback={
      <main className="min-h-screen bg-ink flex flex-col items-center justify-center p-6">
        <div className="font-syne text-3xl font-extrabold text-lime tracking-tighter mb-10">
          GREENDROP
        </div>
        <div className="bg-ink2 border border-border p-10 rounded-3xl shadow-2xl text-center">
          <p className="text-muted2 text-sm">Loading...</p>
        </div>
      </main>
    }>
      <VerifyContent />
    </Suspense>
  );
}