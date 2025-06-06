"use client";
import React, { useEffect, useState } from "react";
import { SlidingTabBar } from "../../components-common/tabs/sllidingTabs";
import HeaderAuth from "../auth/components/header-auth";
import { HiOutlineSquare3Stack3D } from "react-icons/hi2";
import { GrDocumentText } from "react-icons/gr";
import { FaRegUserCircle } from "react-icons/fa";
import { IVendorRegisterFirstStepSchema, IVendorRegisterSecondStepSchema,  IVendorRegisterThirdStepSchema,  vendorRegisterFirstStepSchema, vendorRegisterSecondStepSchema, vendorRegisterThirdStepSchema } from "@/lib/utils/validations";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Button from "@/app/_components/ui/button";
import BasicInfoForm from "./components/basic-form";
import ChannelForm from "./components/channel-form";
import toast from "react-hot-toast";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { getVendor, venderRegister } from "@/lib/web-api/auth";
import { useRouter } from "next/navigation";
import { useVendorStore } from "@/lib/store/vendor";
import { fileUploadLimitValidator } from "@/lib/utils/constants";
import { useTranslations } from "next-intl";
import { toastMessage } from "@/lib/utils/toast-message";
import DocumentDetailsForm from "./components/document-form";
import { getConnectedChannelsList } from "@/lib/web-api/channel";
import axios from "@/lib/web-api/axios";
import { useSession } from "next-auth/react";
import { useAuthStore } from "@/lib/store/auth-user";

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
      name: "Document Details",
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
  DOCUMENT_INFO: 1,
  OMNI_CHANNEL: 2,
};

