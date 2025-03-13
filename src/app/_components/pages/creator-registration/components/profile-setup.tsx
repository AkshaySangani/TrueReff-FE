"use client";
import Input from "@/app/_components/ui/form/Input";
import React, { useEffect, useState } from "react";
import { translate } from "@/lib/utils/translate";
import { Button } from "@/components/ui/button";
import { getCategories } from "@/lib/web-api/auth";
export interface ICategoryData {
  _id: string;
  name: string;
  parentId: string;
  createdAt: string;
  updatedAt: string;
}
export default function ProfileSetup() {
  const [categories, setCategories] = useState<ICategoryData[]>([]);
  const [parentCategory, setParentCategory] = useState<ICategoryData[]>([]);
  const [subCategory, setSubCategory] = useState<ICategoryData[]>([]);

  const fetchCategory = async () => {
    try {
      const response = await getCategories({ page: 0, limit: 0 });
      let data = response?.data?.data;
      setCategories(data);
      setParentCategory(data?.filter((ele) => ele?.parentId === null));
      setSubCategory(data?.filter((ele) => ele?.parentId !== null));
    } catch (error) {}
  };

  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4">
      <div className="col-span-2">
        <Input
          label="Profile Title"
          name="profile_title"
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Long Description"
          name="long_description"
          type="textarea"
          rows={2}
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input
          label="Short Description"
          name="short_description"
          type="text"
          placeholder="ABC"
        />
      </div>
      <div className="col-span-2">
        <Input label="Tags" name="tags" type="tag" placeholder="#ABC" />
        {/* <Input label="Tags" name="tags" type="text" placeholder="#ABC" /> */}
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Category")}
          placeholder={translate("Select_category")}
          name="category"
          type="select"
          options={parentCategory?.map((ele) => ({
            value: ele?.name,
            label: ele?.name,
          }))}
        />
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Sub_category")}
          placeholder={translate("Select_sub_category")}
          name="sub_category"
          type="select"
          options={subCategory?.map((ele) => ({
            value: ele?.name,
            label: ele?.name,
          }))}
        />
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Profile_Image")}</div>
        <div className="flex justify-center items-center border rounded-lg p-5">
          <div className="flex flex-col w-full gap-4">
            <div className="flex justify-center">
              <img
                src="/assets/product/image-square.svg"
                className="w-[50px] h-[50px]"
              />
            </div>
            <input type="file" id="profile-image" className="hidden" />
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                document.getElementById("profile-image")?.click();
              }}
            >
              {translate("Upload_your_photo")}
            </Button>
          </div>
        </div>
      </div>
      <div className="bg-white rounded-xl col-span-2 flex flex-col gap-2">
        <div className="text-sm">{translate("Banner_Image")}</div>
        <div className="flex flex-col gap-1">
          <div
            className="flex justify-center items-center border border-dashed rounded-lg p-5"
            onClick={() => {
              document.getElementById("banner_image")?.click();
            }}
          >
            <div className="flex flex-col items-center gap-4">
              <img
                src="/assets/product/image-square.svg"
                className="w-[50px] h-[50px]"
              />
              <input type="file" id="banner_image" className="hidden" />
              <div className="text-[#656466]">
                {translate("Upload_Documents")}
              </div>
              <div className="text-[12px] text-[#89858C]">
                {translate("Upload_Documents_INFO")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
