import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";

const poppins = Poppins({
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  subsets: ["latin"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "EXPLICIT DP Blast - Custom Profile Picture Generator",
  description: "Create your custom profile picture with status-specific frames for your organization",
  icons: {
    icon: '/logo_explicit.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${poppins.variable} antialiased`}
      >
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: 'rgba(255, 255, 255, 0.9)',
              color: '#1e40af',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '12px',
              fontWeight: '500',
            },
            success: {
              iconTheme: {
                primary: '#10b981',
                secondary: '#ffffff',
              },
            },
          }}
        />
      </body>
    </html>
  );
}
