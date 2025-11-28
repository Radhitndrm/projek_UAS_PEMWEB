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
            isActive: url === "",
            subItems: [
                {
                    name: "Dashboard",
                    isActive: url === "",
                    href: "",
                },
            ],
        },
        {
            name: "Master Data",
            isActive: "",
            subItems: [
                {
                    name: "Satuan",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Kategori",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Supplier",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Produk",
                    isActive: "",
                    href: "",
                },
            ],
        },
        {
            name: "Transaksi",
            isActive: "",
            subItems: [
                {
                    name: "Pembelian",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Penjualan",
                    isActive: "",
                    href: "",
                },
            ],
        },
        {
            name: "Manajemen Stok",
            isActive: "",
            subItems: [
                {
                    name: "Stok Awal",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Penerimaan Pembelian",
                    isActive: "",
                    href: "",
                },
            ],
        },
        {
            name: "Manajemen Pengguna",
            isActive: url.startsWith('/apps/permissions') || url.startsWith('/apps/roles') || url.startsWith('/apps/users'),
            subItems: [
                {
                    name: "Hak Akses",
                    isActive: url.startsWith('/apps/permissions'),
                    href: "",
                },
                {
                    name: "Akses Group",
                    isActive: url.startsWith("/apps/roles"),
                    href: route("apps.roles.index"),
                },
                {
                    name: "Pengguna",
                    isActive: url.startsWith('apps/users'),
                    href: route('apps.users.index'),
                },
            ],
        },
        {
            name: "Laporan",
            isActive: "",
            subItems: [
                {
                    name: "Kartu Stok",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Sisa Stok",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Pembelian",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Pembelian Belum Diterima",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Penjualan",
                    isActive: "",
                    href: "",
                },
                {
                    name: "Produk Terlaris",
                    isActive: "",
                    href: "",
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
