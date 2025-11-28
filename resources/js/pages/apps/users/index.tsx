import React from "react";
import {
    TableCard,
    Table,
    TableBody,
    TableCell,
    TableFilter,
    TableHead,
    TableHeader,
    TableRow,
    TableEmpty,
} from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { PageProps } from "@/types";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { PlusCircle, UserCheck } from "lucide-react";
import { ModalDelete } from "@/components/modal-delete"
import { ActionButton } from "@/components/action-button";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Header } from "@/components/header";
import { User, UserLink } from "@/types";
import hasAnyPermission from "@/utils/has-permissions";
import PagePagination from "@/components/page-pagination";

interface IndexProps extends PageProps {
    users: {
        data: User[];
        links: UserLink[];
        current_page: number,
        per_page: number,
    };
    perPage: number,
    currentPage: number
}

export default function Index() {
    const { users, perPage, currentPage } = usePage<IndexProps>().props;
    const [deleteModal, setDeleteModal] = React.useState(false);
    const { data, setData } = useForm({
        id: 0,
    })

    const handleModalDelete = (user: User) => {
        setDeleteModal(true);
        setData(prevData => ({
            ...prevData,
            id: user.id,
        }))
    }

    return (
        <>
            <Head title="Pengguna" />
            <div className="w-full">
                <Header title="Pengguna" subtitle="Halaman ini digunakan untuk mengelola data pengguna">
                    {hasAnyPermission(['users-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.users.create')}>
                                <PlusCircle className="size-4" /> <span className="hidden sm:inline-flex">Tambah Data Pengguna</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className="p-6">
                    <div className="mb-5">
                        <TableFilter
                            withFilterPage
                            perPage={perPage}
                            currentPage={currentPage}
                            url={route('apps.users.index')}
                            placeholder="Cari data pengguna berdasarakan nama pengguna"
                        />
                    </div>
                    <TableCard>
                        <Table title="users" subtitle="List of all users" icon={<UserCheck className="size-6 text-gray-700" />}>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead>Nama</TableHead>
                                    <TableHead>Username</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Akses Group</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.data.length === 0 ? (
                                    <TableEmpty colSpan={6} message="Data pengguna" />
                                ) : (
                                    users.data.map((user, index) => (
                                        <TableRow key={user.id}>
                                            <TableCell className="text-center">{++index + (users.current_page - 1) * users.per_page}</TableCell>
                                            <TableCell>{user.name}</TableCell>
                                            <TableCell>{user.username}</TableCell>
                                            <TableCell>{user.email}</TableCell>
                                            <TableCell>
                                                <div className="flex flex-wrap gap-2">
                                                    {user.roles.slice(0, 3).map((role, i) => (
                                                        <Badge variant="default" key={i}>
                                                            {role.name}
                                                        </Badge>
                                                    ))}
                                                    {user.roles.length > 4 && (
                                                        <Badge variant="default">
                                                            + {user.roles.length - 4} lainnya
                                                        </Badge>
                                                    )}
                                                </div>
                                            </TableCell>
                                            <TableCell className="flex items-center justify-end gap-2">
                                                {(hasAnyPermission(['users-update']) || hasAnyPermission(['users-delete']) || hasAnyPermission(['users-show'])) &&
                                                    <ActionButton
                                                        permissionPrefix="users"
                                                        withDetail
                                                        actionDelete={() => handleModalDelete(user)}
                                                        actionEditHref={route('apps.users.edit', user.id)}
                                                        actionDetailHref={route('apps.users.show', user.id)}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete open={deleteModal} onOpenChange={setDeleteModal} url={route('apps.users.destroy', data.id)} />
                    <PagePagination data={users} />
                </div>
            </div>
        </>
    )
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />
