"use client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ProductImageGallery } from "./imagePreview";
import { ProductInfo } from "./productDetail";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import { useCreatorStore } from "@/lib/store/creator";
import { useAuthStore } from "@/lib/store/auth-user";
import axios from "@/lib/web-api/axios";
import Loading from "@/app/vendor/loading";
import CommonBreadcrumb from "@/app/_components/components-common/breadcrumb-links";
import NotFound from "@/app/_components/components-common/404";
import { useTranslations } from "next-intl";

interface ICategory {
  _id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}
export interface IProduct {
  productId: string;
  images: string[];
  name: string;
  description: string;
  price: number;
  sku: string;
  barcode: string;
  quantity: number;
  totalInventory: number;
  variants: any[];
  tags: string[];
  category?: string;
  vendorId?: string;
}
export interface IRequest {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  requestFrom: string;
  createdAt: string;
  updatedAt: string;
}
export interface ICollaboration {
  _id: string;
  creatorId: string;
  productId: string;
  vendorId: string;
  collaborationStatus: string;
  utmLink: string | null;
  discountType: string;
  discountValue: number;
  couponCode: string;
  commissionPercentage: number;
  expiresAt: string;
  createdAt: string;
  updatedAt: string;
  requestId: IRequest;
}

const statusText: { [key: string]: string } = {
  REQUESTED: "Requested",
  REJECTED: "Rejected",
  PENDING: "Start Bargaining",
  LIVE: "Live",
  EXPIRED: "Expired",
  "": "Send Request",
};

