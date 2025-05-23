import CollaborationList from "@/app/_components/pages/vendor-collobration/collaboration";
import LoadingPage from "@/lib/components/loading-page";
import React, { Suspense } from "react";

export default function Collaboration() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <CollaborationList />
    </Suspense>
  );
}
