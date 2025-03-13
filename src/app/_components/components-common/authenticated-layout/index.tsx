"use client";

import { ReactNode, useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useAuthStore } from "@/lib/store/auth";
import { USER_TYPE } from "@/lib/utils/constants";
import { useSession } from "next-auth/react";
import { getProfileAPI } from "@/lib/web-api/user";

interface IAuthenticatedLayoutProps {
  children: ReactNode;
  redirectPath?: string;
  isPreForm?: boolean;
}

export default function AuthenticatedLayout({
  children,
  redirectPath = "",
  isPreForm = false,
}: IAuthenticatedLayoutProps) {
  const { setAccountData, account } = useAuthStore();
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAccount = async () => {
      if (status === "loading" || !session) return;

      setLoading(true);
      try {
        const accountData = await getProfileAPI();
        console.log("Fetched account data:", accountData);
        setAccountData(accountData);
      } catch (error) {
        console.error("Error fetching account profile", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccount();
  }, [session, status, setAccountData, loading]);

  // ✅ Wait until `loading` is false & account is updated
  // if (loading || !account.email) {
  //   return <div>Loading...</div>;
  // }

  // 🚀 Ensure redirection only happens after account data is available
  if (!session) {
    redirect("/register");
    return null;
  }

  if (account.role === USER_TYPE.Vendor) {
    redirect("/pre-form");
    return null;
  }

  if (account.role === USER_TYPE.Creator) {
    redirect("/creator-registration");
    return null;
  }

  if (redirectPath) {
    redirect(redirectPath);
    return null;
  }

  return <>{children}</>;
}
