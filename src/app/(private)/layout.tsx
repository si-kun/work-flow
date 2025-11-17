"use client";

import Loading from "@/components/loading/Loading";
import AppSidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useFetchAllUsers } from "@/hooks/user/useFetchAllUser";
import React from "react";

interface PrivateLayoutProps {
  children: React.ReactNode;
}

const PrivateLayout = ({ children }: PrivateLayoutProps) => {
  const {loading} = useFetchAllUsers();

  if(loading) {
    return <Loading />
  }

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="p-4 w-full h-screen overflow-hidden">{children}</div>
      </SidebarProvider>
    </div>
  );
};

export default PrivateLayout;
