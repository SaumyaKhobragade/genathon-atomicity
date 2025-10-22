"use client";

import {
  Bookmark,
  ChartArea,
  Folder,
  Home,
  Save,
  Sparkles,
} from "lucide-react";
import { usePathname, useSearchParams } from "next/navigation";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import Link from "next/link";

// Menu items.
const items = [
  {
    title: "Home",
    url: "/dashboard",
    icon: Home,
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "hover:bg-blue-50 dark:hover:bg-blue-950/50",
    activeBg:
      "data-[active=true]:bg-blue-100 dark:data-[active=true]:bg-blue-950",
  },  
  {
    title: "Bookmarks",
    url: "/dashboard?tab=bookmarks",
    icon: Bookmark,
    color: "text-purple-600 dark:text-purple-400",
    bgColor: "hover:bg-purple-50 dark:hover:bg-purple-950/50",
    activeBg:
      "data-[active=true]:bg-purple-100 dark:data-[active=true]:bg-purple-950",
  },
  {
    title: "Favorites",
    url: "/dashboard?tab=favorites",
    icon: Save,
    color: "text-red-600 dark:text-red-400",
    bgColor: "hover:bg-red-50 dark:hover:bg-red-950/50",
    activeBg:
      "data-[active=true]:bg-red-100 dark:data-[active=true]:bg-red-950",
  },
  {
    title: "Folders",
    url: "/dashboard?tab=folders",
    icon: Folder,
    color: "text-amber-600 dark:text-amber-400",
    bgColor: "hover:bg-amber-50 dark:hover:bg-amber-950/50",
    activeBg:
      "data-[active=true]:bg-amber-100 dark:data-[active=true]:bg-amber-950",
  },
  {
    title: "Analytics",
    url: "/dashboard?tab=analytics",
    icon: ChartArea,
    color: "text-green-600 dark:text-green-400",
    bgColor: "hover:bg-green-50 dark:hover:bg-green-950/50",
    activeBg:
      "data-[active=true]:bg-green-100 dark:data-[active=true]:bg-green-950",
  },
];

const AppSidebar = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab");

  const isActive = (item: typeof items[0]) => {
    // For home, only active when no tab param
    if (item.url === "/dashboard") {
      return pathname === "/dashboard" && !tab;
    }
    // For other tabs, check the tab param
    const itemTab = new URL(item.url, "http://localhost").searchParams.get("tab");
    return pathname === "/dashboard" && tab === itemTab;
  };

  return (
    <Sidebar className="border-r border-border/40 bg-gradient-to-b from-background to-muted/20">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
            <Sparkles className="size-5 text-white" />
          </div>
          <div>
            <h2 className="text-lg font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Memory Lane
            </h2>
            <p className="text-xs text-muted-foreground">Your Digital Memory</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
            Navigation
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {items.map((item) => {
                const active = isActive(item);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      className={`
                        relative
                        px-3 py-2.5
                        rounded-lg
                        transition-all duration-200
                        ${item.bgColor}
                        ${active ? item.activeBg.replace("data-[active=true]:", "") : ""}
                        hover:scale-[1.02]
                        hover:shadow-sm
                        active:scale-[0.98]
                        group
                      `}
                    >
                      <Link href={item.url} className="flex items-center gap-3">
                        <div
                          className={`${item.color} transition-transform group-hover:scale-110`}
                        >
                          <item.icon className="size-5" />
                        </div>
                        <span className="font-medium text-sm">{item.title}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
