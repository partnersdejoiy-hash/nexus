import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'NEXUS — Spatial Computing OS',
  description: 'Production-quality futuristic spatial computing web operating system built with Next.js 15, React Three Fiber, MediaPipe & Gemini AI.',
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/favicon-32.png', sizes: '32x32', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased bg-[#020408] text-slate-100 overflow-hidden select-none">
        {children}
      </body>
    </html>
  );
}
