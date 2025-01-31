"use client";
import React, { useState } from "react";
import { SlidingTabBar } from "../tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IPreFormSchema, preFormSchema } from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/lib/ui/button";
import Input from "@/lib/ui/form/Input";
import BasicInfoForm from "./components/basic-form";
import ContactDetailsForm from "./components/contact-form";
import ChannelForm from "./components/channel-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { venderRegister } from "@/lib/web-api/auth";

let allTabs: {
  id: string;
  name: string;
  Icon: any;
}[] = [
  {
    id: "1",
    name: "Business Information",
    Icon: HiOutlineSquare3Stack3D,
  },
  {
    id: "2",
    name: "Contact Details",
    Icon: GrDocumentText,
  },
  {
    id: "3",
    name: "Omni-channel",
    Icon: FaRegUserCircle,
  },
];

const TABS_STATUS = {
  BASIC_INFO: 0,
  CONTACT_INFO: 1,
  OMNI_CHANNEL: 2,
};

export default function PreFormPage() {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<number>(TABS_STATUS.BASIC_INFO);
  const methods = useForm<IPreFormSchema>({
    defaultValues: {
      business_name: "YASH",
      company_email: "yash@gmail.com",
      company_phone: "9558411111",
      contacts: [
        {
          name: "contact1",
          phone: "9558996325",
          email: "contact1@yopmail.com",
        },
        {
          name: "contact2",
          phone: "7418529630",
          email: "contact2@yopmail.com",
        },
      ],
      gst_number: "HYSGBIUYKBH827JHVH",
      type_of_business: "business type 1",
      website: "https://www.youtube.com/watch?v=uE2dQHjHpvY",
    },
    resolver: yupResolver(preFormSchema),
    mode: "onChange",
  });

  const onSubmit = async (data: IPreFormSchema) => {
    setLoading(true);
    try {
      const payload = {
        ...data,
        omni_channels: data.omni_channels?.map((item: any) => item),
      };
      const response: any = await venderRegister(payload);

      if (response?.status === 200) {
        toast.success("Vendor successfully registerd.");
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerStepper = async () => {
    setLoading(true);
    if (TABS_STATUS.BASIC_INFO === activeTab) {
      const basicInfoField: any = [
        "business_name",
        "company_email",
        "company_phone",
        "gst_number",
        "website",
        "type_of_business",
      ];
      const isValid = await methods.trigger(basicInfoField);

      if (isValid) {
        setActiveTab(TABS_STATUS.CONTACT_INFO); // Move to next tab
      }
    } else if (TABS_STATUS.CONTACT_INFO === activeTab) {
      const contactInfoField: any = ["contacts"];
      const isValid = await methods.trigger(contactInfoField);

      if (isValid) {
        setActiveTab(TABS_STATUS.OMNI_CHANNEL); // Move to next tab
      }
    }
    setLoading(false);
  };
  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 md:pt-10 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />

      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <SlidingTabBar
          tabs={allTabs}
          setActiveTabIndex={setActiveTab}
          activeTabIndex={activeTab}
        />
        <FormProvider {...methods}>
          <form
            onSubmit={methods.handleSubmit(onSubmit)}
            className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col gap-3 relative"
          >
            {TABS_STATUS.OMNI_CHANNEL === activeTab ? <ChannelForm /> : null}
            {TABS_STATUS.CONTACT_INFO === activeTab ? (
              <ContactDetailsForm />
            ) : null}
            {TABS_STATUS.BASIC_INFO === activeTab ? <BasicInfoForm /> : null}
            <div className="bg-white">
              {TABS_STATUS.OMNI_CHANNEL === activeTab ? (
                <Button
                  type="submit"
                  loading={loading}
                  className="w-fit font-medium px-8"
                  size="small"
                >
                  Submit
                </Button>
              ) : (
                <Button
                  type="button"
                  size="small"
                  loading={loading}
                  className="w-fit font-medium px-8 md:text-base text-sm"
                  onClick={handleTriggerStepper}
                >
                  Save and Continue
                </Button>
              )}
            </div>
          </form>
        </FormProvider>
      </div>
    </div>
  );
}
