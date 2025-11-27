import { Box, NotebookPen, Package, ReceiptText, ShoppingBag, Tags } from "lucide-react";
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

type sideTransactionProps = {
    url : string;
    setOpenMobile : (open : boolean) => void
}
export function SideTransaction({ url, setOpenMobile } : sideTransactionProps) {
    return (
        <SidebarGroup>
            {(hasAnyPermission(['sales-data']) || hasAnyPermission(['orders-data'])) && (
                <SidebarGroupLabel>Transaksi</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {hasAnyPermission(['sales-data']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Penjualan"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <ReceiptText/>
                                    <span>Penjualan</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['orders-data']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Pembelian"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <ShoppingBag/>
                                    <span>Pembelian</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}