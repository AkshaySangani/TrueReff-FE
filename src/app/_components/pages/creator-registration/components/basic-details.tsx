"use client";
import Input from "@/app/_components/ui/form/Input";
import {
  cities,
  gender,
  indianStates,
} from "@/lib/utils/constants";
import { debounce, get } from "lodash";
import React, { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import Select from "react-select";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { fetchUserNameExists } from "@/lib/web-api/auth";
const customStyles = {
  placeholder: (base: any) => ({
    ...base,
    fontSize: "0.875rem ", // Tailwind text-sm
    color: "#9CA3AF", // Tailwind slate-400
    fontWeight: "normal",
  }),
  control: (base: any, state: any) => {
    return ({
      ...base,
      height: "54px",
      borderRadius: "8px",
      color: state.getValue()[0]?.value === "" ? "#9CA3AF" : "#000000",
    })
  },
  singleValue: (provided: any,state:any) => ({
    ...provided,
    color: state.getValue()[0]?.value === "" ? "gray" : "#000000",
    fontSize: '14px',
  }),
  menu: (base: any) => ({
    ...base,
    zIndex: 9999,
  }),
};
interface IBasicInfoFormProps {
  handleOnSelect: (value: any, name: any) => void;
  methods: any;
  formState: { state: string; city: string; gender: string; dob: string,userName: string; };
}

export default function BasicInfoForm({
  handleOnSelect,
  methods,
  formState
}: IBasicInfoFormProps) {
  const translate = useTranslations();
  const getUserNameExists = async (value:string) => {
    try {
      const response = await fetchUserNameExists({user_name: value});
      if(!response?.exists){
        methods.setError("user_name", {
          type: "manual",
          message: "",
        });
      }
    } catch(error) {
      let errMessage = await getErrorMessage(error);
      methods.setError("user_name", {
        type: "manual",
        message: errMessage,
      });
    }
  }
  const debouncedSearch = useCallback(
      debounce((value: string) => {
        getUserNameExists(value)
      }, 500),
      []
    );
    const handleUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      debouncedSearch(value);
      handleOnSelect(value,'userName');
      methods.setValue("user_name",value)
    };
  return (
    <div className="grid md:grid-cols-2 grid-cols-1 gap-4">
      <div className="col-span-1">
        <Input
          label={translate("Full_Name")}
          name="full_name"
          type="text"
          placeholder={translate("Enter_your_full_name")}
          autoFocus
        />
      </div>
      <div className="col-span-1">
        <Input
          value={formState?.userName}
          onChange={handleUserName}
          label={translate("Username")}
          name="user_name"
          type="text"
          placeholder={translate("Enter_your_unique_username")}
        />
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Email")}
          name="email"
          type="email"
          placeholder={translate("Enter_your_email")}
          disabled
        />
      </div>
      <div className="col-span-1">
        <Input
          label={translate("Phone_Number")}
          name="phone_number"
          type="phone"
          placeholder="xxxxx xxxxx"
        />
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("State")}
            <span className="text-red-500">*</span>
          </span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.state,
                label: formState.state ? formState.state : translate("Select_State"),
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "state")}
            options={indianStates?.map(ele => ({ value: ele, label: ele }))}
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_State")}
          />
          {Boolean(get(methods.formState.errors, "state")) && methods.formState.errors["state"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["state"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("City")}
            <span className="text-red-500">*</span>
          </span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.city,
                label: formState.city ? formState.city : translate("Select_City"),
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "city")}
            options={formState.state ? cities[formState?.state]?.map((ele: string) => ({ value: ele, label: ele })) : []}
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_City")}
          />
          {Boolean(get(methods.formState.errors, "city")) && methods.formState.errors["city"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["city"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <span className="mb-1 text-sm text-gray-500 font-semibold">
            {translate("Gender")}
            <span className="text-red-500">*</span>
          </span>
          <Select
            styles={customStyles}
            value={[
              {
                value: formState.gender,
                label: formState.gender ? formState.gender : translate("Select_Gender"),
              },
            ]}
            onChange={(value) => handleOnSelect(value?.value, "gender")}
            options={gender?.map(ele => ({ value: ele, label: ele }))}
            menuPortalTarget={typeof document !== "undefined" ? document.body:null} // Renders the dropdown outside of the current scrollable container
            menuPosition="fixed"
            className="basic-multi-select focus:outline-none focus:shadow-none"
            placeholder={translate("Select_Gender")}
          />
          {Boolean(get(methods.formState.errors, "gender")) && methods.formState.errors["gender"]?.message && (
            <span className="text-red-600 text-sm p-2 block">
              {methods.formState.errors["gender"]?.message}
            </span>
          )}
        </div>
      </div>
      <div className="col-span-1">
        <div className="flex flex-col">
          <Input
            name="dob"
            type="date"
            placeholder={translate("Select_date_of_birth")}
            label={translate("Date_of_Birth")}
            maxDate={new Date(new Date().setDate(new Date().getDate()))}
          />
        </div>
      </div>
    </div>
  );
}