export default function PreFormPage() {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [terms, setTerms] = useState(false);
  const { update } = useSession();
  const { vendor,setVendorData } = useVendorStore();
  const { account } = useAuthStore();
  const [isVendorLoading, setIsVendorLoading] = useState<boolean>(false);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [gstCertificateFile, setGstCertificateFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [activeTab, setActiveTab] = useState<number>(TABS_STATUS.BASIC_INFO);
  const [channels, setChannels] = useState<any[]>([]);
  const initialState = {
    state: "",
    city: "",
    channels: [],
    type_of_business: ""
  };
  const [formState, setFormState] = useState(initialState);
  const methods = useForm<IVendorRegisterFirstStepSchema>({
    defaultValues: {
      business_name: "",
      company_email: "",
      pin: "",
      address: "",
      type_of_business: "",
      website: "",
      state: "",
      city: "",
      profile_image: "",
      banner_image: "",
      category: [],
      sub_category: [],
      contacts: [
        {
          email: "",
          phone: "",
          name: ""
        }
      ]
    },
    resolver: yupResolver(vendorRegisterFirstStepSchema),
    mode: "onSubmit",
  });
  const channelMethods = useForm<IVendorRegisterThirdStepSchema>({
    defaultValues: {
      shopify_store_id:""
    },
    resolver: yupResolver(vendorRegisterThirdStepSchema),
    mode: "onSubmit",
  });
  const documentMethods = useForm<IVendorRegisterSecondStepSchema>({
    defaultValues: {
      gst_number: "",
      pan_number: "",
      gst_certificate: ""
    },
    resolver: yupResolver(vendorRegisterSecondStepSchema),
    mode: "onSubmit",
  });
  useEffect(()=> {
    if(account?.email){
      methods.setValue("company_email",account?.email)
    }
  },[account])
  const getVendorData = async () => {
    setIsVendorLoading(true);
    try {
      const vendorData: any = await getVendor();
            if (vendorData) {
        if (vendorData?.completed_step === 1) {
          setActiveTab(TABS_STATUS.DOCUMENT_INFO)
          setIsVendorLoading(false);
        } else if (vendorData?.completed_step === 2) {
          setActiveTab(TABS_STATUS.OMNI_CHANNEL)
          setIsVendorLoading(false);
        } else if (vendorData?.completed_step === 3) {
          router.push(`/vendor/dashboard`);
        }
        methods.setValue("business_name",vendorData?.business_name);
        methods.setValue("company_email",vendorData?.company_email);
        methods.setValue("contacts",vendorData?.contacts);
        methods.setValue("category",vendorData?.category);
        methods.setValue("sub_category",vendorData?.sub_category);
        methods.setValue("address",vendorData?.address);
        methods.setValue("pin",vendorData?.pin_code);
        methods.setValue("type_of_business",vendorData?.type_of_business);
        methods.setValue("state",vendorData?.state);
        methods.setValue("city",vendorData?.city);
        methods.setValue("website",vendorData?.website);
        methods.setValue("profile_image",vendorData?.profile_image);
        methods.setValue("banner_image",vendorData?.banner_image);
        setVendorData("vendor", {
          vendorId: vendorData?._id,
          accountId: vendorData?.accountId,
          category: vendorData?.category,
          sub_category: vendorData?.sub_category,
          completed_step: vendorData?.completed_step,
          contacts: vendorData?.contacts,
          business_name: vendorData?.business_name,
          company_email: vendorData?.company_email,
          pin_code: vendorData?.pin_code,
          type_of_business: vendorData?.type_of_business,
          website: vendorData?.website,
          state: vendorData?.state,
          city: vendorData?.city,
          address: vendorData?.address,
          profile_image: vendorData?.profile_image,
          banner_image: vendorData?.banner_image,
          createdAt: vendorData?.createdAt,
          updatedAt: vendorData?.updatedAt,
          gst_certificate: vendorData?.gst_certificate,
          gst_number: vendorData?.gst_number,
          pan_number: vendorData?.pan_number,
          channelConfig: vendorData?.channelConfig,
          channelId: vendorData?.channelId,
          channelStatus: vendorData?.channelStatus,
          channelType: vendorData?.channelType,
        })        
      }

    } catch (e) {
    } finally {
      setIsVendorLoading(false);
    }
  };

  const getConnectedChannel = async () => {
    setLoading(true);
    try {
        const res: any[] = await getConnectedChannelsList();
      if (Array.isArray(res)) {
        setChannels(res);
        setLoading(false)
      } else {
        setChannels([]);
        setLoading(false)
      }
    }catch (error){
        // const errorMessage = getErrorMessage(error);
        // toast.error(errorMessage);
        setLoading(false);
    }
  }

  useEffect(() => {
    (async () => {
      await getVendorData();
    })();
  }, []);
  useEffect(() => {
    (async () => {
      if(vendor?.vendorId){
        await getConnectedChannel();
      }
    })();
  }, [vendor?.vendorId]);
  const onSubmit = async (data: IVendorRegisterFirstStepSchema) => {
    setLoading(true);
    try {
      const payload: any = {
        business_name: data.business_name,
        company_email: data.company_email,
        pin_code: data.pin,
        contacts: Array.isArray(data.contacts)
          ? data.contacts
            .map((contact) => ({
              name: contact.name || "", // Ensure name is a string
              phone: contact.phone || "", // Ensure phone is a string
              email: contact.email || "", // Ensure email is a string
            }))
            .filter((v) => v.name && v.email && v.phone)
          : [],
        type_of_business: data.type_of_business,
        website: data.website,
        state: data.state,
        city: data.city,
        category: data.category?.map(ele => ele.value),
        sub_category: data.sub_category?.map(ele => ele.value),
        address: data.address
      };
      if (profileFile) {
        payload.profile_image = profileFile;
      }
      if (bannerFile) {
        payload.banner_image = bannerFile;
      }
      const response: any = await venderRegister(
        payload, 1
      );

      if (response?.status === 200) {
        // toastMessage.success("Vendor successfully registered.");
        await update({
          user: {
            vendor: response?.data,
          },
        });
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
        })
        setActiveTab(TABS_STATUS.DOCUMENT_INFO)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleOnDocumentSubmit = async (data: IVendorRegisterSecondStepSchema) => {
    setLoading(true);
    try {
      const payload: any = {
        gst_number: data.gst_number,
        pan_number: data.pan_number,
      };
      if (gstCertificateFile) {
        payload.gst_certificate = gstCertificateFile;
      }
      const response: any = await venderRegister(
        payload, 2
      );

      if (response?.status === 200) {
        // toastMessage.success("Vendor successfully registered.");
        await update({
          user: {
            vendor: response?.data,
          },
        });
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
        })
        setActiveTab(TABS_STATUS.OMNI_CHANNEL)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }
  const handleOnChannelConnect = async (data: IVendorRegisterThirdStepSchema) => {
    setLoading(true);
    try {
      const payload: any = {
        id_string: data.shopify_store_id,
      };
      let { data: response }: any = await axios.post(
        "/channel/shopify/connect",
        payload
      );

      if (response?.status === 200) {
        await update({
          user: {
            vendor: response?.data,
          },
        });
        toastMessage.success(response?.message);
        await getConnectedChannel();
        setVendorData("vendor", {
          vendorId: response?.data?._id,
          accountId: response?.data?.accountId,
          category: response?.data?.category,
          sub_category: response?.data?.sub_category,
          completed_step: response?.data?.completed_step,
          contacts: response?.data?.contacts,
          business_name: response?.data?.business_name,
          company_email: response?.data?.company_email,
          pin_code: response?.data?.pin_code,
          type_of_business: response?.data?.type_of_business,
          website: response?.data?.website,
          state: response?.data?.state,
          city: response?.data?.city,
          address: response?.data?.address,
          profile_image: response?.data?.profile_image,
          banner_image: response?.data?.banner_image,
          createdAt: response?.data?.createdAt,
          updatedAt: response?.data?.updatedAt,
          gst_certificate: response?.data?.gst_certificate,
          gst_number: response?.data?.gst_number,
          pan_number: response?.data?.pan_number,
          channelConfig: response?.data?.channelConfig,
          channelId: response?.data?.channelId,
          channelStatus: response?.data?.channelStatus,
          channelType: response?.data?.channelType,
        })
        setActiveTab(TABS_STATUS.OMNI_CHANNEL)
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  }

  const handleImageSelect = async (
    e: React.ChangeEvent<HTMLInputElement> | any,
    type: "profile" | "banner"
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isValid = await fileUploadLimitValidator(file.size);
    if (!isValid) return;

    const previewURL = URL.createObjectURL(file);

    if (type === "profile") {
      setProfileFile(file);
      setProfilePreview(previewURL);
      methods.setValue("profile_image", previewURL);
      methods.setError("profile_image", {
        type: "manual",
        message: "",
      });
    } else {
      setBannerFile(file);
      setBannerPreview(previewURL);
      methods.setValue("banner_image", previewURL);
      methods.setError("banner_image", {
        type: "manual",
        message: "",
      });
    }
  };

  const handleOnSelect = (value: any, name: any) => {
    setFormState({ ...formState, [name]: value });
    if (name === "state") {
      setFormState({ ...formState, [name]: value, city: "" });
      methods.setValue("city", "");
    }
    methods.setValue(name, value);
    if (value) {
      methods.setError(name, {
        type: "manual",
        message: "",
      });
    }
  };

  const handleDocumentUpload = (file: any) => {
    setGstCertificateFile(file);
    documentMethods.setValue("gst_certificate", file?.name ?? "");
    if (file) {
      documentMethods.setError("gst_certificate", {
        type: "manual",
        message: "",
      })
    } else {
      documentMethods.setError("gst_certificate", {
        type: "manual",
        message: "GST Certificate is required.",
      })
    }
  }

  const handleCheckTerms = (e: any) => {
    setTerms(e.target.checked);
  }

  const handleOnClick = async () => {
    router.push("/vendor/dashboard")
  }

  return (
    <div className="max-w-[960px] w-full mx-auto lg:px-0 md:px-4 px-2 pb-2 md:pt-5 pt-5 h-screen overflow-hidden flex flex-col">
      <HeaderAuth />

      <div className="w-full md:py-6 md:px-6 drop-shadow-sm bg-white rounded-lg h-full overflow-hidden flex-1 flex flex-col">
        <SlidingTabBar
          tabs={allTabs}
          setActiveTabIndex={() => { }}
          activeTabIndex={activeTab}
          grid={3}
        />
        {
          {
            [TABS_STATUS.BASIC_INFO]: <FormProvider {...methods}>
              <form
                onSubmit={methods.handleSubmit(onSubmit)}
                className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
              >
                <BasicInfoForm
                  handleImageSelect={handleImageSelect}
                  profilePreview={profilePreview}
                  handleOnSelect={handleOnSelect}
                  formState={formState}
                  bannerPreview={bannerPreview}
                  methods={methods}
                />
                <div className="bg-white">
                  <Button
                    type="submit"
                    size="small"
                    loading={loading}
                    disabled={loading}
                    className="w-fit font-medium px-8 md:text-base text-sm"
                  >
                    {translate("Save_and_Continue")}
                  </Button>
                </div>
              </form>
            </FormProvider>,
            [TABS_STATUS.OMNI_CHANNEL]: <FormProvider {...channelMethods}>
              <form
                onSubmit={channelMethods.handleSubmit(handleOnChannelConnect)}
                className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
              >
                <ChannelForm loading={loading} channels={channels}/>
                <div className="bg-white">
                  <Button
                    type="button"
                    // loading={loading}
                    disabled={channels?.length === 0}
                    className="w-fit font-medium px-8"
                    size="small"
                    onClick={handleOnClick}
                  >
                    {translate("Back_to_dashboard")}
                  </Button>
                </div>
              </form>
            </FormProvider>,
            [TABS_STATUS.DOCUMENT_INFO]: <FormProvider {...documentMethods}>
              <form
                onSubmit={documentMethods.handleSubmit(handleOnDocumentSubmit)}
                className="md:pt-6 mt-3 pb-3 w-full h-full overflow-auto md:px-5 px-3 flex-1 flex flex-col justify-between gap-3 relative"
              >
                <DocumentDetailsForm terms={terms} handleCheckTerms={handleCheckTerms} methods={documentMethods} handleDocumentUpload={handleDocumentUpload} />
                <div className="bg-white">
                  <Button
                    type="submit"
                    size="small"
                    loading={loading}
                    disabled={!terms || loading}
                    className="w-fit font-medium px-8 md:text-base text-sm"
                  >
                    {translate("Save_and_Continue")}
                  </Button>
                </div>
              </form>
            </FormProvider>,
          }[activeTab]
        }
      </div>
    </div>
  );
}
