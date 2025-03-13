import * as Yup from "yup";

export const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one special character"
    ),
});

export interface ILoginSchema extends Yup.Asserts<typeof loginSchema> {}

export const loginWithOtpSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: Yup.string().optional(),
});

export interface ILoginWithOtpSchema
  extends Yup.Asserts<typeof loginWithOtpSchema> {}

export const forgotSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
});

export interface IForgotSchema extends Yup.Asserts<typeof forgotSchema> {}

export const otpSchema = Yup.object().shape({
  otpCode: Yup.string()
    .matches(/^\d+$/, "OTP must be a number")
    .length(6, "OTP must be exactly 6 digits")
    .required("OTP is required"),
});

export interface IOtpSchema extends Yup.Asserts<typeof otpSchema> {}

export const resetPasswordSchema = Yup.object().shape({
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export interface IResetSchema extends Yup.Asserts<typeof resetPasswordSchema> {}

export const registerSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one special character"
    ),
  terms: Yup.boolean().oneOf([true]),
  // type: Yup.string().required("Type is required")
});

export interface IRegisterSchema extends Yup.Asserts<typeof registerSchema> {}

export const _validatePhone = (number: string, format: string) => {
  if (
    !(format !== String(number).replace(/[0-9]/g, ".")) ||
    format?.split(" ")[0]?.length === number?.length
  ) {
    return true;
  } else {
    return false;
  }
};

export const changePasswordSchema = Yup.object().shape({
  currentPassword: Yup.string()
    .required("Current Password is required")
    .min(8, "Current Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Current Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Current Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Current Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Current Password must contain at least one special character"
    ),
  password: Yup.string()
    .required("Password is required")
    .min(8, "Password must be at least 8 characters")
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter"
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter"
    )
    .matches(
      /(?=.*[!@#\$%\^&\*])/,
      "Password must contain at least one special character"
    ),
  confirmPassword: Yup.string()
    .required("Confirm Password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),
});

export interface IChangePasswordSchema
  extends Yup.Asserts<typeof changePasswordSchema> {}

// Add to wishlist
export const preFormSchema = Yup.object().shape({
  business_name: Yup.string()
    .required("Business Name is required")
    .min(2, "Business Name must be at least 2 characters"),
  company_email: Yup.string()
    .email()
    .lowercase()
    .required("Company Email is required"),
  company_phone: Yup.string().required("Company Phone is required"),
  gst_number: Yup.string().required("GST Number is required"),
  website: Yup.string().url().required("Website is required"),
  type_of_business: Yup.string().required("Type of business is required"),
  contacts: Yup.array().of(
    Yup.object().shape({
      name: Yup.string().required("Name is required"),
      phone: Yup.string().required("Phone number is required"),
      email: Yup.string()
        .email("Invalid email format")
        .required("Email is required"),
    })
  ),
  omni_channels: Yup.array()
    .of(Yup.string().required("Channel is required"))
    .min(1, "At least one channel is required"),
});

export interface IPreFormSchema extends Yup.Asserts<typeof preFormSchema> {}

export const creatorFormSchema = Yup.object().shape({
  full_name: Yup.string()
    .required("Full_Name_is_required")
    .min(2, "Full_Name_must_be_at_least_2_characters"),
  user_name: Yup.string()
    .required("User_Name_is_required")
    .min(2, "User_Name_must_be_at_least_2_characters"),
  email: Yup.string().email().lowercase().required("Email_is_required"),
  phone_number: Yup.string()
    .required("Phone_number_is_required")
    .min(10, "Full_Name_must_be_at_least_10_digits"),
  profile_title: Yup.string()
    .required("Profile_title_is_required")
    .min(2, "Profile_title_must_be_at_least_2_characters"),
  long_description: Yup.string()
    .required("Long_Description_is_required")
    .min(100, "Long_Description_must_be_at_least_100_characters"),
  short_description: Yup.string()
    .required("Short_Description_is_required")
    .min(10, "Short_Description_must_be_at_least_10_characters"),
  tags: Yup.array().of(Yup.string().required("Tags_is_required")),
  category: Yup.array().of(Yup.string().required("Category_is_required")),
  sub_category: Yup.array().of(
    Yup.string().required("sub_Category_is_required")
  ),
  profile_image: Yup.string().required("Profile_Image_is_required"),
  banner_image: Yup.string().required("Banner_Image_is_required"),
});

export interface ICreatorFormSchema
  extends Yup.Asserts<typeof creatorFormSchema> {}

export const contactSchema = Yup.object().shape({
  firstName: Yup.string().required("First Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  type: Yup.string().required("Type is required"),
  message: Yup.string().required("Message is required"),
});

export interface IContactSchema extends Yup.Asserts<typeof contactSchema> {}

export const profileUpdateSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  phone: Yup.string().required("Phone is required"),
});

export interface IProfileUpdateSchema
  extends Yup.Asserts<typeof profileUpdateSchema> {}

export const vendorProfileUpdateSchema = Yup.object().shape({
  company_email: Yup.string()
    .email("Company Email must be a valid email address")
    .required("Company Email is required"),
  company_phone: Yup.string().required("Company Phone is required"),
  gst_number: Yup.string().required("GST Number is required"),
  website: Yup.string()
    .url("Website must be a valid URL")
    .required("Website is required"),
  business_name: Yup.string().required("Business Name is required"),
});

export interface IVendorProfileUpdateSchema
  extends Yup.Asserts<typeof vendorProfileUpdateSchema> {}

export const addAddressVendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  zip_code: Yup.string().required("Zip is required"),
  city: Yup.string().required("City is required"),
  state: Yup.string().required("State is required"),
  house_no: Yup.string().required("House No is required"),
  address: Yup.string().required("Address is required"),
  isDefault: Yup.boolean().optional().default(false),
});

export interface IAddAddressVendorSchema
  extends Yup.Asserts<typeof addAddressVendorSchema> {}

export const addContactVendorSchema = Yup.object().shape({
  name: Yup.string().required("Name is required"),
  phone: Yup.string().required("Phone is required"),
  email: Yup.string()
    .email("Email must be a valid email address")
    .required("Email is required"),
  isDefault: Yup.boolean().optional().default(false),
});

export interface IAddContactVendorSchema
  extends Yup.Asserts<typeof addContactVendorSchema> {}

// Add to wishlist
export const creatorOnBoardingSchema = Yup.object().shape({
  full_name: Yup.string().required("Full name is required"),
  user_name: Yup.string().required("User name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
  phone_number: Yup.string().required("Phone number is required"),

  // Profile
  profile_title: Yup.string().required("Title is required"),
  short_description: Yup.string().required("Short description is required"),
  long_description: Yup.string().required("Long description is required"),
  tags: Yup.array()
    .of(Yup.string().required("Each tag must be a string"))
    .min(1, "At least one tag is required")
    .required("Tags are required"),
  category: Yup.string().required("Category is required"),
  sub_category: Yup.string().required("Sub-category is required"),
  profile_image: Yup.string().nullable(),
  banner_image: Yup.string().nullable(),
});

export interface ICreatorOnBoardingSchema
  extends Yup.Asserts<typeof creatorOnBoardingSchema> {}
