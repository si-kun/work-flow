import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Link from "next/link";

const SIDEBAR_LINKS = [
  { name: "Home", href: "/mypage/attendance" },
  {
    name: "従業員データ",
    children: [
      { name: "従業員一覧", href: "/employees" },
      { name: "勤怠データ", href: "/mypage/attendance" },
      { name: "部署別残業一覧", href: "/dashboard" },
    ],
  },
  {
    name: "シフト管理",
    children: [
      { name: "シフト一覧", href: "/shifts" },
      { name: "シフト作成", href: "/shifts/create" },
    ],
  },
  { name: "プロフィール", href: "/profile" },
];

const AppSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader />
      <SidebarContent>
        <SidebarGroup />
        <SidebarGroupLabel></SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="flex flex-col gap-2">
            {SIDEBAR_LINKS.map((link) =>
              link.children ? (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton asChild>
                    <span>{link.name}</span>
                  </SidebarMenuButton>
                  <SidebarMenuSub>
                    {link.children.map((subLink) => (
                      <SidebarMenuSubItem key={subLink.name}>
                        <SidebarMenuButton asChild>
                          <Link href={subLink.href}>{subLink.name}</Link>
                        </SidebarMenuButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                </SidebarMenuItem>
              ) : (
                <SidebarMenuItem key={link.name}>
                  <SidebarMenuButton asChild>
                    <Link href={link.href}>{link.name}</Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              )
            )}
          </SidebarMenu>
        </SidebarGroupContent>
        <SidebarGroup />
      </SidebarContent>
      <SidebarFooter />
    </Sidebar>
  );
};

export default AppSidebar;
