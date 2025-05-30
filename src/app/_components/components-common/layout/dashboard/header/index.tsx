"use client";
import React, { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { IoLogOutOutline } from "react-icons/io5";
import Link from "next/link";
import { ArrowLeft, Menu, UserRound } from "lucide-react";
import toast from "react-hot-toast";
import socketService from "@/lib/services/socket-service";
import { useAuthStore } from "@/lib/store/auth-user";
import { useVendorStore } from "@/lib/store/vendor";
import { useCreatorStore } from "@/lib/store/creator";
import axios from "@/lib/web-api/axios";
import NotificationPopover from "./notificationPopover";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils/commonUtils";

interface IPageName {
  [key: string]: string;
}
interface IHeaderProps {
  handleExpandSidebar?: () => void;
}

interface INotification {
  _id: string;
  userId: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}
function formatTimeAgo(date: string) {
  const now: any = new Date();
  const past: any = new Date(date);
  const diffMs = now - past; // Difference in milliseconds
  const diffSec = Math.floor(diffMs / 1000); // Convert to seconds
  const diffMin = Math.floor(diffSec / 60); // Convert to minutes
  const diffHours = Math.floor(diffMin / 60); // Convert to hours

  if (diffMin < 1) {
    return "Just now";
  } else if (diffMin < 60) {
    return `${diffMin} minutes ago`;
  } else if (diffHours < 2) {
    return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  } else {
    return past
      .toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
      .replace(",", ""); // Show full date & time after 2 hours
  }
}
export default function Header({ handleExpandSidebar }: IHeaderProps) {
  const router = useRouter();
  const translate = useTranslations();
  const pathName = usePathname();
  const { account } = useAuthStore();
  const { vendor } = useVendorStore();
  const { creator } = useCreatorStore();
  const [loading, setLoading] = useState<boolean>(false);
  const [notifications, setNotifications] = useState<INotification[]>([]);
  const [page, setPage] = useState<number>(1);
  const [unreadNotifications, setUnReadNotifications] = useState<number>(0);
  const [totalNotification, setTotalNotification] = useState<number>(0);
  const pageLimit: number = 10;
  const pageNames: IPageName = {
    "/vendor/dashboard": translate("Dashboard"),
    "/vendor/products/add": translate("Add_New_Product"),
    "/vendor/products": translate("Product_Lists"),
    "/vendor/products/view": translate("View_Product"),
    "/vendor/products/channels": translate("Channels"),
    "/vendor/creators": translate("Creators"),
    "/vendor/creator/details": translate("Creator_Details"),
    "/vendor/campaign/add": translate("Add_New_Campaign"),
    "/vendor/campaign": translate("Campaign_List"),
    "/vendor/settings": translate("Settings"),
    "/creator/dashboard": translate("Overview"),
    "/creator/my-store/store-setup": translate("Store_set_up"),
    "/creator/my-store": translate("Product_List"),
    "/creator/product-management": translate("Product_Management"),
    "/creator/creator_analysis": translate("Creator_Analysis"),
    "/creator/payment-earnings": translate("Payment_Earnings"),
    "/creator/brandsList": translate("Brands_List"),
    "/creator/profile": translate("Creator_Profile"),
    "/vendor/profile": translate("Brand_Profile"),
    "/vendor/creators/collaboration": translate("Collaboration"),
    "/creator/collaboration": translate("Collaboration"),
    "/vendor/creators/available-creators": translate("Available_Creators"),
    "/dashboard": translate("Dashboard"),
    "/wishlist": translate("Wishlist")
  };
  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `/message/notification/list?limit=${pageLimit}&page=${page}`
      );
      if (response?.status === 200) {
        const notificationRes: any = response?.data;
        setUnReadNotifications(notificationRes?.unreadCount);
        setTotalNotification(notificationRes?.total);
        setNotifications([...notificationRes?.data]);
      } else {
        setUnReadNotifications(0);
        setTotalNotification(0);
        setNotifications([]);
      }
    } catch (error: any) {
      setUnReadNotifications(0);
      setTotalNotification(0);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    if (account?.role) {
      fetchNotifications();
    }
  }, []);

  useEffect(() => {
    socketService.connect();
    if (creator.creatorId || vendor.vendorId) {
      let id: any = creator.creatorId || vendor.vendorId;
      id && socketService.registerUser(String(id));
    }

    socketService.onNotification((data) => {
      if (data?.message) {
        setUnReadNotifications((prev) => prev + 1);
        fetchNotifications();
      }
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const readNotifications = async (
    notificationId: string | null,
    isReadAll: boolean = false
  ) => {
    setLoading(true);
    try {
      let payload = isReadAll ? { readAll: true } : { notificationId };
      const response = await axios.put(
        `/message/notification/mark-read`,
        payload
      );
      if (response.status === 200) {
        const notification: INotification = response?.data?.data;
        let index = notification
          ? notifications.findIndex((ele) => ele?._id === notification?._id)
          : -1;
        if (index !== -1) {
          notifications[index] = notification; // Replace object at found index
          setNotifications([...notifications]);
          setUnReadNotifications((pre) => pre - 1);
        }
        if (response?.data?.message === "All notifications marked as read") {
          const updatedNotifications = notifications.map((notification) => ({
            ...notification,
            read: true,
          }));
          setNotifications([...updatedNotifications]);
          setUnReadNotifications(0);
        }
      }
    } catch (error: any) {
      setNotifications([]);
      toast.error(error?.message || "Notifications Fetch Failed.");
    } finally {
      setLoading(false);
    }
  };

  const getHeaderName = () => {
    if (pathName.includes("/vendor/creators/collaboration/")) {
      return translate("Bargaining");
    } else if (pathName.includes("/creator/profile/")) {
      return translate("Creator_Profile");
    } else if (
      pathName.includes("/vendor/products/view/") ||
      pathName.includes("/vendor/products/")
    ) {
      return translate("Product_Details");
    } else if (pathName.includes("/creator/brandsList/")) {
      return translate("Brand_Products");
    } else if (pathName.includes("/vendor/profile/")) {
      return translate("Brand_Profile");
    } else {
      return pageNames[pathName];
    }
  };
  const routes = [
    "/dashboard",
    "/creator-registration",
    "/vendor-register",
    "/wishlist"
  ]
  return (
    <>
    {(!routes.includes(pathName)) ? (<header className="bg-white px-3 py-3 flex items-center gap-1">
      <Menu
        className="size-5 shrink-0 text-primary cursor-pointer lg:hidden"
        onClick={handleExpandSidebar}
      />
      <h2 className="md:text-2xl text-lg font-medium text-primary">
        {getHeaderName()}
      </h2>
        <div className="ml-auto flex items-center md:gap-3 gap-2">
          <NotificationPopover
            notifications={notifications}
            unreadNotifications={unreadNotifications}
            fetchNotifications={fetchNotifications}
            readNotifications={readNotifications}
            formatTimeAgo={formatTimeAgo}
          />
          <Link
            href={
              creator.creatorId
                ? `/creator/profile/${creator.creatorId}`
                : `/vendor/profile/${vendor?.vendorId}`
            }
            className="flex gap-3 items-center w-fit"
          >
            <div
              className="w-8 h-8 bg-background rounded-full bg-cover bg-center flex items-center justify-center"
              style={{
                ...(creator.profile_image || vendor.profile_image
                  ? {
                      backgroundImage: `url(${
                        creator.profile_image || vendor.profile_image
                      })`,
                    }
                  : {}),
              }}
            >
              {!(creator.profile_image || vendor.profile_image) && (
                <UserRound className="" color="#656466" />
              )}
            </div>
            <p className="text-gray-black md:text-base text-sm md:block hidden">
              {creator.full_name || vendor.business_name}
            </p>
          </Link>
        </div>
      <div
        className={(!account?.role) ? "flex justify-end w-full" : ""}
      >
        <Link href="?auth=logout" className="mx-4 block">
          <IoLogOutOutline className="text-2xl text-primary" />
        </Link>
      </div>
    </header>):<header className="bg-white px-3 py-3 flex items-center gap-1">
    <Menu
        className="size-5 shrink-0 cursor-pointer lg:hidden"
        onClick={handleExpandSidebar}
      />
      <h2 className="hidden md:block md:text-2xl ml-2 text-lg font-medium text-primary">
        {getHeaderName()}
      </h2>
      <div
        className={`flex ${(pathName === "/creator-registration" || pathName === "/vendor-register") ? "justify-between":"justify-end"} items-center gap-4 w-full`}
      >
        {(pathName === "/creator-registration" || pathName === "/vendor-register") && <Link href="/dashboard" className="mx-4 block">
          <ArrowLeft className="text-2xl text-primary" />
        </Link>}
        {/* <ButtonPopover/> */}
          {(pathName !== "/creator-registration" && pathName !== "/vendor-register") && <><div onClick={() => router.push("/vendor-register")}
            className={cn(
              "text-black cursor-pointer md:text-[12px] lg:text-base  box-border border border-black rounded-[8px] py-[6px] px-[20px] hover:bg-secondary hover:text-white")}
          >
            <span className="hidden sm:block">{translate("Become_a_Brand")}</span>
            <span className="block sm:hidden">{translate("Brand")}</span>
          </div>
          <div onClick={() => router.push("/vendor-register")}
            className={cn(
              "text-black cursor-pointer md:text-[12px] lg:text-base  box-border border border-black rounded-[8px] py-[6px] px-[20px] hover:bg-secondary hover:text-white")}
          >
            <span className="hidden sm:block">{translate("Become_a_Creator")}</span>
            <span className="block sm:hidden">{translate("Creator")}</span>
          </div></>}
        <Link href="?auth=logout" className="mx-2 block">
          <IoLogOutOutline className="text-2xl text-primary" />
        </Link>
      </div>
    </header>}
    </>
  );
}
