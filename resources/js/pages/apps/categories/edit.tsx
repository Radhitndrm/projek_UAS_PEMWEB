import React from "react";
import AppLayout from "@/Layouts/app-layout";
import { Head, useForm, Link, usePage } from "@inertiajs/react";
import { Header } from "@/components/header";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Check, LoaderCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Category } from "@/types/category";
import { PageProps } from "@/types";

interface EditProps extends PageProps {
    category: Category;
}

export default function Edit() {
    const { toast } = useToast();

    const { category } = usePage<EditProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        name: category.name,
        description: category.description,
        _method: "put",
    });

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route("apps.categories.update", category.id), {
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
            <Head title="Ubah Kategori" />
            <div className="w-full">
                <Header
                    title="Ubah Data Kategori"
                    subtitle="Halaman ini digunakan untuk mengubah data kategori"
                />
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Kategori</CardTitle>
                            <CardDescription>
                                Form ini digunakan untuk mengubah data kategori
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full">
                                <form onSubmit={storeData}>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>
                                            Nama Kategori{" "}
                                            <span className="text-rose-500">
                                                *
                                            </span>
                                        </Label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Masukkan nama kategori"
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.name}
                                        </p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Deskripsi Kategori</Label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Masukkan deskripsi kategori"
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.description}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link
                                                href={route(
                                                    "apps.categories.index"
                                                )}
                                            >
                                                <ArrowLeft /> Kembali
                                            </Link>
                                        </Button>
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
                                </form>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    );
}

Edit.layout = (page: React.ReactNode) => <AppLayout children={page} />;
