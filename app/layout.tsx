import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MediGuide 360",
  description: "A patient-friendly healthcare companion prototype",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
