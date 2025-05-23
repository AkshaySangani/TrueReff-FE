import React, { Suspense } from "react";
import ProductManagement from "@/app/_components/pages/product-management";
import Loader from "@/app/_components/components-common/layout/loader";

export default function ProductManagementPage() {
  return (
    <Suspense fallback={<Loader />}>
      <ProductManagement />
    </Suspense>
  );
}
