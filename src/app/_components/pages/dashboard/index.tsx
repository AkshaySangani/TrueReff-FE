"use client";
import React from "react";
import { StatsCard } from "../../components-common/states/StatesCard";
import RecentActivities from "../../components-common/tables/RecentActivity";
import MostSellingBrands from "../../components-common/charts/MostSellingBrands";
import VendorActivity from "../../components-common/charts/VendorActivityChart";
import { translate } from "@/lib/utils/translate";
import PerformanceSummaryChart from "../../components-common/charts/PerformanceChart";
import DonutChart from "../../components-common/charts/DonutChat";
import CollaborationAchievements from "./CollaborationAchievements";
import ProductInsights from "./product-insights";

export default function Dashboard() {
    return <div className="flex flex-col gap-4 p-6 w-full">
        <div className="flex flex-col xl:flex-row gap-5 w-full">
            <div className="flex flex-col xl:w-1/2 gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[white] rounded-2xl p-4">
                    <StatsCard title={translate("Active_Collaborations")} value={120} growth={5} bgColor="bg-white bg-[#f2f1fd]" borderColor={"border-[#7877EE]"} />
                    <StatsCard title={translate("Active_Collaborations")} value={120} growth={5} bgColor="bg-white bg-[#f2f1fd]" borderColor={"border-[#7877EE]"} />
                    <StatsCard title={translate("Active_Collaborations")} value={120} growth={5} bgColor="bg-white bg-[#f2f1fd]" borderColor={"border-[#7877EE]"} />
                    <StatsCard title={translate("Active_Collaborations")} value={120} growth={5} bgColor="bg-white bg-[#f2f1fd]" borderColor={"border-[#7877EE]"} />
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                    <PerformanceSummaryChart />
                </div>
                <div>
                    <CollaborationAchievements />
                </div>
            </div>
            <div className="flex flex-col w-full xl:flex-col md:flex-row xl:w-1/2 gap-4">
                <div className=" rounded-lg bg-[white]">
                    <div className="p-6 bg-gradient-to-r from-[#9B5FE9] via-[#6684F0] via-[#DE598E] to-[#FBB11E] rounded-xl shadow flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-xl font-bold text-black">
                                80%
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">Complete your profile</h2>
                                <p className="text-gray-700">Complete your profile to unlock earnings, brand deals, and full platform access.</p>
                            </div>
                        </div>
                        <div className="text-2xl text-black">➜</div>
                    </div>
                </div>
                <ProductInsights />
                <div className="flex gap-4">
                    <VendorActivity />
                    <VendorActivity />
                </div>
            </div>
        </div>
    </div>
}