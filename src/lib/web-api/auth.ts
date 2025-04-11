//write all the api functions here
//always add suffix at the end of the function
import { useAuthStore } from "../store/auth-user";
import { useCreatorStore } from "../store/creator";
import { useVendorStore } from "../store/vendor";
import {
  IGetCategoryParams,
  IGetCategoryResponse,
  IGetCreatorProgressResponse,
  IGetUserResponse,
  IPostContactUsRequest,
  IPostContactUsResponse,
  IPostCreatorCheckExistRequest,
  IPostCreatorCheckExistResponse,
  IPostCreatorRegisterRequest,
  IPostCreatorRegisterResponse,
  IPostForgotPasswordRequest,
  IPostForgotPasswordResponse,
  IPostLoginRequest,
  IPostLoginResponse,
  IPostResendOtpRequest,
  IPostResendOtpResponse,
  IPostResetPasswordRequest,
  IPostResetPasswordResponse,
  IPostSignupRequest,
  IPostSignupResponse,
  IPostVendorRegisterRequest,
  IPostVendorRegisterResponse,
  IPostVerifyEmailRequest,
  IPostVerifyEmailResponse,
  IPostVerifyOTPRequest,
  IPostVerifyOTPResponse,
} from "../types-api/auth";
import { getErrorMessage } from "../utils/commonUtils";
import { USER_TYPE } from "../utils/constants";
import { IContactSchema } from "../utils/validations";
import axiosInstance from "./http-common";

