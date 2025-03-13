import React from "react";
import CreatorRegistration from "../_components/pages/creator-registration";
import AuthenticatedLayout from "@/app/_components/components-common/authenticated-layout";
import { getProfileAPI } from "@/lib/web-api/user";

export default async function page() {
    return (
      // <AuthenticatedLayout isPreForm={true}>
        <CreatorRegistration profile={{}} />
      // </AuthenticatedLayout>
    );
}
