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
import { Category, CategoryLink } from "@/types/category";
import { PageProps } from "@/types";
import { ModalDelete } from "@/components/modal-delete";
import PagePagination from "@/components/page-pagination";

interface IndexProps extends PageProps {
    categories: {
        data: Category[];
        links: CategoryLink[];
        current_page: number;
        per_page: number;
    };
    currentPage: number;
    perPage: number;
}

export default function Index() {
    const { categories, currentPage, perPage } = usePage<IndexProps>().props;

    const [modalDelete, setModalDelete] = React.useState(false);
    const { data, setData } = useForm({
        id: 0,
    });

    const handleModalDelete = (category: Category) => {
        setModalDelete(true);
        setData((preveData) => ({
            ...preveData,
            id: category.id,
        }));
    };

    return (
        <>
            <Head title="Kategori" />
            <div className="w-full">
                <Header
                    title="Kategori"
                    subtitle="Halaman ini digunakan untuk mengelola data kategori"
                >
                    {hasAnyPermission(["categories-create"]) && (
                        <Button asChild variant="primary">
                            <Link href={route("apps.categories.create")}>
                                <PlusCircle className="size-4" />{" "}
                                <span className="hidden sm:inline-flex">
                                    Tambah Data Kategori
                                </span>
                            </Link>
                        </Button>
                    )}
                </Header>
                <div className="p-6">
                    <TableFilter
                        withFilterPage
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route("apps.categories.index")}
                        placeholder="Cari data kategori berdasarkan nama kategori"
                    />
                    <TableCard className="mt-6">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">
                                        No
                                    </TableHead>
                                    <TableHead>Nama Kategori</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead className="w-[10px]">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {categories.data.length === 0 ? (
                                    <TableEmpty
                                        colSpan={4}
                                        message="Data kategori"
                                    />
                                ) : (
                                    categories.data.map((category, index) => (
                                        <TableRow key={category.id}>
                                            <TableCell className="text-center">
                                                {++index +
                                                    +(
                                                        categories.current_page -
                                                        1
                                                    ) *
                                                        categories.per_page}
                                            </TableCell>
                                            <TableCell>
                                                {category.name}
                                            </TableCell>
                                            <TableCell>
                                                {category.description}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(hasAnyPermission([
                                                    "categories-update",
                                                ]) ||
                                                    hasAnyPermission([
                                                        "categories-delete",
                                                    ])) && (
                                                    <ActionButton
                                                        permissionPrefix="categories"
                                                        actionDelete={() =>
                                                            handleModalDelete(
                                                                category
                                                            )
                                                        }
                                                        actionEditHref={route(
                                                            "apps.categories.edit",
                                                            category.id
                                                        )}
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
                        url={route("apps.categories.destroy", data.id)}
                    />
                    <PagePagination data={categories} />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
