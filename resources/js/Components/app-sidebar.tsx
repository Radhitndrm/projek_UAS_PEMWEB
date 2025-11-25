import * as React from "react";
import { Store } from "lucide-react";
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarRail,
    useSidebar,
} from "@/components/ui/sidebar";
import { usePage } from "@inertiajs/react";
import { SideStat } from "./sidebar-menu/side-stat";
import { SideMaster } from "./sidebar-menu/side-master";
import { SideTransaction } from "./sidebar-menu/side-transaction";
import { SideStock } from "./sidebar-menu/side-stock";
import { SideReport } from "./sidebar-menu/side-report";
import { SideUserManagement } from "./sidebar-menu/side-user-management";
import { SideProfile } from "./sidebar-menu/side-profile";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const { url } = usePage();
    const { setOpenMobile } = useSidebar();
    return (
        <Sidebar collapsible="icon" {...props}>
            <SidebarHeader className="border-b group-data-[collapsible=icon]:h-12 h-14 flex items-center justify-center dark:bg-gray-950">
                <h1 className="text-xl group-data-[collapsible=icon]:hidden">
                    Inventory
                </h1>
                <Store className="group-data-[collapsible=icon]:inline-flex hidden size-5" />
            </SidebarHeader>
            <SidebarContent className="dark:bg-gray-950 scrollbar-hide">
                <SideStat url={url} setOpenMobile={setOpenMobile}/>
                <SideMaster url={url} setOpenMobile={setOpenMobile}/>
                <SideTransaction url={url} setOpenMobile={setOpenMobile}/>
                <SideStock url={url} setOpenMobile={setOpenMobile}/>
                <SideReport url={url} setOpenMobile={setOpenMobile}/>
                <SideUserManagement url={url} setOpenMobile={setOpenMobile}/>
            </SidebarContent>
            <SidebarFooter className="border-t dark:bg-gray-950">
                <SideProfile />
            </SidebarFooter>
            <SidebarRail />
        </Sidebar>
    );
}