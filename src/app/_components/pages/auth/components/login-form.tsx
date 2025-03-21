"use client";
import { ILoginSchema, loginSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import { signIn } from "next-auth/react";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import Link from "next/link";
import { MdOutlineEmail } from "react-icons/md";
import { PiLockKey } from "react-icons/pi";
import { loginAPI } from "@/lib/web-api/auth";
import { translate } from "@/lib/utils/translate";
import { IPostLoginResponse } from "@/lib/types-api/auth";
import { useAuthStore } from "@/lib/store/auth";
import { USER_TYPE } from "@/lib/utils/constants";

export default function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = loginSchema;
  const { setAuthData } = useAuthStore();
  const methods = useForm<ILoginSchema>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: ILoginSchema) => {
    setLoading(true);
    try {
      ("use server");
      const res: IPostLoginResponse = await loginAPI({
        email: data?.email,
        password: data?.password,
      });
      if (res?.status === 200 || res?.status === 201) {
        if (res?.data?.otpSent) {
          toast.success("Sent Email Successfully.");
          router?.push(`/email-verify?email=${data?.email}`);
          return true;
        }
        const response = await signIn("credentials", {
          username: data?.email,
          password: data?.password,
          redirect: false,
        });

        if (response?.ok) {
          toast.success("Login Successfully.");
          if (
            !res?.data?.detailsFilled &&
            [USER_TYPE.Creator, USER_TYPE.Vendor].includes(res?.data?.type)
          ) {
            res?.data?.type === USER_TYPE.Vendor
              ? router?.push("/vendor-register")
              : router?.push(`/creator-registration?email=${data?.email}`);
          } else {
            router?.push(`/${res?.data?.type}/dashboard`);
          }
          methods?.reset();
          return true;
        }
        if (res?.status === 200) {
          toast.success("Login Successfully.");
          methods?.reset();
          router.push("/products");
          return true;
        }
        throw "Internal server error";
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <FormProvider {...methods}>
      <form
        onSubmit={methods.handleSubmit(onSubmit)}
        className="w-full flex flex-col gap-3"
      >
        <Input
          name="email"
          type="email"
          placeholder={translate("Email")}
          Icon={MdOutlineEmail}
        />
        <Input
          name="password"
          type="password"
          placeholder={translate("Password")}
          Icon={PiLockKey}
        />
        <div className="mt-3 text-[16px] flex align-middle justify-between  text-gray-600">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" className="w-4 h-4" />
            <span className="">{translate("Remember_Me")}</span>
          </label>
          <Link href="/forgot-password" className="cursor-pointer text-sm">
            <span className="text-primary-color font-medium">
              {translate("Forgot_Password?")}
            </span>
          </Link>
        </div>
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          {translate("Login")}
        </Button>
      </form>
    </FormProvider>
  );
}
