import React from "react";
import AppLayout from "@/Layouts/app-layout";
import { Head, usePage, useForm } from "@inertiajs/react";
import { Header } from "@/components/header";
import { Card, CardContent } from "@/components/ui/card";
import { PageProps } from "@/types";
import { Order } from "@/types/order";
import {
    Table,
    TableBody,
    TableHead,
    TableHeader,
    TableRow,
    TableCell,
    TableCard,
} from "@/components/ui/table";
import {
    Check,
    X,
    Phone,
    Mail,
    Calendar,
    Tag,
    NotebookPen,
    Truck,
    Building,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import hasAnyPermission from "@/utils/has-permissions";

interface ShowProps extends PageProps {
    order: Order;
}

export default function Show() {
    const { toast } = useToast();

    const { order } = usePage<ShowProps>().props;

    const { post, processing } = useForm({
        _method: "put",
    });

    const updateStatus = (status: string) => {
        post(route("apps.orders.update-status", [order.id, status]), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Data berhasil disimpan!",
                });
            },
        });
    };

    return (
        <>
            <Head title="Detail Pembelian" />
            <div className="w-full">
                <Header
                    title="Detail Pembelian"
                    subtitle="Halaman ini digunakan untuk melihat detail pembelian"
                />
                <div className="p-6">
                    <Card className="shadow-lg">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">
                                        Faktur Pembelian
                                    </h2>
                                    <p className="text-sm text-muted-foreground">
                                        Detail transaksi pembelian barang
                                    </p>
                                </div>
                                <div className="text-end">
                                    <div className="bg-primary/5 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">
                                            Nomor Faktur
                                        </p>
                                        <p className="text-2xl font-bold tracking-tight text-primary">
                                            #{order.order_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-8" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Informasi Supplier
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <NotebookPen className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Kode Supplier
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.supplier.code ?? "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Nama Supplier
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.supplier.name ?? "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Email Supplier
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.supplier.email ??
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Telp Supplier
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.supplier.telp ?? "-"}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Alamat Supplier
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.supplier.address ??
                                                        "-"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">
                                        Detail Pembelian
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Tanggal Pembelian
                                                </p>
                                                <p className="text-sm text-muted-foreground">
                                                    {order.order_date}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="size-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">
                                                    Status Pembelian
                                                </p>
                                                <Badge
                                                    variant={
                                                        order.status ==
                                                        "default"
                                                            ? "default"
                                                            : "destructive"
                                                    }
                                                >
                                                    {order.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-8" />
                            <TableCard>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 divide-muted/50">
                                            <TableHead className="w-[50px] text-center">
                                                No.
                                            </TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Variant</TableHead>
                                            <TableHead className="text-center">
                                                Kuantitas
                                            </TableHead>
                                            <TableHead className="text-start">
                                                Harga/Satuan
                                            </TableHead>
                                            <TableHead className="text-start">
                                                Total
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {order.order_details.map(
                                            (item, index) => (
                                                <TableRow
                                                    key={index}
                                                    className="hover:bg-transparent"
                                                >
                                                    <TableCell className="text-center">
                                                        {index + 1}
                                                    </TableCell>
                                                    <TableCell>
                                                        {
                                                            item.product_unit
                                                                .product.name
                                                        }
                                                    </TableCell>
                                                    <TableCell>
                                                        {item.product_unit.name}{" "}
                                                        {
                                                            item.product_unit
                                                                .unit.name
                                                        }
                                                    </TableCell>
                                                    <TableCell className="text-center">
                                                        {item.quantity}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <sup>Rp</sup>{" "}
                                                        {item.price}
                                                    </TableCell>
                                                    <TableCell className="text-right">
                                                        <sup>Rp</sup>{" "}
                                                        {item.total_price}
                                                    </TableCell>
                                                </TableRow>
                                            )
                                        )}
                                        <TableRow className="bg-muted/50 divide-muted/50">
                                            <TableCell
                                                colSpan={5}
                                                className="text-right font-medium"
                                            >
                                                Total Harga
                                            </TableCell>
                                            <TableCell className="text-right font-medium">
                                                <sup>Rp</sup>{" "}
                                                {order.total_amount}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCard>
                            {hasAnyPermission(["orders-verification"]) && (
                                <div className="mt-8 flex items-center justify-end gap-4">
                                    <Button
                                        variant="destructive"
                                        type="button"
                                        onClick={() => updateStatus("cancel")}
                                        disabled={
                                            processing ||
                                            order.status == "cancel" ||
                                            order.status == "success"
                                        }
                                    >
                                        <X /> Tolak
                                    </Button>
                                    <Button
                                        variant="default"
                                        type="button"
                                        onClick={() => updateStatus("success")}
                                        disabled={
                                            processing ||
                                            order.status == "cancel" ||
                                            order.status == "success"
                                        }
                                    >
                                        <Check /> Setujui
                                    </Button>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />;
