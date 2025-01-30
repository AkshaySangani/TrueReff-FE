import Link from "next/link";
import React from "react";
import HeaderAuth from "./components/header-auth";
import AuthLayoutPage from "./auth-layout";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";
import LightButton from "@/lib/ui/button/variant/light-button";
import SocialAuth from "./components/social-auth";

export default function RegisterPage() {
  return (
    <AuthLayoutPage authImage="sign-up-image.svg">
      <HeaderAuth />
      <div className="mt-6 flex flex-col items-center mx-auto max-w-lg">
        <div className="w-full flex-1 ">
          <div className="flex justify-center text-[32px] font-bold text-gray-darken">
            Sign up to get started
          </div>
          <div className="mx-auto max-w-lg mt-5">
            <RegisterForm />
          </div>
          <div className="my-6 border-b text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Or Continue with
            </div>
          </div>
          <SocialAuth />
          <div className="my-6 text-center">
            <div className="leading-none px-2 inline-block text-sm text-gray-600 tracking-wide font-medium bg-white transform translate-y-1/2">
              Already have an account?{" "}
              <Link href="/login" className="text-[#FF4979]">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </AuthLayoutPage>
  );
}
