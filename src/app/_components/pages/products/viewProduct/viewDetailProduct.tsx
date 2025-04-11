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
import useAxiosAuth from "@/lib/hooks/useAxiosAuth";
import Loader from "@/app/_components/components-common/layout/loader";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { translate } from "@/lib/utils/translate";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import BargainingView from "../barganing/view";
import { useCreatorStore } from "@/lib/store/creator";

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
export default function ViewProductDetail() {
  const pathName = usePathname();
  const axios = useAxiosAuth();
  const { creator } = useCreatorStore();
  const params = useParams();
  const router = useRouter();
  const productId = params?.productId;
  const channelType = params?.channelType;
  const searchParams = useSearchParams();
  const shopifyId = searchParams.get("id");
  const isChatView = searchParams.get("isChatView") === "true";
  const brandName = searchParams.get("brandName");
  const creatorId = searchParams.get("creatorId");

  const [loading, setLoading] = useState<boolean>(false);
  const [isUTMView, setIsUTMView] = useState<boolean>(false);
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

      const images = product?.featuredMedia?.preview?.image?.url;
      const imagess = product?.media?.nodes?.map((ele: any) => ele?.image.url);
      // ✅ Update product state
      const updatedProduct = {
        productId: product.id,
        images: imagess,
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
      const response = await axios.get(`/product/${productId}`);

      const product: any = response?.data?.data?.data;
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
    } catch (error: any) {
      toast.error(error?.message || "Product Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductCollaborationStatus = async (creatorID: string) => {
    if (!creatorID) return;
    setLoading(true);
    try {
      const response = await axios.get(
        `/product/collaboration/status/${productId}?creatorId=${creatorID}`
      );
      const collaboration: any = response?.data?.data?.collaboration;
      setCollaborationStatus(collaboration?.collaborationStatus ?? "");
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
    if (productId) {
      fetchProductById();
    }
  }, [productId]);
  useEffect(() => {
    const creator_id = creator.creatorId || creatorId;
    if (creator_id) {
      fetchProductCollaborationStatus(creator_id);
    }
  }, [creator.creatorId, creatorId]);
  const handleSendRequest = async () => {
    setLoading(true);
    try {
      const response: any = await axios.post(
        `/product/collaboration/creator/request`,
        {
          productId: productData?.productId,
          creatorId: creator.creatorId,
          vendorId: productData?.vendorId,
          discountType: "PERCENTAGE", //"PERCENTAGE", "FIXED_AMOUNT"
          discountValue: 10,
          couponCode: "ABCDEFG",
          expiresAt: "2025-12-31T23:59:59Z",
        }
      );
      if (response.status === 200) {
        toast.success(response.data.message);
      }
      if (response.status === 201) {
        let data = response?.data?.data?.newCollaboration;
        if (data && data?.collaborationStatus) {
          setCollaborationStatus(data?.collaborationStatus);
        }
        toast.success(response.data.message);
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
      const params = new URLSearchParams(searchParams.toString());

      params.set("isChatView", "true");

      router.push(`?${params.toString()}`, { scroll: false });
    }
  };
  const handleProductView = () => {
    if (isChatView) {
      const params = new URLSearchParams(searchParams.toString());

      params.delete("isChatView");

      router.push(`?${params.toString()}`, { scroll: false });
      setIsUTMView(false);
    }
  };

  return (
    <div className="flex flex-col w-full p-6 gap-6">
      {loading && <Loader />}
      {/* Breadcrumb and Button */}
      <div className="flex md:flex-row flex-col items-start justify-between md:items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList
            className="md:text-sm text-xs
"
          >
            {(channelType || brandName) && (
              <>
                <BreadcrumbItem>
                  <BreadcrumbPage
                    className="cursor-pointer hover:text-[grey] "
                    onClick={() => router.push("/creator/brandsList/")}
                  >
                    {channelType || brandName}
                  </BreadcrumbPage>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="md:size-6 size-4" />
              </>
            )}
            <BreadcrumbItem>
              <BreadcrumbPage
                className="cursor-pointer hover:text-[grey]"
                onClick={() =>
                  router.push(
                    productId
                      ? pathName.includes("/creator/collaboration")
                        ? `/creator/collaboration`
                        : pathName.includes("/product-management")
                        ? `/creator/product-management`
                        : `/creator/brandsList/${params.id}?brandName=${brandName}`
                      : `/vendor/products/${params?.channelType}`
                  )
                }
              >
                {translate("Product_List")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="md:size-6 size-4" />
            <BreadcrumbItem>
              <BreadcrumbPage
                className={`cursor-pointer ${
                  isChatView ? "hover:text-[grey]" : ""
                }`}
                onClick={() => handleProductView()}
              >
                {translate("View_Product")}
              </BreadcrumbPage>
            </BreadcrumbItem>
            {isChatView ? (
              <>
                <BreadcrumbSeparator className="md:size-6 size-4" />
                <BreadcrumbItem>
                  <BreadcrumbPage>{"Bargaining"}</BreadcrumbPage>
                </BreadcrumbItem>
              </>
            ) : (
              <></>
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {(!isChatView ||
          (collaborationStatus === "PENDING" &&
            !creator.creatorId &&
            !isChatView)) && (
          <Button
            disabled={
              collaborationStatus === "REQUESTED" ||
              collaborationStatus === "REJECTED"
            }
            variant="secondary"
            className={`${buttonColor[collaborationStatus]} text-white`}
            onClick={() => handleButtonClick(collaborationStatus)}
          >
            {statusText[collaborationStatus]}
          </Button>
        )}
      </div>

      {/* Card Section */}
      {isChatView ? (
        <BargainingView
          productData={productData}
          isVendor={!Boolean(creator.creatorId)}
          collaborationData={collaborationData}
          openUtmForm={() => {
            setIsUTMView(true);
          }}
          isOpenUtmForm={Boolean(isUTMView && collaborationData)}
        />
      ) : (
        <Card className="bg-white rounded-lg overflow-auto">
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProductImageGallery images={productData?.images} />
              <ProductInfo productData={productData} />
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
