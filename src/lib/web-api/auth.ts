//write all the api functions here
//always add suffix at the end of the function
import {
  IGetCategoryParams,
  IGetCategoryResponse,
  IPostContactUsRequest,
  IPostContactUsResponse,
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
      "/vendor/add-vendor-details",
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

export const getCategories = async (
  params: IGetCategoryParams
): Promise<IGetCategoryResponse> => {
  try {
    const response = await axiosInstance.get("/product/category/list");
    return response?.data;
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    throw errorMessage || new Error("Error While fetching categories.");
  }
};
