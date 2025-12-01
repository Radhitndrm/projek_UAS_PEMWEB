import React from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { usePage, Link } from "@inertiajs/react";
export function AppNavbar() {
    // destructuring the usePage hook from Inertia
    const { url } = usePage();

    const BreadcrumbItems = [
        {
            name: "Stats",
            isActive: url === "/apps/dashboard",
            subItems: [
                {
                    name: "Dashboard",
                    isActive: url === "/apps/dashboard",
                    href: route("apps.dashboard"),
                },
            ],
        },
        {
            name: "Master Data",
            isActive:
                url.startsWith("/apps/units") ||
                url.startsWith("/apps/categories") ||
                url.startsWith("/apps/suppliers") ||
                url.startsWith("/apps/products"),
            subItems: [
                {
                    name: "Satuan",
                    isActive: url.startsWith("/apps/units"),
                    href: route("apps.units.index"),
                },
                {
                    name: "Kategori",
                    isActive: url.startsWith("/apps/categories"),
                    href: route("apps.categories.index"),
                },
                {
                    name: "Supplier",
                    isActive: url.startsWith("/apps/suppliers"),
                    href: route("apps.suppliers.index"),
                },
                {
                    name: "Produk",
                    isActive: url.startsWith("/apps/products"),
                    href: route("apps.products.index"),
                },
            ],
        },
        {
            name: "Transaksi",
            isActive:
                url.startsWith("/apps/orders") || url.startsWith("/apps/sales"),
            subItems: [
                {
                    name: "Pembelian",
                    isActive: url.startsWith("/apps/orders"),
                    href: route("apps.orders.index"),
                },
                {
                    name: "Penjualan",
                    isActive: url.startsWith("/apps/sales"),
                    href: route("apps.sales.index"),
                },
            ],
        },
        {
            name: "Manajemen Stok",
            isActive:
                url.startsWith("/apps/stocks/stock-initials") ||
                url.startsWith("/apps/order-receives"),
            subItems: [
                {
                    name: "Stok Awal",
                    isActive: url.startsWith("/apps/stocks/stock-initials"),
                    href: route("apps.stocks.stock-initials"),
                },
                {
                    name: "Penerimaan Pembelian",
                    isActive: url.startsWith("/apps/order-receives"),
                    href: route("apps.order-receives.index"),
                },
            ],
        },
        {
            name: "Manajemen Pengguna",
            isActive:
                url.startsWith("/apps/permissions") ||
                url.startsWith("/apps/roles") ||
                url.startsWith("/apps/users"),
            subItems: [
                {
                    name: "Hak Akses",
                    isActive: url.startsWith("/apps/permissions"),
                    href: route("apps.permissions.index"),
                },
                {
                    name: "Akses Group",
                    isActive: url.startsWith("/apps/roles"),
                    href: route("apps.roles.index"),
                },
                {
                    name: "Pengguna",
                    isActive: url.startsWith("/apps/users"),
                    href: route("apps.users.index"),
                },
            ],
        },
        {
            name: "Laporan",
            isActive:
                url.startsWith("/apps/reports/card-stocks") ||
                url.startsWith("/apps/reports/stocks") ||
                url.startsWith("/apps/reports/orders") ||
                url.startsWith("/apps/reports/pending-order-receives") ||
                url.startsWith("/apps/reports/sales") ||
                url.startsWith("/apps/reports/best-selling-products"),
            subItems: [
                {
                    name: "Kartu Stok",
                    isActive: url.startsWith("/apps/reports/card-stocks"),
                    href: route("apps.reports.card-stocks"),
                },
                {
                    name: "Sisa Stok",
                    isActive: url.startsWith("/apps/reports/stocks"),
                    href: route("apps.reports.stocks"),
                },
                {
                    name: "Pembelian",
                    isActive: url.startsWith("/apps/reports/orders"),
                    href: route("apps.reports.orders"),
                },
                {
                    name: "Penerimaan Belum Diterima",
                    isActive: url.startsWith(
                        "/apps/reports/pending-order-receives"
                    ),
                    href: route("apps.reports.pending-order-receives"),
                },
                {
                    name: "Penjualan",
                    isActive: url.startsWith("/apps/reports/sales"),
                    href: route("apps.reports.sales"),
                },
                {
                    name: "Produk Terlaris",
                    isActive: url.startsWith(
                        "/apps/reports/best-selling-products"
                    ),
                    href: route("apps.reports.best-selling-products"),
                },
            ],
        },
    ];

    return (
        <div className="flex items-center gap-2 px-4 w-full">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
                <BreadcrumbList>
                    {BreadcrumbItems.map(
                        (item, index) =>
                            item.isActive &&
                            item.subItems.find(
                                (subItem) => subItem.isActive
                            ) && (
                                <React.Fragment key={index}>
                                    <BreadcrumbItem>
                                        <BreadcrumbLink asChild>
                                            <Link href="#">{item.name}</Link>
                                        </BreadcrumbLink>
                                    </BreadcrumbItem>
                                    <BreadcrumbSeparator />
                                    {item.subItems
                                        .filter((subItem) => subItem.isActive)
                                        .map((subItem, subIndex) => (
                                            <BreadcrumbItem key={subIndex}>
                                                <BreadcrumbLink asChild>
                                                    <Link href={subItem.href}>
                                                        {subItem.name}
                                                    </Link>
                                                </BreadcrumbLink>
                                            </BreadcrumbItem>
                                        ))}
                                </React.Fragment>
                            )
                    )}
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    );
}
