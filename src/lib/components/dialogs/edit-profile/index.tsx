"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  IProfileUpdateSchema,
  profileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import DialogLayout from "@/app/_components/ui/layout/dialog";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import axios from "@/lib/web-api/axios";
import { useTranslations } from "next-intl";

const key = "profile";

export default function EditProfile({ profile }: any) {
  const translate = useTranslations();
  const router = useRouter();
  const auth = useSearchParams().get("edit");
  const dialogPath = auth === key;
  const [loading, setLoading] = useState(false);
  const schema = profileUpdateSchema;
  const methods = useForm<IProfileUpdateSchema>({
    defaultValues: {
      name: profile?.name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IProfileUpdateSchema) => {
    setLoading(true);

    try {
      //  ("use server");
      //  const payload: IForgotSchema = {
      //    email: data?.email,
      //  };
      let response: any = await axios.patch("/auth/user", data);
      if (response?.data) {
        response = response?.data;
      }

      if (response?.status === 200) {
        toast.success(response?.message);
        router.push("?");
        methods?.reset();
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
    <DialogLayout
      open={Boolean(dialogPath)}
      size="!max-w-[638px] w-full overflow-auto"
      title="edit_profile"
    >
      <div className="p-4 sm:p-10 sm:bg-white sm:rounded-md sm:shadow-sm w-full text-center overflow-y-auto">
        <FormProvider {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)}>
            <div className="grid grid-cols-2 text-left gap-3">
              <div className="col-span-2">
                <Input
                  name="name"
                  label="Name"
                  type="name"
                  placeholder={translate("Name")}
                />
              </div>
              {/* <div className="col-span-2"> */}
              <Input
                name="email"
                label="Email Address"
                type="email"
                placeholder={translate("Email")}
              />
              <Input
                name="phone"
                label="Phone Number"
                type="phone"
                placeholder={translate("Phone")}
              />
              {/* </div> */}
            </div>
            <div className="mt-6">
              <Button type="submit" loading={loading}>
                Save
              </Button>
            </div>
          </form>
        </FormProvider>
      </div>
    </DialogLayout>
  );
}