const buttonColor: { [key: string]: string } = {
  LIVE: "bg-[#098228] text-[#098228]",
  REQUESTED: "bg-[#FF9500] text-[#FF9500]",
  EXPIRED: "bg-[#FF3B30] text-[#FF3B30]",
  REJECTED: "bg-[#FF3B30] text-[#FF3B30]",
  PENDING: "bg-[#000] text-[#FFF]",
  "": "bg-[#000] text-[#FFF]",
};
type ViewProductDetailProps = {
  isFromPublic?: boolean;
};
export default function ViewProductDetail({
  isFromPublic,
}: ViewProductDetailProps) {
  const translate = useTranslations();
  const pathName = usePathname();
  const { account } = useAuthStore();
  const { creator } = useCreatorStore();
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId;
  const searchParams = useSearchParams();
  const channelType = searchParams.get("channelName");
  const shopifyId = searchParams.get("id");
  const creatorId = searchParams.get("creatorId");
  const [notFounded, setNotFounded] = useState(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [collaborationStatus, setCollaborationStatus] = useState<string>("");
  const [collaborationData, setCollaborationData] = useState<ICollaboration>({
    _id: "",
    creatorId: "",
    productId: "",
    vendorId: "",
    collaborationStatus: "",
    utmLink: "",
    discountType: "",
    discountValue: 0,
    couponCode: "",
    commissionPercentage: 0,
    expiresAt: "",
    createdAt: "",
    updatedAt: "string",
    requestId: {
      _id: "",
      creatorId: "",
      productId: "",
      vendorId: "",
      collaborationStatus: "",
      requestFrom: "",
      createdAt: "",
      updatedAt: "",
    },
  });
  const [productData, setProductData] = useState<IProduct>({
    productId: "",
    images: [],
    name: "",
    description: "",
    price: 0,
    sku: "",
    barcode: "",
    quantity: 0,
    totalInventory: 0,
    variants: [],
    tags: [],
    category: "",
    vendorId: "",
  });
  // Update fetProductsList to set both cursors
  const fetchShopifyProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `channel/shopify/product?productId=${shopifyId}`
      );

      const product: any = response?.data?.data;
      const images = product?.media?.nodes?.map((ele: any) => ele?.image.url);
      // ✅ Update product state
      const updatedProduct = {
        productId: product.id,
        images: images,
        name: product.title,
        tags: product?.tags || [],
        description: product?.description || "", // Add description if available
        price: product?.price || 0,
        sku: product?.sku || "",
        barcode: product?.variants?.nodes[0]?.barcode || "",
        quantity: product?.quantity || 0,
        totalInventory: product?.totalInventory || 0,
        variants: product?.variants?.nodes || [],
      };

      setProductData(updatedProduct);
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductById = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        pathName.includes("/creators/")
          ? `/auth/creator-store/product/${productId}`
          : `/product/${productId}`
      );

      const product: any = pathName.includes("/creators/")
        ? response?.data?.data
        : response?.data?.data?.data;
      if (product) {
        const images = product.media;
        // ✅ Update product state
        const updatedProduct = {
          productId: product._id,
          images: images,
          name: product.title,
          tags: product?.tags || [],
          description: product?.description || "", // Add description if available
          price: product?.price || 0,
          sku: product?.sku || "",
          barcode: product?.variants?.nodes[0]?.barcode || "",
          quantity: product?.quantity || 0,
          totalInventory: product?.totalInventory || 0,
          variants: product?.variants?.nodes || [],
          category: product?.category
            ?.filter((ele: ICategory) => ele?.parentId === null)
            ?.map((ele: ICategory) => ele?.name)
            ?.join(", "),
          vendorId: product?.vendorId,
        };

        setProductData(updatedProduct);
      } else {
        throw "Data not found";
      }
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
      setNotFounded(true);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCollaborationStatus = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/status/${productId}${
          creatorId ? `?creatorId=${creatorId}` : ``
        }`
      );
      const collaboration: any = response?.data?.data?.collaboration;
      setCollaborationStatus(
        collaboration ? getRequestStatus(collaboration) : ""
      );
      setCollaborationData(collaboration);
    } catch (error: any) {
      toast.error(error?.message || "Status Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  // Update useEffect to fetch the initial product list
  useEffect(() => {
    if (shopifyId) {
      fetchShopifyProductById();
    }
  }, [shopifyId]);

  useEffect(() => {
    if (!channelType && productId) {
      fetchProductById();
    }
  }, [productId]);
  useEffect(() => {
    if ((!pathName.includes("/creators/") && creator?.creatorId) || creatorId) {
      fetchProductCollaborationStatus();
    }
  }, [creator?.creatorId]);
  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productIds: [productData?.productId],
          creatorId: creator.creatorId,
          vendorId: productData?.vendorId,
        }
      );
      if (response.status === 201) {
        let data = response?.data?.data?.results;
        if (data && data?.length > 0 && data[0]?.data) {
          fetchProductCollaborationStatus();
        }
        if (data && data?.length > 0 && data[0]?.message) {
          toast.success(data[0]?.message);
        }
        setLoading(false);
      } else {
        setLoading(false);
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage);
      setLoading(false);
    }
  };

  const handleButtonClick = async (status: string) => {
    if (status === "" || status === "REJECTED") {
      handleSendRequest();
    } else if (status === "PENDING") {
      router.push(`/${account?.role}/collaboration/${collaborationData?._id}`);
    }
  };

  const getRequestStatus = (collaboration: ICollaboration) => {
    const { requestId } = collaboration;
    if (requestId) {
      if (
        requestId?.collaborationStatus === "REQUESTED" ||
        requestId?.collaborationStatus === "REJECTED"
      ) {
        return requestId?.collaborationStatus;
      } else {
        return collaboration?.collaborationStatus;
      }
    } else return "SEND_REQUEST";
  };
// Product id required condition removed as it is not required.
  if (notFounded) {
    return <NotFound />;
  }

  return (
    <>
      {loading ? (
        <Loading className="h-screen" />
      ) : (
        <div className="flex flex-col w-full p-3 md:p-6 gap-4 h-[100vh]">
          {/* Breadcrumb and Button */}
          <div className="flex md:flex-row items-center justify-between md:items-center gap-2">
            <CommonBreadcrumb
              items={[
                {
                  label: translate("Product_List"),
                  href: isFromPublic
                    ? "/store/creatorstore"
                    : creator?.creatorId
                    ? pathName.includes("/product-management")
                      ? `/creator/product-management`
                      : `/creator/brandsList/${params.id}`
                    : channelType
                    ? `/vendor/products/channel-products`
                    : `/vendor/products`,
                },
                {
                  label: translate("View_Product"), // No href => current page
                },
              ]}
            />

            {((!pathName.includes("/creators/") && creator?.creatorId) ||
              creatorId) && (
              <Button
                disabled={
                  collaborationStatus === "REQUESTED" ||
                  collaborationStatus === "REJECTED"
                }
                variant="secondary"
                className={`${buttonColor[collaborationStatus]} text-white ml-auto`}
                onClick={() => handleButtonClick(collaborationStatus)}
              >
                {translate(statusText[collaborationStatus]?.replace(/ /g, "_"))}
              </Button>
            )}
            {/* {(pathName.includes("/creators/")) && (
              <Button
                disabled={
                  collaborationStatus === "REQUESTED" ||
                  collaborationStatus === "REJECTED"
                }
                variant="secondary"
                className={`${buttonColor[collaborationStatus]} text-white ml-auto`}
                onClick={() => handleButtonClick(collaborationStatus)}
              >
                {statusText[collaborationStatus]}
              </Button>
            )} */}
          </div>

          {/* Card Section */}
          <Card className="bg-white rounded-lg overflow-auto mr-2">
            <CardContent className=" p-3 md:p-6">
              <div className="flex flex-col md:grid grid-cols-1 md:grid-cols-3 gap-4">
                <ProductImageGallery images={productData?.images} />
                <div className="col-span-2">
                  <ProductInfo productData={productData} />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}
