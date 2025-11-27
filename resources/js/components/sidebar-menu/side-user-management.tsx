import { Users2, UserCog, UserRoundCheck } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import hasAnyPermission from "@/utils/has-permissions";

type sideUserManagementProps = {
    url: string;
    setOpenMobile: (open: boolean) => void;
};

export function SideUserManagement({
    url,
    setOpenMobile,
}: sideUserManagementProps) {
    return (
        <SidebarGroup>
            {(hasAnyPermission(["permissions-data"]) ||
                hasAnyPermission(["users-data"]) ||
                hasAnyPermission(["roles-data"])) && (
                <SidebarGroupLabel>Manajemen Pengguna</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {hasAnyPermission(["roles-data"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Akses Group"}>
                                <Link
                                    href=""
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <UserCog />
                                    <span>Akses Group</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["permissions-data"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Hak Akses"}
                                isActive={url.startsWith("/apps/permissions")}
                            >
                                <Link
                                    href={route("apps.permissions.index")}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <UserRoundCheck />
                                    <span>Hak Akses</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["users-data"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Pengguna"}>
                                <Link
                                    href=""
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <Users2 />
                                    <span>Pengguna</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
