import React from "react";
import SendOtpPage from "@/app/_components/auth/send-otp";

export default function page({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  return <SendOtpPage searchParams={searchParams} />;
}
