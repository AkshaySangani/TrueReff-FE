"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { IChannel, ICreator } from "./list";
import { useRouter } from "next/navigation";
import { Info } from "lucide-react";
function formatNumber(num:number = 0) {
    if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(1).replace(/\.0$/, "") + "M";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(1).replace(/\.0$/, "") + "K";
    }
    return num === 0 ? "": num.toString();
}

interface ICreatorTableProps {
    data: ICreator[],
    filter: string,
    user: string,
}
const CollaborationTable = ({data,filter,user}: ICreatorTableProps) => {
    const router = useRouter();
    
    const badgeColor = {Live:"bg-[#098228] text-[#098228]",Paused:"bg-[#FF9500] text-[#FF9500]",Expired:"bg-[#FF3B30] text-[#FF3B30]"}
    const handleViewCreatorDetails = (id: string) => {
        router.push(`/vendor/collaboration/${id}`)
    }
    return (
        <div className="">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/6">{translate("Product_Image")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Product_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Product_Category")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate(`${user}_Name`)}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Units_Sold")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Collab_Last_Date")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Status")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (<>
                        {data.map((creator:any, index:number) => (
                            <TableRow key={index} className="bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2" onClick={()=> handleViewCreatorDetails(creator._id)}>
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={creator.profile_image} />
                                            <AvatarImage src={"/assets/creator/creator-image.svg"} />
                                        </Avatar>
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell>{creator.full_name}</CustomTableCell>
                                <CustomTableCell>{creator.categories}</CustomTableCell>
                                <CustomTableCell>{""}</CustomTableCell>
                                <CustomTableCell>{""}</CustomTableCell>
                                <CustomTableCell>{creator.pastSales??''}</CustomTableCell>
                                <CustomTableCell className="w-[80px]">
                                    <div className={`rounded-[6px] bg-opacity-10 text-center p-2 ${badgeColor[index === 0 ? "Paused" : "Live"]}`}>{index === 0 ? "Paused" : "Live"}</div>
                                </CustomTableCell>
                            </TableRow>
                        ))}</>) : <tr><td colSpan={7}><EmptyPlaceHolder/></td></tr>}
                </TableBody>
            </Table>
        </div>
    );
}

export default CollaborationTable;

export function EmptyPlaceHolder() {
    return (
      <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
        <Info className="mx-auto mb-2 text-gray-400" />
        <h2 className="text-lg font-semibold">
          {translate("No_Collaborations_Available_Title")}
        </h2>
        <p className="text-sm">{translate("No_Collaborations_Available_Description")}</p>
      </div>
    );
  }
