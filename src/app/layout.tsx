// src/app/layout.tsx
import './globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'HeyGen Embed',
  description: 'Interactive Avatar',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="no">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
