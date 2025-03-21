"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { FormProvider, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  addAddressVendorSchema,
  IAddAddressVendorSchema,
  IVendorProfileUpdateSchema,
  vendorProfileUpdateSchema,
} from "@/lib/utils/validations";
import { yupResolver } from "@hookform/resolvers/yup";
import { translate } from "@/lib/utils/translate";
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";

export default function EditAddressVendorForm({
  profile,
  id,
  onClose,
}: {
  profile: any;
  id: any;
  onClose: any;
}) {
  const router = useRouter();
  const axios = useAxiosAuth();
  const [loading, setLoading] = useState(false);
  const schema = addAddressVendorSchema;
  const methods = useForm<IAddAddressVendorSchema>({
    defaultValues: {
      name: profile?.name || "",
      phone: profile?.phone || "",
      zip_code: profile?.zip_code || "",
      city: profile?.city || "",
      state: profile?.state || "",
      house_no: profile?.house_no || "",
      address: profile?.address || "",
      isDefault: profile?.isDefault || false,
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });
  const onSubmit = async (data: IAddAddressVendorSchema) => {
    setLoading(true);
    try {
      const payload = data;
      let response: any;

      if (profile) {
        response = await axios.put(`/auth/vendor/address/${id}`, payload);
      } else {
        response = await axios.post("/auth/vendor/address", payload);
      }
      if (response?.data) {
        response = response?.data;
      }
      if (response?.status === 201 || response?.status === 200) {
        toast.success(response?.message);
        router.push("?");
        methods?.reset();
        onClose && onClose();
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
            <Input
              name="zip_code"
              type="number"
              placeholder={translate("Postal_Code_Zip_Code")}
            />
          </div>
          <Input name="city" type="text" placeholder={translate("City")} />
          <Input name="state" type="text" placeholder={translate("State")} />
          <div className="col-span-2">
            <Input
              name="house_no"
              type="text"
              placeholder={translate("House_Flat_Office_No")}
            />
          </div>
          <div className="col-span-2">
            <Input
              name="address"
              type="text"
              placeholder={translate("Road_Name_Area_Name_Colony")}
            />
          </div>
          <div className="col-span-2">
            <Input
              label={translate("Set_as_default_address")}
              name="isDefault"
              type="checkbox"
              className=""
            />
          </div>

          <div className="mt-6 col-span-2 sticky bottom-0 bg-white">
            <Button type="submit" loading={loading}>
              {translate("Save")}
            </Button>
          </div>
        </form>
      </FormProvider>
    </>
  );
}
