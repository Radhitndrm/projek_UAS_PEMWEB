import React from "react";
import AppLayout from "@/Layouts/app-layout";
import { Head, Link, usePage, useForm } from "@inertiajs/react";
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import hasAnyPermission from "@/utils/has-permissions";
import {
    Table,
    TableCard,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableEmpty,
    TableFilter,
    TableCell,
} from "@/components/ui/table";
import { ActionButton } from "@/components/action-button";
import { PageProps } from "@/types";
import { ModalDelete } from "@/components/modal-delete";
import PagePagination from "@/components/page-pagination";
import { Order, OrderLink } from "@/types/order";
import { Badge } from "@/components/ui/badge";
import { Supplier } from "@/types/supplier";

interface IndexProps extends PageProps {
    orders: {
        data: Order[];
        links: OrderLink[];
        current_page: number;
        per_page: number;
    };
    currentPage: number;
    perPage: number;
    suppliers: Supplier[];
}

export default function Index() {
    const { orders, suppliers, currentPage, perPage } =
        usePage<IndexProps>().props;

    const [modalDelete, setModalDelete] = React.useState(false);
    const { data, setData } = useForm({
        id: 0,
    });

    const handleModalDelete = (order: Order) => {
        setModalDelete(true);
        setData((preveData) => ({
            ...preveData,
            id: order.id,
        }));
    };

    return (
        <>
            <Head title="Pembelian" />
            <div className="w-full">
                <Header
                    title="Pembelian"
                    subtitle="Halaman ini digunakan untuk mengelola data pembelian"
                >
                    {hasAnyPermission(["orders-create"]) && (
                        <Button asChild variant="outline">
                            <Link href={route("apps.orders.create")}>
                                <PlusCircle className="size-4" />{" "}
                                <span className="hidden sm:inline-flex">
                                    Tambah Data Pembelian
                                </span>
                            </Link>
                        </Button>
                    )}
                </Header>
                <div className="p-6">
                    <TableFilter
                        withFilterPage
                        withFilterSupplier
                        optionsSupplier={suppliers}
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route("apps.orders.index")}
                        placeholder="Cari data pembelian berdasarkan nomor faktur"
                    />
                    <TableCard className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">
                                        No
                                    </TableHead>
                                    <TableHead>Nomor Faktur</TableHead>
                                    <TableHead>Tanggal Pembelian</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead className="text-center">
                                        Status
                                    </TableHead>
                                    <TableHead className="w-[10px]">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orders.data.length === 0 ? (
                                    <TableEmpty
                                        colSpan={7}
                                        message="Data pembelian"
                                    />
                                ) : (
                                    orders.data.map((order, index) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="text-center">
                                                {++index +
                                                    +(orders.current_page - 1) *
                                                        orders.per_page}
                                            </TableCell>
                                            <TableCell>
                                                {order.order_code}
                                            </TableCell>
                                            <TableCell>
                                                {order.order_date}
                                            </TableCell>
                                            <TableCell>
                                                {order.supplier.name}
                                            </TableCell>
                                            <TableCell className="text-right">
                                                <sup>Rp</sup>{" "}
                                                {order.total_amount}
                                            </TableCell>
                                            <TableCell className="capitalize text-center">
                                                <Badge
                                                    variant={
                                                        order.status ==
                                                            "pending" ||
                                                        order.status == "cancel"
                                                            ? "destructive"
                                                            : "default"
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(hasAnyPermission([
                                                    "orders-show",
                                                ]) ||
                                                    hasAnyPermission([
                                                        "orders-edit",
                                                    ]) ||
                                                    hasAnyPermission([
                                                        "orders-delete",
                                                    ])) && (
                                                    <ActionButton
                                                        permissionPrefix="orders"
                                                        withDetail
                                                        actionDelete={() =>
                                                            handleModalDelete(
                                                                order
                                                            )
                                                        }
                                                        actionEditHref={route(
                                                            "apps.orders.edit",
                                                            order.id
                                                        )}
                                                        actionDetailHref={route(
                                                            "apps.orders.show",
                                                            order.id
                                                        )}
                                                        withDelete={
                                                            order.status ==
                                                                "success" ||
                                                            order.status ==
                                                                "cancel"
                                                                ? false
                                                                : true
                                                        }
                                                        withEdit={
                                                            order.status ==
                                                                "success" ||
                                                            order.status ==
                                                                "cancel"
                                                                ? false
                                                                : true
                                                        }
                                                    />
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete
                        open={modalDelete}
                        onOpenChange={setModalDelete}
                        url={route("apps.orders.destroy", data.id)}
                    />
                    <PagePagination data={orders} />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
