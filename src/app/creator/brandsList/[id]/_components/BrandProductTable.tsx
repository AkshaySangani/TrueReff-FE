"use client";

import React from "react";
import { Table, TableHeader, TableRow, TableBody } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { CustomTableHead } from "@/app/_components/components-common/tables/CustomTableHead";
import { CustomTableCell } from "@/app/_components/components-common/tables/CustomTableCell";
import { translate } from "@/lib/utils/translate";
import { IBrand } from "./list";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Eye, Info } from "lucide-react";

interface ICreatorTableProps {
    data: IBrand[],
    brandName: string;
}
export default function BrandProductTable({ data,brandName }: ICreatorTableProps) {
    const router = useRouter();
    const params = useParams();
    const handleDetailView = (id: string) => {
        router.push(`/creator/brandsList/${params.id}/${id}?brandName=${brandName}`);
    }
    return (
        <div className="overflow-auto">
            <Table className="min-w-full border border-gray-200 overflow-hidden rounded-2xl">
                <TableHeader className="bg-stroke">
                    <TableRow >
                        <CustomTableHead className="w-1/6">{translate("Product_Image")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Product_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/6">{translate("Brand_Name")}</CustomTableHead>
                        <CustomTableHead className="w-1/8">{translate("Category")}</CustomTableHead>
                         <CustomTableHead className="w-1/8">{translate("Tags")}</CustomTableHead>
                        {/*<CustomTableHead className="w-1/6">{translate("Total_Sale")}</CustomTableHead>
                        <CustomTableHead className="w-1/4">{translate("Brand_Rating")}</CustomTableHead> */}
                        <CustomTableHead className="w-1/6 text-center">{translate("Action")}</CustomTableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data.length > 0 ? (<>
                        {data.map((brand: IBrand, index: number) => (
                            <TableRow key={index} className="even:bg-gray-100 odd:bg-white">
                                <CustomTableCell>
                                    <div className="flex items-center gap-2">
                                        <Avatar className="w-8 h-8">
                                            <AvatarImage src={brand.productId.media[0]} />
                                            <AvatarImage src={"/assets/brand/brand-image.svg"} />
                                        </Avatar>
                                    </div>
                                </CustomTableCell>
                                <CustomTableCell>{brand.productId.title}</CustomTableCell>
                                <CustomTableCell>{brandName}</CustomTableCell>
                                 <CustomTableCell>{brand.productId?.categories?.join(", ")}</CustomTableCell>
                                <CustomTableCell>{brand.productId.tags.join(", ")}</CustomTableCell>
                                {/* <CustomTableCell>{brand.pastSales??''}</CustomTableCell> */}
                                {/* <CustomTableCell>{brand.tag}</CustomTableCell> */}
                                <CustomTableCell>
                                    <div className="flex justify-center items-center gap-3">
                                        <Eye
                                            color="#FF4979"
                                            className="cursor-pointer"
                                            onClick={() => handleDetailView(brand.productId._id)}
                                        />
                                        <Button variant="outline" className="whitespace-nowrap  bg-red-500 text-white rounded-md transition-all hover:bg-red-200 py-3 px-[10px] text-sm">
                                            {translate("Collaborate_Now")}
                                        </Button>
                                    </div>
                                </CustomTableCell>
                            </TableRow>
                        ))}</>) : <tr><td colSpan={8}><EmptyPlaceHolder /></td></tr>}
                </TableBody>
            </Table>
        </div>
    );
}
export function EmptyPlaceHolder() {
    return (
        <div className=" flex items-center justify-center flex-col flex-1 col-span-full text-center h-[200px] text-gray-500 p-4 bg-white ">
            <Info className="mx-auto mb-2 text-gray-400" />
            <h2 className="text-lg font-semibold">
                {translate("No_Products_Available_Title")}
            </h2>
            <p className="text-sm">{translate("No_Products_Available_Description")}</p>
        </div>
    );
}
