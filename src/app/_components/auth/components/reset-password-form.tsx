"use client";
import { IResetSchema, resetPasswordSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { useRouter,useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Input from "@/lib/ui/form/Input";
import Button from "@/lib/ui/button";
import { resetPasswordAPI } from "@/lib/web-api/auth";

export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = resetPasswordSchema;
  const methods = useForm<IResetSchema>({
    defaultValues: {},
    resolver: yupResolver(schema),
    mode: "onSubmit",
  });

  const onSubmit = async (data: IResetSchema) => {
    setLoading(true);
    try {
      ("use server");
      const payload: IResetSchema = {
        password: data?.password,
        confirmPassword: data?.confirmPassword
    };
    const response: any = await resetPasswordAPI({password: payload?.password,email});

    if (response?.status === 200) {
        toast.success(response?.data?.message);
        methods?.reset();
        router.push(`/reset-password?auth=change-password-success`)
        return true;
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
        <Input name="password" type="password" placeholder="Password" />
        <Input name="confirmPassword" type="password" placeholder="Confirm Password" />
        <Button type="submit" className="mt-3" loading={loading}>
          Verify
        </Button>
      </form>
    </FormProvider>
  );
}
