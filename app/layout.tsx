import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const ttNorms = localFont({
  src: [
    {
      path: "../public/fonts/tt_norms_pro_trial_normal-webfont.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "../public/fonts/tt_norms_pro_trial_bold-webfont.woff2",
      weight: "700",
      style: "normal",
    },
  ],
  variable: "--font-tt-norms",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Manual - Be good to yourself",
  description:
    "Holistic approach to your wellness. From top to bottom, inside and out.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={ttNorms.variable}>
      <body className="font-tt-norms antialiased">{children}</body>
    </html>
  );
}
