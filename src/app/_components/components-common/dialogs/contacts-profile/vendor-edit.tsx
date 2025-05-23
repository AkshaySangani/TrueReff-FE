"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  addAddressVendorSchema,
  addContactVendorSchema,
  IAddAddressVendorSchema,
  IAddContactVendorSchema,
  IVendorProfileUpdateSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import axios from "@/lib/web-api/axios";
import { useTranslations } from "next-intl";

export default function EditContactVendorForm({
  profile,
  id,
  onClose,
}: {
  profile: any;
  id: any;
  onClose: any;
}) {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const schema = addContactVendorSchema;
  const methods = useForm<IAddContactVendorSchema>({
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      email: profile?.email || ""
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = async (data: IAddContactVendorSchema) => {
    setLoading(true);
    try {
      const payload = data;
      let response: any;

      if (profile) {
        response = await axios.put(`/auth/vendor/contact/${profile?._id}`, payload);
      } else {
        response = await axios.post("/auth/vendor/contact", payload);
      }
      if (response?.data) {
        response = response?.data;
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(response?.message);
        router.push("?");
        methods?.reset();
        onClose && onClose(true);
        return true;
      }
      throw response;
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  return (
    <>
      <FormProvider {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="grid grid-cols-2 text-left gap-3 w-full relative"
        >
          <div className="col-span-2">
            <Input name="name" type="name" placeholder={translate("Name")} />
          </div>
          <div className="col-span-2">
            <Input
              name="phone"
              type="phone"
              placeholder={translate("Mobile_Number")}
            />
          </div>
          <div className="col-span-2">
            <Input name="email" type="email" placeholder={translate("Email")} />
          </div>

          <div className="pt-6 col-span-2 sticky bottom-0 bg-white">
            <Button type="submit" loading={loading}>
              {translate("Save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
