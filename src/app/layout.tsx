import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AI Quiz Generator",
  description: "Generate beautiful and interactive quizzes instantly using AI.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <div className="bg-blobs">
          <div className="blob-1"></div>
          <div className="blob-2"></div>
        </div>
        <nav className="glass" style={{ margin: '1rem', padding: '1rem 2rem', borderRadius: '100px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }} className="text-gradient">
            QuizGen AI
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <a href="/" style={{ fontWeight: 500 }}>Home</a>
            <a href="/dashboard" style={{ fontWeight: 500 }}>Dashboard</a>
          </div>
        </nav>
        <main>
          {children}
        </main>
      </body>
    </html>
  );
}
