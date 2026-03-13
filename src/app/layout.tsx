import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import localFont from "next/font/local";

const inter = localFont({
  src: "./fonts/Inter-Regular.woff2",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "On Campus Ghana — Find Verified Student Hostels Fast",
  description: "Search and book verified student hostels across Ghana by campus and budget.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
          <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
            <Link href="/" className="text-xl font-black tracking-tight text-blue-600">
              On Campus <span className="text-slate-900">Ghana</span>
            </Link>

            <nav className="hidden gap-8 md:flex text-sm font-bold uppercase tracking-wider text-slate-500">
              <Link href="/" className="hover:text-blue-600 transition">Home</Link>
              <Link href="/search" className="hover:text-blue-600 transition">Browse Hostels</Link>
              <Link href="/owner/dashboard" className="hover:text-blue-600 transition">My Listings</Link>
            </nav>

            <div className="flex items-center gap-6">
              <Link
                href="/owner/dashboard"
                className="hidden lg:block text-xs font-black uppercase tracking-widest text-blue-600 hover:text-blue-700 transition"
              >
                Owner Portal
              </Link>

              <div className="h-4 w-[1px] bg-slate-200 hidden lg:block" />

              <Link href="/login" className="text-sm font-bold text-slate-600 hover:text-blue-600 transition">
                Log In
              </Link>

              <Link
                href="/register"
                className="rounded-full bg-blue-600 px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-100 hover:bg-blue-700 transition active:scale-95"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </header>

        <div className="min-h-screen">{children}</div>

        <footer className="mt-20 border-t bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <p className="text-lg font-black text-blue-600">On Campus Ghana</p>
              <p className="mt-2 text-sm text-slate-500">
                Making student housing search stress-free and verified across Ghana.
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Quick Links</p>
              <Link href="/search" className="text-sm text-slate-500 hover:text-blue-600">Browse Hostels</Link>
              <Link href="/owner/dashboard" className="text-sm text-slate-500 hover:text-blue-600">List Your Hostel</Link>
            </div>
            <div>
              <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Support</p>
              <p className="mt-2 text-sm text-slate-500">Contact us: support@oncampusgh.com</p>
            </div>
          </div>
          <div className="mt-12 text-center text-xs font-medium text-slate-400">
            © 2026 On Campus Ghana. All rights reserved.
          </div>
        </footer>
      </body>
    </html>
  );
}