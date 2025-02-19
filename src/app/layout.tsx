import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import type { Metadata } from "next";
import NextAuthProvider from "@/lib/context/auth-session-provider";
import Dialogs from "@/app/_components/components-common/dialogs";
import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <body>
        <NextAuthProvider>
          <NextIntlClientProvider messages={messages}>
            {children}
            <Dialogs />
            <Toaster position="top-right" />
          </NextIntlClientProvider>
        </NextAuthProvider>
      </body>
    </html>
  );
}
