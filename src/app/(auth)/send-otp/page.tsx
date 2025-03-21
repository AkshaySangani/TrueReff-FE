import React, { Suspense } from "react";
import SendOtpPage from "@/app/_components/pages/auth/send-otp";

export default function page() {
  return <Suspense fallback={<div>Loading...</div>}>
    <SendOtpPage />
  </Suspense>
}
