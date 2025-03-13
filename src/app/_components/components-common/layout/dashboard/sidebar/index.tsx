"use client";

import React, { useEffect, useState } from "react";
import {
  Home,
  Box,
  User,
  Megaphone,
  BarChart,
  DollarSign,
  LifeBuoy,
  Settings,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  LayoutGrid,
  Store,
  UserRound,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { GoSidebarExpand } from "react-icons/go";
import { translate } from "../../../../../../lib/utils/translate";
import { getProfileAPI } from "@/lib/web-api/user";
import { getServerSession } from "next-auth";
import authOptions from "@/lib/config/authOptions";
import { useAuthStore } from "@/lib/store/auth";
import { USER_TYPE } from "@/lib/utils/constants";
import { useSession } from "next-auth/react";

type MenuItem = {
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  link?: string;
  children?: { label: string; link: string }[];
};

const NavLink = ({
  link = "",
  isActive = false,
  Icon = undefined,
  label = "",
  hasSubmenu = false,
  handleToggle = () => {},
  expended = false,
  isChild = false,
  childIndex,
}: any) => {
  const childLinkClasses = `relative block px-4 py-2 rounded-md ${
    isActive
      ? "bg-primary-color text-white"
      : "text-gray-500 hover:text-gray-700"
  } before:absolute before:-left-5 before:bottom-1/2 before:w-5 before:border-b-2 before:border-l-2 before:border-gray-300 before:rounded-bl-xl ${
    childIndex === 0 ? "before:h-7" : "before:h-16"
  } text-nowrap text-[14px]`;

  const classNames = isChild
    ? childLinkClasses
    : `flex ${
        hasSubmenu ? "justify-between" : ""
      } items-center text-[16px] cursor-pointer px-4 py-3 space-x-3 rounded-md text-nowrap  ${
        isActive
          ? hasSubmenu
            ? "bg-[#FF49791A] text-black"
            : "bg-primary-color text-white"
          : "text-font-grey hover:bg-pink-100"
      }`;
  const iconClassNames = `w-5 h-5 ${
    isActive ? (hasSubmenu ? "text-black" : "text-white") : "text-font-grey"
  }`;
  if (hasSubmenu) {
    return (
      <div className={classNames} onClick={handleToggle}>
        <div className="flex gap-2">
          <div>{Icon && <Icon className={iconClassNames} />}</div>
          <div>{label}</div>
        </div>
        <div>
          {expended ? (
            <ChevronUp className="ml-auto w-4 h-4" />
          ) : (
            <ChevronDown className="ml-auto w-4 h-4" />
          )}
        </div>
      </div>
    );
  }

  return (
    <Link href={link} className={classNames} onClick={handleToggle}>
      {Icon && <Icon className={iconClassNames} />}
      <span>{label}</span>
    </Link>
  );
};
interface ISidebarProps {
  handleExpandSidebar: () => void;
  expanded: boolean;
  // role: string;
}
const Sidebar = ({ expanded, handleExpandSidebar }: ISidebarProps) => {
  const pathname = usePathname(); // Get the current path
  const account: any = useAuthStore((s) => s.account);
  const session = useSession();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>(
    {}
  );

  const toggleMenu = (label: string, isSubMenu: boolean) => {
    let keys = Object.keys(expandedMenus).filter((key) => expandedMenus[key]);
    const obj = Object.fromEntries(keys.map((key) => [key, false]));
    setExpandedMenus((prev) => ({
      ...(isSubMenu ? obj : prev),
      [label]: !(isSubMenu ? obj : prev)[label],
    }));
  };
  const menuItems: MenuItem[] = [
    { label: translate("Overview"), icon: Home, link: "/overview" },
    {
      label: translate("Product_Catalog"),
      icon: Box,
      children: [
        { label: translate("Add_New_Product"), link: "/products/add" },
        { label: translate("Product_List"), link: "/products" },
      ],
    },
    { label: translate("Creator&Collaboration"), icon: User, link: "/creator" },
    {
      label: translate("Campaign"),
      icon: Megaphone,
      children: [
        { label: translate("Add_New_Campaign"), link: "/campaign/add" },
        { label: translate("Campaign_List"), link: "/campaign" },
        // { label: 'Campaign Metrics', link: '/campaign/metrics' },
      ],
    },
    // { label: translate("Bids"), icon: BarChart, link: "/bids" },
    // {
    //   label: translate("Brand_Analysis"),
    //   icon: BarChart,
    //   link: "/brand-analysis",
    // },
    // {
    //   label: translate("Account_Recharge"),
    //   icon: DollarSign,
    //   link: "/recharge",
    // },
    // { label: translate("Payments"), icon: DollarSign, link: "/payments" },
    // { label: translate("Support"), icon: LifeBuoy, link: "/support" },
    { label: translate("Settings"), icon: Settings, link: "/settings" },
  ];
  const creatorMenuItem: MenuItem[] = [
    { label: translate("Dashboard"), icon: LayoutGrid, link: "/dashboard" },
    {
      label: translate("My_Store"),
      icon: Store,
      children: [
        { label: translate("Store_set_up"), link: "/my-store/store-setup" },
        { label: translate("Product_List"), link: "/my-store" },
      ],
    },
    {
      label: translate("Product_Management"),
      icon: Box,
      link: "/product-management",
    },
    // {
    //   label: translate("Bidding_Management"),
    //   icon: BarChart,
    //   link: "/brand-analysis",
    // },
    {
      label: translate("Creator_Analysis"),
      icon: BarChart,
      link: "/creator_analysis",
    },
    // { label: translate("Collaboration"), icon: UserRound, link: "/payments" },
    {
      label: translate("Payment_Earnings"),
      icon: DollarSign,
      link: "/payment-earnings",
    },
    // { label: translate("Support"), icon: LifeBuoy, link: "/support" },
    // { label: translate("Settings"), icon: Settings, link: "/settings" },
  ];

  console.log("account", session);

  const menus = {
    vendor: menuItems,
    creator: creatorMenuItem,
  };
  const menu: MenuItem[] = Object.keys(menus).includes(account?.type)
    ? menus[account?.type]
    : menus.vendor;
  const handleToggleMenu = () => {
    let keys = Object.keys(expandedMenus).filter(
      (key) => expandedMenus[key] === true
    );
    const obj = Object.fromEntries(keys.map((key) => [key, false]));
    setExpandedMenus(obj);
  };
  return (
    <>
      <aside
        id="sidebar-multi-level-sidebar"
        className={`max-w-[300px] w-full h-screen bg-white flex flex-col  fixed lg:relative top-0 left-0 z-40 transition-transform ${
          expanded ? "-translate-x-full" : ""
        } lg:translate-x-0`}
      >
        <div className="flex justify-end lg:justify-center gap-10">
          <div className="p-4 pb-8 text-primary-color font-bold text-4xl text-center">
            truereff
          </div>
          <GoSidebarExpand
            size={25}
            className="cursor-pointer float-right mt-5 mr-2 lg:hidden"
            onClick={handleExpandSidebar}
          />
        </div>
        <nav className="flex flex-col space-y-2 px-3 overflow-auto flex-1">
          {(menu ?? []).map((item, idx) => (
            <div key={idx} className="group">
              {item.children ? (
                <div>
                  <NavLink
                    key={idx}
                    isActive={item.children.some(
                      (child) => pathname === child.link
                    )}
                    handleToggle={() => toggleMenu(item.label, false)}
                    label={item.label}
                    Icon={item.icon}
                    hasSubmenu
                    expended={expandedMenus[item.label]}
                  />
                  {expandedMenus[item.label] && (
                    <div className="ml-6 px-4">
                      <div className="flex flex-col gap-3 px-4 pt-2">
                        {item.children.map((child, idx) => (
                          <NavLink
                            key={idx}
                            link={child.link}
                            handleToggle={() => toggleMenu(item.label, true)}
                            isActive={pathname === child.link}
                            label={child.label}
                            isChild
                            childIndex={idx}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={idx}
                  handleToggle={() => {
                    handleToggleMenu();
                  }}
                  link={item.link}
                  isActive={pathname === item.link}
                  Icon={item.icon}
                  label={item.label}
                />
              )}
            </div>
          ))}
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
