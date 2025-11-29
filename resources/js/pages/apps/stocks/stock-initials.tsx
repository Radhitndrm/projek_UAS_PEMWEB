import { Head, useForm, usePage } from "@inertiajs/react";
import React, { useEffect } from "react";
import AppLayout from "@/Layouts/app-layout";
import { Header } from "@/components/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectValue,
    SelectContent,
    SelectItem,
    SelectTrigger,
} from "@/components/ui/select";
import { Combobox } from "@/components/ui/combobox";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Check, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { PageProps } from "@/types";
import { ProductUnit } from "@/types/product-unit";
import axios from "axios";
import { Product } from "@/types/product";

interface StockIntialProps extends PageProps {
    products: Product[];
}

export default function StockInitial() {
    const { toast } = useToast();

    const { products } = usePage<StockIntialProps>().props;

    const { data, setData, post, errors, reset, processing } = useForm({
        product: "",
        quantity: "",
        product_unit: "",
        price: "",
        units: [] as ProductUnit[],
    });

    const handleProductChange = async (product: string) => {
        try {
            const response = await axios.get(
                route("apps.products.get-product-units", product),
                {
                    params: {
                        initialStock: true,
                    },
                }
            );
            setData({ ...data, units: response.data.data });
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (data.product) {
            handleProductChange(data.product);
        }
    }, [data.product]);

    const storeData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("apps.stocks.store-initials"), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Data berhasil disimpan!",
                }),
                    reset();
            },
        });
    };

    return (
        <>
            <Head title="Stok Awal" />
            <div className="w-full">
                <Header
                    title="Stok Awal"
                    subtitle="Halaman ini digunakan untuk menambahkan stok awal produk"
                />
                <div className="p-6">
                    <form onSubmit={storeData}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tambah Stok Awal</CardTitle>
                                <CardDescription>
                                    Halaman ini digunakan untuk menambahkan stok
                                    awal produk
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                                    <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                        <Label>
                                            Pilih Produk{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Combobox
                                            options={products.map(
                                                (product) => ({
                                                    id: product.id.toString(),
                                                    name: product.name,
                                                })
                                            )}
                                            placeholder="Pilih Produk"
                                            value={data.product}
                                            setValue={(e) => {
                                                setData("product", e);
                                            }}
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.product}
                                        </p>
                                    </div>
                                    <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                        <Label>
                                            Pilih Variant{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Select
                                            value={data.product_unit}
                                            onValueChange={(e) =>
                                                setData("product_unit", e)
                                            }
                                            disabled={data.units.length === 0}
                                        >
                                            <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                                <SelectValue placeholder="Pilih Satuan Produk" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {data.units.map(
                                                    (unit, index) => (
                                                        <SelectItem
                                                            key={index}
                                                            value={unit.id.toString()}
                                                        >
                                                            {unit.name}{" "}
                                                            {unit.unit.name}
                                                        </SelectItem>
                                                    )
                                                )}
                                            </SelectContent>
                                        </Select>
                                        <p className="text-red-500 text-xs">
                                            {errors.product_unit}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex flex-col lg:flex-row gap-4 mb-4">
                                    <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                        <Label>
                                            Jumlah Stok{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="Masukan jumlah stok"
                                            value={data.quantity}
                                            onChange={(e) =>
                                                setData(
                                                    "quantity",
                                                    e.target.value
                                                )
                                            }
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.quantity}
                                        </p>
                                    </div>
                                    <div className="w-full lg:w-1/2 flex flex-col gap-2">
                                        <Label>
                                            Harga Beli Produk{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="number"
                                            placeholder="Masukan harga produk"
                                            value={data.price}
                                            onChange={(e) =>
                                                setData("price", e.target.value)
                                            }
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.price}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="default"
                                        type="submit"
                                        disabled={processing}
                                    >
                                        {processing ? (
                                            <LoaderCircle className="animate-spin" />
                                        ) : (
                                            <Check />
                                        )}{" "}
                                        Simpan Data
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    );
}

StockInitial.layout = (page: React.ReactNode) => <AppLayout children={page} />;
