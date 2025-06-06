"use client";
import React from "react";
import { IProduct } from "./viewDetailProduct";
import { useTranslations } from "next-intl";

interface IProductInfoProps {
  productData: IProduct;
}

export function ProductInfo({ productData }: IProductInfoProps) {
  const translate = useTranslations();
  return (
    <div className="flex flex-1 flex-col gap-6 p-6 overflow-auto pr-2">
      <h1 className="sm:text-3xl text-xl font-bold text-gray-800">
        {productData.name}
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        <div>
          <p className="sm:text-sm text-xs text-gray-500 mb-1">
            {translate("Category")}
          </p>
          <p className="sm:text-base text-sm  font-medium text-gray-700">
            {productData.category}
          </p>
        </div>
        <div>
          <p className="sm:text-sm text-xs text-gray-500 mb-1">Price</p>
          <p className="sm:text-xl text-sm font-semibold text-green-600">
            ${productData.price}
          </p>
        </div>
      </div>
      {productData.tags?.length > 0 && (
        <div className="border-t border-gray-200 pt-6">
          <p className="text-sm text-gray-500 mb-2">{translate("Tags")}</p>
          <div className="text-gray-500 text-sm flex flex-wrap gap-2 mt-2">
            {productData.tags.map((tag, idx) => (
              <span key={idx} className="bg-background py-1 px-2 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>
      )}
      {productData.description && (
        <div className="border-t border-gray-200 pt-6">
          <p className="sm:text-sm text-xs text-gray-500 mb-1">
            {translate("Description")}
          </p>
          <p className="sm:text-base text-sm  text-gray-800 leading-relaxed">
            {productData.description}
          </p>
        </div>
      )}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="sm:text-lg text-base font-semibold text-gray-800 mb-3">
          {translate("Pricing_And_Tax")}
        </h3>
        <div className="space-y-2 sm:text-sm text-xs text-gray-700">
          <div className="flex justify-between">
            <span>{translate("BasePrice")}</span>
            <span>${productData.price}</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("Discount")}</span>
            <span className="text-gray-500">{translate("None")}</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("Tax_Class")}</span>
            <span className="text-gray-500">{translate("Tax_Free")}</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("VAT_Amount")}</span>
            <span className="text-gray-500">12%</span>
          </div>
        </div>
      </div>
      <div className="border-t border-gray-200 pt-6">
        <h3 className="sm:text-lg text-base  font-semibold text-gray-800 mb-3">
          {translate("Variations")}
        </h3>
        <div className="space-y-2 sm:text-sm text-xs text-gray-700">
          <div className="flex justify-between">
            <span> {translate("Variation")}</span>
            <span>{translate("Rose_Gold")}</span>
          </div>
          <div className="flex justify-between">
            <span>{translate("Type")}</span>
            <span>{translate("Color")}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
