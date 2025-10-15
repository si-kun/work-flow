import AppSidebar from "@/components/sidebar/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

const PrivateLayout = ({ children }: React.ReactNode) => {
  return (
    <div>
      <SidebarProvider>
        <AppSidebar />
        {children}
      </SidebarProvider>
    </div>
  );
};

export default PrivateLayout;
