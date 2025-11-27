import React from "react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCard,
    TableCell,
    TableEmpty,
    TableFilter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { useToast } from "@/hooks/use-toast";
import { AppLayout } from "@/Layouts/app-layout";
import { PageProps } from "@/types";
import { Head, useForm, usePage } from "@inertiajs/react";
import { LoaderCircle, PlusCircle, Save, X } from "lucide-react";
import { ModalDelete } from "@/components/modal-delete";
import { ActionButton } from "@/components/action-button";
import { Header } from "@/components/header";
import { Permission, PermissionLink } from "@/types/permission";
import hasAnyPermission from "@/utils/has-permissions";
import PagePagination from "@/components/page-pagination";

interface IndexProps extends PageProps {
    permissions: {
        data: Permission[];
        links: PermissionLink[];
        current_page: number;
        per_page: number;
    };
    currentPage: number;
    perPage: number;
}

export default function Index() {
    const { toast } = useToast();
    const { permissions, currentPage, perPage } = usePage<IndexProps>().props;
    const [deleteModal, setDeleteModal] = React.useState(false);
    const { data, setData, post, processing, errors, reset, transform } =
        useForm({
            id: 0,
            name: "",
            open: false as boolean,
            isUpdate: false as boolean,
        });

    transform((data) => ({
        ...data,
        _method: data.isUpdate ? "put" : "post",
    }));

    const handleModalUpdate = (permission: Permission) => {
        setData((prevData) => ({
            ...prevData,
            id: permission.id,
            name: permission.name,
            open: true,
            isUpdate: true,
        }));
    };

    const handleModalDelete = (permission: Permission) => {
        setDeleteModal(true);
        setData((prevData) => ({
            ...prevData,
            id: permission.id,
        }));
    };

    const storeData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (data.isUpdate)
            post(route("apps.permissions.update", data.id), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        title: "Success",
                        description: "Data berhasil disimpan",
                    }),
                        reset();
                },
            });
        else
            post(route("apps.permissions.store"), {
                onSuccess: () => {
                    toast({
                        variant: "success",
                        title: "Success",
                        description: "Data berhasil disimpan",
                    }),
                        reset();
                },
            });
    };

    return (
        <>
            <Head title="Hak Akses" />
            <div className="w-full">
                <Header
                    title="Hak Akses"
                    subtitle="Halaman ini digunakan untuk mengelola data hak akses pengguna"
                >
                    <Dialog
                        open={data.open}
                        onOpenChange={(open) =>
                            setData({
                                ...data,
                                open: open,
                                name: "",
                                id: 0,
                                isUpdate: false,
                            })
                        }
                    >
                        {hasAnyPermission(["permissions-create"]) && (
                            <DialogTrigger className="px-4 py-2 flex items-center gap-2 rounded-lg text-sm font-semibold text-gray-700 border hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-900 focus:outline-none">
                                <PlusCircle className="size-4" />{" "}
                                <span className="hidden sm:inline-flex">
                                    Tambah Hak Akses
                                </span>
                            </DialogTrigger>
                        )}
                        <DialogContent className="p-0">
                            <DialogHeader className="p-4 border-b">
                                <DialogTitle>
                                    {data.isUpdate ? "Ubah" : "Tambah"} Hak
                                    Akses
                                </DialogTitle>
                                <DialogDescription className="text-sm">
                                    Form ini digunakan untuk{" "}
                                    {data.isUpdate
                                        ? "mengubah data hak akses"
                                        : "menambahkan data hak akses"}
                                </DialogDescription>
                            </DialogHeader>
                            <form onSubmit={storeData}>
                                <div className="p-4">
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Hak Akses</Label>
                                        <Input
                                            type="text"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData("name", e.target.value)
                                            }
                                            placeholder="Masukkan nama hak akses"
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.name}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button
                                            variant="danger"
                                            type="button"
                                            onClick={() => reset()}
                                        >
                                            <X /> Cancel
                                        </Button>
                                        <Button
                                            variant="default"
                                            type="submit"
                                            disabled={processing}
                                        >
                                            {processing ? (
                                                <LoaderCircle className="animate-spin" />
                                            ) : (
                                                <Save />
                                            )}{" "}
                                            Simpan Data
                                        </Button>
                                    </div>
                                </div>
                            </form>
                        </DialogContent>
                    </Dialog>
                </Header>
                <div className="p-6">
                    <div className="mb-5">
                        <TableFilter
                            withFilterPage
                            currentPage={currentPage}
                            perPage={perPage}
                            url={route("apps.permissions.index")}
                            placeholder="Cari data hak akses berdasarkan nama hak akses"
                        />
                    </div>
                    <TableCard>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">
                                        No
                                    </TableHead>
                                    <TableHead>Nama Hak Akses</TableHead>
                                    <TableHead className="w-[10px] text-center">
                                        Aksi
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {permissions.data.length === 0 ? (
                                    <TableEmpty
                                        colSpan={3}
                                        message="data hak akses"
                                    />
                                ) : (
                                    permissions.data.map(
                                        (permission, index) => (
                                            <TableRow key={permission.id}>
                                                <TableCell className="text-center">
                                                    {++index +
                                                        (permissions.current_page -
                                                            1) *
                                                            permissions.per_page}
                                                </TableCell>
                                                <TableCell>
                                                    {permission.name}
                                                </TableCell>
                                                <TableCell className="flex items-center justify-center gap-2">
                                                    {(hasAnyPermission([
                                                        "permissions-update",
                                                    ]) ||
                                                        hasAnyPermission([
                                                            "permissions-delete",
                                                        ])) && (
                                                        <ActionButton
                                                            permissionPrefix="permissions"
                                                            isModal={true}
                                                            actionEdit={() =>
                                                                handleModalUpdate(
                                                                    permission
                                                                )
                                                            }
                                                            actionDelete={() =>
                                                                handleModalDelete(
                                                                    permission
                                                                )
                                                            }
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        )
                                    )
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete
                        open={deleteModal}
                        onOpenChange={setDeleteModal}
                        url={route("apps.permissions.destroy", data.id)}
                    />
                    <PagePagination data={permissions} />
                </div>
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
