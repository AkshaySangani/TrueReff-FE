"use client";
import { IUTMSchema, utmSchema } from "@/lib/utils/validations";
import React, { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import toast from "react-hot-toast";
import Input from "@/app/_components/ui/form/Input";
import Button from "@/app/_components/ui/button";
import { generateUTMLink } from "@/lib/web-api/collobration";
import { IPostGenerateUTMLinkResponse } from "@/lib/types-api/collobration";
import { useParams } from "next/navigation";
import { useTranslations } from "next-intl";
interface IUTMFromProps {
  onClose: () => void;
}
export default function UTMForm({ onClose }: IUTMFromProps) {
  const translate = useTranslations();
  const [loading, setLoading] = useState(false);
  const params = useParams();
  const collaborationId: any = params?.collaborationId;
  const schema = utmSchema;
  const methods = useForm<IUTMSchema>({
    defaultValues: {
      discountType: "PERCENTAGE", // or "FIXED_AMOUNT"
      couponCode: "",
    },
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const onSubmit = async (data: IUTMSchema) => {
    setLoading(true);
    try {
      const res: IPostGenerateUTMLinkResponse = await generateUTMLink({
        collaborationId: collaborationId,
        discountType: data.discountType,
        discountValue: data.discountValue,
        couponCode: data.couponCode,
        commissionPercentage: data.commissionPercentage,
        expiresAt: data.expiresAt,
      });
      if (res?.status === 200 || res?.status === 201) {
        toast.success(res.message);
        onClose();
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
          name="discountValue"
          type="number"
          placeholder={translate("10")}
          label={translate("Discount")}
        />
        <Input
          name="discountType"
          type="select"
          placeholder={translate("Percentage")}
          label={translate("Discount_Type")}
          options={[
            {
              label: "Amount",
              value: "FIXED_AMOUNT",
            },
            {
              label: "Percentage",
              value: "PERCENTAGE",
            },
          ]}
        />
        <Input
          name="couponCode"
          type="string"
          placeholder={`YSNHGLI`}
          label={translate("Coupon_Code")}
        />
        <Input
          name="commissionPercentage"
          type="number"
          placeholder={translate("80")}
          label={translate("Commission_Percentage")}
        />
        <Input
          name="expiresAt"
          type="date"
          placeholder={"05/06/2025"}
          label={translate("expiresAt")}
        />
        <Button
          type="submit"
          className="mt-3"
          loading={loading}
          disabled={!methods.formState.isValid || loading}
        >
          {translate("Generate_UTM")}
        </Button>
      </form>
    </FormProvider>
  );
}
