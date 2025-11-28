import React from "react";
import AppLayout from "@/Layouts/app-layout";
import { Header } from "@/components/header";
import {
    TableFilter,
    TableCard,
    Table,
    TableHead,
    TableHeader,
    TableRow,
    TableBody,
    TableCell,
    TableEmpty,
} from "@/components/ui/table";
import { PageProps } from "@/types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ModalDelete } from "@/components/modal-delete";
import { Head, useForm, usePage, Link } from "@inertiajs/react";
import { PlusCircle } from "lucide-react";
import hasAnyPermission from "@/utils/has-permissions";
import { ActionButton } from "@/components/action-button";
import PagePagination from "@/components/page-pagination";
import { Role, RoleLink } from "@/types/role";

interface IndexProps extends PageProps {
    roles: {
        data: Role[];
        links: RoleLink[];
        current_page: number;
        per_page: number;
    };
    perPage: number;
    currentPage: number;
}

export default function Index() {
    const { roles, currentPage, perPage } = usePage<IndexProps>().props;

    const [deleteModal, setDeleteModal] = React.useState(false);

    const { data, setData } = useForm({
        id: 0,
    });

    const handleModalDelete = (role: Role) => {
        setDeleteModal(true);
        setData((prevData) => ({
            ...prevData,
            id: role.id,
        }));
    };

    return (
        <>
            <Head title="Akses Group" />
            <Header
                title="Akses Group"
                subtitle="Halaman ini digunakan untuk mengelola data hak akses group pengguna"
            >
                {hasAnyPermission(["roles-create"]) && (
                    <Button asChild variant="outline">
                        <Link href={route("apps.roles.create")}>
                            <PlusCircle className="size-4" />{" "}
                            <span className="hidden sm:inline-flex">
                                Tambah Akses Group
                            </span>
                        </Link>
                    </Button>
                )}
            </Header>
            <div className="p-6">
                <div className="mb-5">
                    <TableFilter
                        withFilterPage={true}
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route("apps.roles.index")}
                        placeholder="Cari data akses group berdasarkan nama akses group"
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
                                <TableHead>Hak Akses</TableHead>
                                <TableHead className="w-[10px] text-center">
                                    Aksi
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {roles.data.length === 0 ? (
                                <TableEmpty
                                    colSpan={4}
                                    message="data akses group"
                                />
                            ) : (
                                roles.data.map((role, index) => (
                                    <TableRow key={index}>
                                        <TableCell className="text-center">
                                            {++index +
                                                (roles.current_page - 1) *
                                                    roles.per_page}
                                        </TableCell>
                                        <TableCell>{role.name}</TableCell>
                                        <TableCell>
                                            {role.name == "super-admin" ? (
                                                <Badge variant="destructive">
                                                    Semua Hak Akses
                                                </Badge>
                                            ) : (
                                                <div className="flex flex-wrap gap-1">
                                                    {role.permissions.map(
                                                        (permission, i) => (
                                                            <Badge
                                                                variant="destructive"
                                                                key={i}
                                                            >
                                                                {
                                                                    permission.name
                                                                }
                                                            </Badge>
                                                        )
                                                    )}
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-center">
                                                {(hasAnyPermission([
                                                    "roles-update",
                                                ]) ||
                                                    hasAnyPermission([
                                                        "roles-delete",
                                                    ])) && (
                                                    <ActionButton
                                                        permissionPrefix="roles"
                                                        actionEditHref={route(
                                                            "apps.roles.edit",
                                                            role.id
                                                        )}
                                                        actionDelete={() =>
                                                            handleModalDelete(
                                                                role
                                                            )
                                                        }
                                                    />
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableCard>
                <ModalDelete
                    open={deleteModal}
                    onOpenChange={setDeleteModal}
                    url={route("apps.roles.destroy", data.id)}
                />
                <PagePagination data={roles} />
            </div>
        </>
    );
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />;
