import { FileBox, FileChartColumn, FileChartPie, FileSliders, FileText, FileX2 } from "lucide-react";
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

type sideReportProps = {
    url : string;
    setOpenMobile : (open: boolean) => void
}

export function SideReport({ url, setOpenMobile } : sideReportProps) {
    return (
        <SidebarGroup>
            {(
                hasAnyPermission(['report-card-stocks']) || hasAnyPermission(['report-stocks']) || hasAnyPermission(['report-orders']) ||
                hasAnyPermission(['report-pending-order-receives']) || hasAnyPermission(['report-sales']) || hasAnyPermission(['report-best-selling-products'])
            ) && (
                <SidebarGroupLabel>Laporan</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {hasAnyPermission(['report-card-stocks']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Kartu Stok"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileChartColumn/>
                                    <span>Kartu Stok</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['report-stocks']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Sisa Stok"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileChartPie/>
                                    <span>Sisa Stok</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['report-orders']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Pembelian"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileSliders/>
                                    <span>Pembelian</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['report-pending-order-receives']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Pembelian belum diterima"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileX2/>
                                    <span>Pembelian Belum Diterima</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['report-sales']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Penjualan"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileText/>
                                    <span>Penjualan</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                    {hasAnyPermission(['report-best-selling-products']) &&
                        <SidebarMenuItem>
                            <SidebarMenuButton asChild tooltip={"Laporan Produk Terlaris"}>
                                <Link href='' onClick={() => setOpenMobile(false)}>
                                    <FileBox/>
                                    <span>Produk Terlaris</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    }
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}