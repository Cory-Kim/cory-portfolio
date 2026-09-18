import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Cory Kim | Software Developer",
  description:
    "CORY // SYSTEM is the portfolio of Cory Kim, a software developer combining full-stack engineering, AI, and interaction design.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      className="h-full antialiased"
    >
      <body className="min-h-full bg-background text-foreground">{children}</body>
    </html>
  );
}
