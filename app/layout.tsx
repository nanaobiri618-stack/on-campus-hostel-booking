// app/layout.tsx
import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  // Add this line to fix the warning
  metadataBase: new URL("http://localhost:3000"), 
  title: "Your App Name",
  description: "Your App Description",
};

import { Navbar } from "./components/Navbar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`font-sans bg-slate-50 text-slate-900 antialiased`}>

        
        <Navbar />

        {/* PAGE CONTENT */}
        <div className="min-h-screen">{children}</div>

        {/* FOOTER */}
        <footer className="mt-20 border-t bg-white py-16">
          <div className="mx-auto max-w-6xl px-4 grid grid-cols-1 md:grid-cols-3 gap-12">
            
            {/* Section 1 */}
            <div>
              <p className="text-lg font-black text-blue-600">On Campus Ghana</p>
              <p className="mt-2 text-sm text-slate-500">
                Making student housing search stress-free and verified across Ghana.
              </p>
            </div>

            {/* Section 2 */}
            <div className="flex flex-col gap-2">
              <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Quick Links</p>
              <Link href="/search" className="text-sm text-slate-500 hover:text-blue-600">Browse Hostels</Link>
              <Link href="/owner/dashboard" className="text-sm text-slate-500 hover:text-blue-600">List Your Hostel</Link>
            </div>

            {/* Section 3 */}
            <div>
              <p className="font-bold text-slate-900 uppercase text-xs tracking-widest">Support</p>
              <p className="mt-2 text-sm text-slate-500">Contact us: nanaobiri618@gmail.com</p>
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