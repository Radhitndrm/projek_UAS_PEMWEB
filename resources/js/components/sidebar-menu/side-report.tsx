import {
    FileBox,
    FileChartColumn,
    FileChartPie,
    FileSliders,
    FileText,
    FileX2,
    Receipt,
    ReceiptText,
} from "lucide-react";
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
export function SideReport({
    url,
    setOpenMobile,
}: {
    url: string;
    setOpenMobile: any;
}) {
    return (
        <SidebarGroup>
            {(hasAnyPermission(["report-card-stocks"]) ||
                hasAnyPermission(["report-stocks"]) ||
                hasAnyPermission(["report-orders"]) ||
                hasAnyPermission(["report-pending-order-receives"]) ||
                hasAnyPermission(["report-sales"]) ||
                hasAnyPermission(["report-best-selling-products"])) && (
                <SidebarGroupLabel>Laporan</SidebarGroupLabel>
            )}
            <SidebarGroupContent>
                <SidebarMenu>
                    {hasAnyPermission(["report-card-stocks"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Kartu Stok"}
                                isActive={url.startsWith(
                                    "/apps/reports/card-stocks"
                                )}
                            >
                                <Link
                                    href={route("apps.reports.card-stocks")}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileChartColumn />
                                    <span>Kartu Stok</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["report-stocks"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Sisa Stok"}
                                isActive={url.startsWith(
                                    "/apps/reports/stocks"
                                )}
                            >
                                <Link
                                    href={route("apps.reports.stocks")}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileChartPie />
                                    <span>Sisa Stok</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["report-orders"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Pembelian"}
                                isActive={url.startsWith(
                                    "/apps/reports/orders"
                                )}
                            >
                                <Link
                                    href={route("apps.reports.orders")}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileSliders />
                                    <span>Pembelian</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["report-pending-order-receives"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Penerimaan belum diterima"}
                                isActive={url.startsWith(
                                    "/apps/reports/pending-order-receives"
                                )}
                            >
                                <Link
                                    href={route(
                                        "apps.reports.pending-order-receives"
                                    )}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileX2 />
                                    <span>Penerimaan Belum Diterima</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["report-sales"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Penjualan"}
                                isActive={url.startsWith("/apps/reports/sales")}
                            >
                                <Link
                                    href={route("apps.reports.sales")}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileText />
                                    <span>Penjualan</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                    {hasAnyPermission(["report-best-selling-products"]) && (
                        <SidebarMenuItem>
                            <SidebarMenuButton
                                asChild
                                tooltip={"Laporan Produk Terlaris"}
                                isActive={url.startsWith(
                                    "/apps/reports/best-selling-products"
                                )}
                            >
                                <Link
                                    href={route(
                                        "apps.reports.best-selling-products"
                                    )}
                                    onClick={() => setOpenMobile(false)}
                                >
                                    <FileBox />
                                    <span>Produk Terlaris</span>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    )}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
