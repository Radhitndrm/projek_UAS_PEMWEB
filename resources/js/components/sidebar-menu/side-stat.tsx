import { ChartNoAxesCombined } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";

type sideStatProps = {
    url: string
    setOpenMobile: (open: boolean) => void
}

export function SideStat({ url, setOpenMobile } : sideStatProps) {
    return (
        <SidebarGroup>
            <SidebarGroupLabel>Stats</SidebarGroupLabel>
            <SidebarGroupContent>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton asChild tooltip={"Dashboard"}>
                            <Link href='' onClick={() => setOpenMobile(false)}>
                                <ChartNoAxesCombined/>
                                <span>Dashboard</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
