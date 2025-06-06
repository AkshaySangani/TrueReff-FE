"use client";
import React, { useEffect, useState } from "react";
import { StatsCard } from "../../components-common/states/StatesCard";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import useMediaQuery from "@/lib/hooks/useMediaQuery";
import ProfileCompletionCard from "../../components-common/charts/profileComplete";
import PerformanceSummaryChartDashBoard from "../../components-common/charts/performanceSummary";
import TrendingInsightsDiscoverability from "../../components-common/charts/trendingInsightsDiscoverability";
import { getCreatorProgress } from "@/lib/web-api/auth";
import { toastMessage } from "@/lib/utils/toast-message";
import { getErrorMessage } from "@/lib/utils/commonUtils";
import {
  ICreatorStateInfo,
  ITopBrands,
} from "@/lib/types-api/creator-dashboard";
import {
  getCreatorStatesInfo,
  getTopPerformingBrand,
} from "@/lib/web-api/creator-dashboard";
import TopBrands from "./top-brands";
import RecentCollaborations from "./recent-collaborations";
import Loader from "../../components-common/layout/loader";
import { useTranslations } from "next-intl";

export default function Dashboard() {
  const translate = useTranslations();
  const lg = useMediaQuery("(min-width: 1024px)");
  const [creatorDetails, setCreatorDetails] = useState<any>({ completed: 0 });
  const initialStateInfo = {
    activeCollaborations: 0,
    pendingCollaborations: 0,
    activeCampaigns: 0,
    last7DaysVendors: 0,
    revenue: 0,
    commission: 0,
  };
  const [statesInfo, setStatesInfo] =
    useState<ICreatorStateInfo>(initialStateInfo);
  const [brands, setBrans] = useState<ITopBrands[]>([]);
  const [mainLoading, setMailLoading] = useState<boolean>(true);
  const [brandLoading, setBrandLoading] = useState<boolean>(true);
  const getCreator = async () => {
    try {
      const creator = await getCreatorProgress();
      setCreatorDetails(creator);
    } catch (e) {}
  };
  useEffect(() => {
    getCreator();
    fetchStatesInfo();
    fetchTopPerformingBrand();
  }, []);
  const fetchStatesInfo = async () => {
    setMailLoading(true);
    try {
      const response = await getCreatorStatesInfo();
      if (response) {
        setStatesInfo(response);
      } else {
        setStatesInfo(initialStateInfo);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      toastMessage.error(errorMessage);
      setStatesInfo(initialStateInfo);
    } finally {
      setMailLoading(false);
    }
  };
  const fetchTopPerformingBrand = async () => {
    setBrandLoading(true);
    try {
      const response = await getTopPerformingBrand();
      if (response) {
        setBrans(response);
      } else {
        setBrans([]);
      }
    } catch (error) {
      let errorMessage = await getErrorMessage(error);
      toastMessage.error(errorMessage);
      setBrans([]);
    } finally {
      setBrandLoading(false);
    }
  };
  return (
    <div className="flex flex-col gap-4 md:p-6 p-4 w-full">
      {mainLoading && <Loader />}
      <div className="flex flex-col lg:flex-row w-full md:gap-6 gap-4">
        <div className="flex flex-col md:gap-6 gap-4 w-full lg:w-[60%]">
          {/* {!lg && (
            <ProfileCompletionCard progress={creatorDetails?.completed} />
          )} */}
          <div className="grid grid-cols-1 lg:grid-cols-2 md:grid-cols-3 gap-4 rounded-[20px] w-full bg-white p-4">
            <StatsCard
              title={translate("Active_Collaborations")}
              value={statesInfo.activeCollaborations}
              growth={5}
              bgColor="bg-white bg-[#f2f1fd]"
              borderColor={"border-[#7877EE]"}
              link="/creator/collaboration?status=ACTIVE"
            />
            <StatsCard
              title={translate("Pending_Collaborations")}
              value={statesInfo.pendingCollaborations}
              growth={5}
              borderColor="border-[#EB815B]"
              bgColor="bg-[#fdf2ef]"
              link="/creator/collaboration?status=PENDING"
            />
            <StatsCard
              title={translate("Revenue")}
              value={statesInfo.revenue}
              growth={5}
              borderColor="border-[#77EE8D]"
              bgColor="bg-[#f1fdf4]"
            />
            <StatsCard
              title={translate("Commission")}
              value={statesInfo.commission}
              growth={5}
              borderColor="border-[#9773C8]"
              bgColor="bg-[#f5f1fa]"
            />
          </div>
          <PerformanceSummaryChartDashBoard />
        </div>
        <div className="flex flex-col gap-6 w-full lg:w-[40%]">
          {/* {lg && <ProfileCompletionCard progress={creatorDetails?.completed} />} */}
          <TopBrands data={brands} loading={brandLoading} />
        </div>
      </div>
      <div className="flex xl:flex-row flex-col gap-4 w-full">
        <div className=" bg-white rounded-lg shadow w-full xl:w-[70%] flex-1">
          <RecentCollaborations />
        </div>
        <div className="w-full xl:w-[30%]">
          <TrendingInsightsDiscoverability />
        </div>
      </div>
    </div>
  );
}
