import { Box, NotebookPen, Package, Tags } from "lucide-react";
import {
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from "@/components/ui/sidebar";
import { Link } from "@inertiajs/react";
import hasAnyPermission from "@/utils/has-permissions";

type sideMasterProps = {
    url : string;
    setOpenMobile : (open: boolean) => void
}

export function SideMaster({ url, setOpenMobile } :  sideMasterProps) {
    return (
        <SidebarGroup>
            {(hasAnyPermission(['units-data']) || hasAnyPermission(['categories-data']) || hasAnyPermission(['suppliers-data']) || hasAnyPermission(['products-data'])) && (
                <SidebarGroupLabel>Master Data</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {hasAnyPermission(['units-data']) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Satuan"} isActive={url.startsWith('/apps/units')}>
                                <Link href={route('apps.units.index')} onClick={() => setOpenMobile(false)}>
                                    <Box/>
                                    <span>Satuan</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(['categories-data']) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Kategori"} isActive={url.startsWith('/apps/categories')}>
                                <Link href={route('apps.categories.index')} onClick={() => setOpenMobile(false)}>
                                    <Tags/>
                                    <span>Kategori</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(['suppliers-data']) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Supplier"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <NotebookPen/>
                                    <span>Supplier</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(['products-data']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Produk"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <Package/>
                                    <span>Produk</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}