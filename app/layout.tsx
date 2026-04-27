import "./globals.css";
import { Syne, DM_Sans } from "next/font/google";
import type {Metadata} from 'next';

// PRD Section 14: Modern, digital-first typography
const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  weight: ["700", "800"],
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm",
  weight: ["400", "500"],
});

export const metadata = {
  title: "GreenDrop | Be The Hero Of Your Game",
  description:
    "A modern platform where golf performance fuels charitable impact.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-ink text-white font-dm m-0">
        {/* Navigation - PRD Section 10 */}
        <nav className="py-6 px-8 border-b border-border flex justify-between items-center bg-ink">
          <div className="font-syne text-xl font-extrabold text-lime">
            <a href="/">GREENDROP</a>
          </div>
          <div className="flex gap-8 text-sm">
            <a href="/dashboard" className="text-white no-underline">
              Dashboard
            </a>
            <a href="/charity" className="text-white no-underline">
              Charities
            </a>
            <a href="/admin" className="text-muted2 no-underline">
              Admin
            </a>
          </div>
        </nav>

        {children}

        {/* Footer - PRD Section 14 */}
        <footer className="py-16 px-8 border-t border-border text-center text-muted2 text-xs">
          <p>© 2024 GreenDrop. Digital Heroes PRD Compliant.</p>
        </footer>
      </body>
    </html>
  );
}
