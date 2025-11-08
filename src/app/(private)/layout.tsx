"use client"

import AppSidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { useFetchAllUsers } from "@/hooks/useFetchAllUser";
import React from "react";

const PrivateLayout = ( {children} : React.ReactNode) => {

  useFetchAllUsers();

  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        <div className="p-4 w-full h-screen overflow-hidden">

        {children}
        </div>
      </SidebarProvider>
    </div>
  );
};

export default PrivateLayout;
