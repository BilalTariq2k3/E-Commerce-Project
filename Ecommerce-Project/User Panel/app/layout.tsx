import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Script from "next/script";

import Providers from "./provider";

export const metadata = {
  title: "My App",
  description: "My Next.js App",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.css"
        />
      </head>

      <body>
        <Providers>
          {children}

          {/* Zendesk Chatbot */}
          <Script
            id="ze-snippet"
            strategy="afterInteractive"
            src="https://static.zdassets.com/ekr/snippet.js?key=e960acd2-02a5-4f70-87a0-a01d34510367"
          />

          {/* Toast Container */}
          <ToastContainer position="top-right" autoClose={3000} />
        </Providers>
      </body>
    </html>
  );
}
