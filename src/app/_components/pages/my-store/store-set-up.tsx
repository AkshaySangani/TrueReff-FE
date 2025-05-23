"use client";
import { Button } from "@/components/ui/button";
import Input, { inputStyle, labelStyle } from "@/app/_components/ui/form/Input";
import Select from "react-select";
import React, { useEffect, useState } from "react";
import { ICategory } from "@/lib/types-api/category";
import { getCategories } from "@/lib/web-api/auth";
import { FormProvider, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { createStoreSchema, ICreateStoreSchema } from "@/lib/utils/validations";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { toastMessage } from "@/lib/utils/toast-message";
import {
  createStore,
  getCreatorStore,
  updateCreatorStore,
} from "@/lib/web-api/my-store";
import { fileUploadLimitValidator } from "@/lib/utils/constants";
import StoreDetailView from "./store-detail-view";
import Loader from "../../components-common/layout/loader";
import { useRouter } from "next/navigation";
import PhotoUpload from "../../components-common/PhotoUpload";
import { cn } from "@sohanemon/utils";
import toast from "react-hot-toast";
import { useTranslations } from "next-intl";

const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#a1a1aa", // Tailwind slate-400
  }),
  control: (base: any) => ({
    ...base,
    borderRadius: "12px",
    height: "52.5px",
  }),
};
export default function StoreSetUp(props: any) {
  const translate = useTranslations();
  const router = useRouter();
  const [loading, setLoading] = useState<boolean>(false);
  const [parentCategory, setParentCategory] = useState<ICategory[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [profileFile, setProfileFile] = useState<File | null>(null);
  const [profilePreview, setProfilePreview] = useState<string>("");
  const [bannerPreview, setBannerPreview] = useState<string>("");
  const [isDetailView, setIsDetailView] = useState<boolean>(true);
  const [isEdit, setIsEdit] = useState<boolean>(true);
  const [store, setStore] = useState({
    creatorId: "",
    name: "",
    description: "",
    tags: [],
    category: [],
    link: "",
    profile_image: "",
    banner_image: "",
    categories: [],
  });
  const methods = useForm<ICreateStoreSchema>({
    defaultValues: {
      name: "",
      description: "",
      tags: [],
      category: [],
      profile_image: "",
      banner_image: "",
    },
    resolver: yupResolver(createStoreSchema),
    mode: "onSubmit",
  });

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      const data = response?.data?.data || [];
      setParentCategory(data.filter((ele) => ele?.parentId === null));
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };
  async function fetchStoreDetail() {
    setLoading(true);
    try {
      const response: any = await getCreatorStore({ storeName: "" });
      console.log("response?.data", response);
      if (response?.data) {
        const storeData = response?.data;
        const data = {
          name: storeData?.storeName,
          description: storeData?.storeDescription,
          tags: storeData?.tags,
          category: storeData?.category?.map((ele: any) => ele?.name),
          link: `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${storeData?.storeName}`,
          profile_image: storeData?.profile_image,
          banner_image: storeData?.banner_image,
          creatorId: storeData?.creatorId?._id,
          categories: storeData?.category?.map((cat: any) => ({
            value: cat?._id,
            label: cat?.name,
          })),
        };
        setStore({ ...data });
        setIsDetailView(true);
      } else {
        setIsDetailView(false);
        setIsEdit(false);
        setStore({
          creatorId: "",
          name: "",
          description: "",
          tags: [],
          category: [],
          link: "",
          profile_image: "",
          banner_image: "",
          categories: [],
        });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      // toastMessage.error(errorMessage);
      setIsDetailView(false);
      setIsEdit(false);
      setStore({
        creatorId: "",
        name: "",
        description: "",
        tags: [],
        category: [],
        link: "",
        profile_image: "",
        banner_image: "",
        categories: [],
      });
    } finally {
      setLoading(false);
    }
  }
  useEffect(() => {
    fetchCategory();
    // fetchStoreDetail();
  }, []);
  const onSubmit = async (data: ICreateStoreSchema) => {
    setLoading(true);

    try {
      // const payload: ICreateStoreRequest = {
      const formData = new FormData();
      formData.append("storeName", data.name);
      formData.append("storeDescription", data.description);

      // Append array items one by one (for `category`)
      data.category.forEach((cat: any, index: number) => {
        formData.append(`category[${index}]`, cat.value);
      });

      // Append tags if they exist
      if (data.tags && Array.isArray(data.tags)) {
        data.tags.forEach((tag: string, index: number) => {
          formData.append(`tags[${index}]`, tag);
        });
      }

      // Append files if they exist
      if (bannerFile) {
        formData.append("banner_image", bannerFile);
      }
      if (profileFile) {
        formData.append("profile_image", profileFile);
      }
      if (!isEdit) {
        const response: any = await createStore(formData);
        if (response?.status === 200) {
          toastMessage.success(response?.message);
        }
      } else {
        const response: any = await updateCreatorStore(formData);
        if (response?.status === 200) {
          toastMessage.success(response?.message);
        }
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toastMessage.error(errorMessage);
    } finally {
      setLoading(false);
      setIsEdit(false);
      setIsDetailView(true);
    }
  };
  const handleSelectCategory = (selectedOptions: any) => {
    const selectedIds = selectedOptions.map((opt: any) => opt.value);
    setSelectedCategories(selectedIds);
    if (selectedIds) {
      methods.setValue("category", selectedOptions);
      methods.setError("category", {
        type: "manual",
        message: "",
      });
    } else {
      methods.setError("category", {
        type: "manual",
        message: "Product Category is required.",
      });
    }
  };
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
  const handleOnDrop = (e: any, type: "profile" | "banner") => {
    e.preventDefault();
    if (e.dataTransfer.files?.length > 1) {
      toastMessage.info("Upload only one photo.");
    } else {
      const file = e.dataTransfer.files?.[0];
      if (file && file.type.startsWith("image/")) {
        handleImageSelect({ target: { files: [file] } }, type);
      }
    }
    setDragActive(false);
  };
  const handleOnEdit = () => {
    setIsDetailView(false);
    setIsEdit(true);
    setProfilePreview(store?.profile_image);
    setBannerPreview(store?.banner_image);
    setSelectedCategories(
      store?.category?.map((ele: any) => {
        return parentCategory?.find((cat: any) => cat?.name === ele)?._id ?? "";
      })
    );
    methods.setValue("name", store?.name);
    methods.setValue("tags", store?.tags);
    methods.setValue("description", store?.description);
    methods.setValue("banner_image", store?.banner_image);
    methods.setValue("profile_image", store?.profile_image);
    methods.setValue("category", store?.categories);
  };

  const handleStoreLinkCopy = async () => {
    const link = `${process.env.NEXT_PUBLIC_FRONTEND_URL}/store/${methods.watch(
      "name"
    )}`;

    try {
      await navigator?.clipboard.writeText(link);
      console.log("Link copied to clipboard:", link);
      toast.success("Link copied to clipboard");
    } catch (err) {
      console.error("Failed to copy link: ", err);
      toast.error("Failed to copy link");
    }
  };

  return (
    <>
      {loading && <Loader />}
      {isDetailView ? (
        <StoreDetailView handleOnEdit={handleOnEdit} store={store} />
      ) : (
        <div className="flex flex-col gap-2 lg:gap-5 h-full p-2 lg:p-4">
          <FormProvider {...methods}>
            <form
              onSubmit={methods.handleSubmit(onSubmit)}
              className="w-full h-full overflow-auto flex-1 flex flex-col gap-3 relative"
            >
              <div className="flex justify-between items-center flex-wrap gap-2">
                <div className="md:text-xl text-base text-500">
                  {translate("Add_Details_For_Store_Set_Up")}
                </div>
                <div className="flex gap-[10px]">
                  {store?.name && (
                    <Button
                      type="button"
                      variant="outline"
                      className="w-[140px] rounded-[12px]"
                      onClick={() => {
                        setIsDetailView(true);
                        setIsEdit(false);
                      }}
                    >
                      {translate("Cancel")}
                    </Button>
                  )}
                  <Button
                    type="submit"
                    variant="secondary"
                    className="text-white w-[140px] rounded-[12px]"
                  >
                    {translate("Save")}
                  </Button>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-5 w-full">
                <div className="flex bg-white rounded-xl col-span-2 flex-col gap-2 lg:w-1/2 p-4">
                  <div className="text-sm lg:text-lg">
                    {translate("Banner_Image")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {translate("Store_Banner_Image")}
                    <span className="text-[red]">*</span>
                  </div>
                  <PhotoUpload
                    name="banner"
                    previewUrl={bannerPreview}
                    handleImageSelect={handleImageSelect}
                  />
                  {methods?.formState?.errors?.banner_image?.message && (
                    <span className="text-red-600 text-sm">
                      {methods?.formState?.errors?.banner_image?.message}
                    </span>
                  )}
                </div>
                <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2 lg:w-1/2  p-4">
                  <div className="text-sm lg:text-lg">
                    {translate("Profile_Image")}
                  </div>
                  <div className="text-sm text-gray-500">
                    {translate("Store_Profile_Image")}
                    <span className="text-[red]">*</span>
                  </div>
                  <PhotoUpload
                    name="profile"
                    previewUrl={profilePreview}
                    handleImageSelect={handleImageSelect}
                    showType="circle"
                  />
                  {methods?.formState?.errors?.profile_image?.message && (
                    <span className="text-red-600 text-sm">
                      {methods?.formState?.errors?.profile_image?.message}
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col bg-white rounded-xl p-4 gap-2">
                <div className="text-sm lg:text-lg">
                  {translate("Category")}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="col-span-1 gap-1">
                    <label className="text-sm text-[#7E7E80]">
                      {translate("Product_Category")}
                      <span className="text-[red]">*</span>
                    </label>
                    <Select
                      name="category"
                      styles={customStyles}
                      value={selectedCategories.map((id) => {
                        const match = parentCategory.find(
                          (cat) => cat._id === id
                        );
                        return { value: id, label: match?.name || id };
                      })}
                      isMulti
                      onChange={handleSelectCategory}
                      options={parentCategory.map((ele) => ({
                        value: ele._id,
                        label: ele.name,
                      }))}
                      isOptionDisabled={() => selectedCategories.length >= 3}
                      className="basic-multi-select focus:outline-none focus:shadow-none"
                      placeholder="Product Categories"
                    />
                    {methods?.formState?.errors?.category?.message && (
                      <span className="text-red-600 text-sm p-2">
                        {methods?.formState?.errors?.category?.message}
                      </span>
                    )}
                  </div>
                  <div className="col-span-1">
                    <Input
                      label="Tags"
                      name="tags"
                      type="tag"
                      placeholder="Enter your tags"
                    />
                  </div>
                </div>
                <div className="text-sm lg:text-lg">
                  {translate("General_Information")}
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <Input
                      label={translate("Store_Name")}
                      name="name"
                      type="text"
                      placeholder="Men’s Style Guide & Trends"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className={cn(labelStyle)}>
                      {translate("Store_Link")}
                    </label>
                    <div
                      className={cn(
                        inputStyle,
                        "py-1.5 flex justify-between items-center"
                      )}
                    >
                      <span className="flex-1">
                        {`${
                          process.env.NEXT_PUBLIC_FRONTEND_URL
                        }/store/${methods.watch("name")}`}
                      </span>
                      <Button
                        onClick={handleStoreLinkCopy}
                        type="button"
                        className="text-white ml-auto cursor-pointer"
                      >
                        {translate("Copy")}
                      </Button>
                    </div>
                  </div>
                  <div className="col-span-1 lg:col-span-2">
                    <Input
                      label="Store Description"
                      name="description"
                      type="editor"
                      rows={4}
                      placeholder="I'm John, a fashion influencer sharing style tips, outfit inspiration, and grooming advice for men. Follow me for daily fashion insights!"
                    />
                  </div>
                </div>
              </div>
            </form>
          </FormProvider>
        </div>
      )}
    </>
  );
}