export const signUpAPI = async (
  params: IPostSignupRequest
): Promise<IPostSignupResponse> => {
  try {
    const response = await axiosInstance.post("/auth/register", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};

export const loginAPI = async (
  params: IPostLoginRequest
): Promise<IPostLoginResponse> => {
  try {
    const response = await axiosInstance.post("/auth/login", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const getUserApi = async (): Promise<IGetUserResponse> => {
  useAuthStore.getState().setIsAuthStatus("loading");
  try {
    const response = await axiosInstance.get("/auth/user");
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
      });
    }
    // creator
    if (response.data?.data?.type === USER_TYPE.Creator) {
      const creator = response.data?.data?.creator;
      useCreatorStore.getState().setCreatorData("creator", {
        creatorId: creator?._id,
        accountId: response.data?.data?._id,
        full_name: creator?.full_name,
        user_name: creator?.user_name,
        title: creator?.title,
        phone: creator?.phone,
        banner_image: creator?.banner_image,
        profile_image: creator?.profile_image,
        category: creator?.category,
        sub_category: creator?.sub_category,
        tags: creator?.tags,
        channels: creator?.channels,
        completed: creator?.completed,
        short_description: creator?.short_description,
        long_description: creator?.long_description,
      });
    }
    // vendor
    if (response.data?.data?.type === USER_TYPE.Vendor) {
      const vendor = response.data?.data?.vendor;
      useVendorStore.getState().setVendorData("vendor", {
        vendorId: vendor?._id,
        accountId: response.data?.data?._id,
        business_name: vendor?.business_name,
        company_email: vendor?.company_email,
        company_phone: vendor?.company_phone,
        gst_number: vendor?.gst_number,
        website: vendor?.website,
        type_of_business: vendor?.type_of_business,
        contacts: vendor?.contacts,
        omni_channels: vendor?.omni_channels,
        brand_documents: vendor?.brand_documents,
        addresses: vendor?.addresses,
      });
    }
    useAuthStore.getState().setIsAuthStatus("authanticated");
    return response?.data;
  } catch (error) {
    useAuthStore.getState().setIsAuthStatus("unauthanticated");
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While getting user");
  }
};

export const resendOtp = async (
  params: IPostResendOtpRequest
): Promise<IPostResendOtpResponse> => {
  try {
    const response = await axiosInstance.post("/user/auth/resend-otp", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("resend not sent OTP");
  }
};

export const verifyOtp = async (
  params: IPostVerifyOTPRequest
): Promise<IPostVerifyOTPResponse> => {
  try {
    const response = await axiosInstance.post("/auth/reset-password", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid OTP");
  }
};

export const verifyEmail = async (
  params: IPostVerifyEmailRequest
): Promise<IPostVerifyEmailResponse> => {
  try {
    const response = await axiosInstance.post("/auth/email-verify", params);
    // user
    if (response.data?.data) {
      const user = response.data?.data;
      useAuthStore.getState().setAccountData({
        email: user?.email,
        id: user?._id,
        name: user?.name,
        role: user?.type,
      });
    }
    // creator
    if (response.data?.data?.type === USER_TYPE.Creator) {
      const creator = response.data?.data?.creator;
      useCreatorStore.getState().setCreatorData("creator", {
        creatorId: creator?._id,
        accountId: response.data?.data?._id,
        full_name: creator?.full_name,
        user_name: creator?.user_name,
        title: creator?.title,
        phone: creator?.phone,
        banner_image: creator?.banner_image,
        profile_image: creator?.profile_image,
        category: creator?.category,
        sub_category: creator?.sub_category,
        tags: creator?.tags,
        channels: creator?.channels,
        completed: creator?.completed,
        short_description: creator?.short_description,
        long_description: creator?.long_description,
      });
    }
    // vendor
    if (response.data?.data?.type === USER_TYPE.Vendor) {
      const vendor = response.data?.data?.vendor;
      useVendorStore.getState().setVendorData("vendor", {
        vendorId: vendor?._id,
        accountId: response.data?.data?._id,
        business_name: vendor?.business_name,
        company_email: vendor?.company_email,
        company_phone: vendor?.company_phone,
        gst_number: vendor?.gst_number,
        website: vendor?.website,
        type_of_business: vendor?.type_of_business,
        contacts: vendor?.contacts,
        omni_channels: vendor?.omni_channels,
        brand_documents: vendor?.brand_documents,
        addresses: vendor?.addresses,
      });
    }
    if (response.data?.data?.token) {
      useAuthStore.getState().setToken(response.data?.data?.token);
    }
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid OTP");
  }
};

export const forgotPassword = async (
  params: IPostForgotPasswordRequest
): Promise<IPostForgotPasswordResponse> => {
  try {
    const response = await axiosInstance.post("/auth/forgot-password", params);
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Email");
  }
};

export const resetPasswordAPI = async (
  params: IPostResetPasswordRequest
): Promise<IPostResetPasswordResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/reset-password/confirm",
      params
    );
    return response;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Invalid Otp");
  }
};

export const contactUsAPI = async (
  params: IPostContactUsRequest
): Promise<IPostContactUsResponse> => {
  try {
    const response = await axiosInstance.post("/user/contact", params);
    return response?.data;
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Login");
  }
};

export const venderRegister = async (
  params: IPostVendorRegisterRequest
): Promise<IPostVendorRegisterResponse> => {
  try {
    const response = await axiosInstance.post(
      "/auth/vendor/add-vendor-details",
      params
    );
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Signup");
  }
};

export const creatorRegister = async (
  params: IPostCreatorRegisterRequest
): Promise<IPostCreatorRegisterResponse> => {
  try {
    const response = await axiosInstance.post("/auth/creator/add", params);
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Creator Registered.");
  }
};

export const socialMediaAdded = async (
  params: any
): Promise<IPostCreatorRegisterResponse> => {
  try {
    const response = await axiosInstance.put(
      "/auth/creator/channel-add",
      params
    );
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While Creator Registered.");
  }
};

export const getCategories = async (
  params: IGetCategoryParams
): Promise<IGetCategoryResponse> => {
  try {
    const response = await axiosInstance.get("/product/category/list?all=true");
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching categories.");
  }
};
export const getCreatorProgress =
  async (): Promise<IGetCreatorProgressResponse> => {
    try {
      const response = await axiosInstance.get(`/auth/creator`);
      return response?.data?.data?.creator;
    } catch (error: unknown) {
      const errorMessage = getErrorMessage(error);
      // throw errorMessage || new Error("Error While fetching creator progress.");
      return {
        completed: 0,
      };
    }
  };
export const checkCreatorUserNameExist = async (
  params: IPostCreatorCheckExistRequest
): Promise<IPostCreatorCheckExistResponse | null> => {
  try {
    const response = await axiosInstance.post(
      `/auth/creator/check-exists`,
      params
    );
    return response?.data?.error;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    // throw errorMessage || new Error("Error While fetching creator progress.");
    return null;
  }
};
