import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import AppLayout from "@/layouts/app-layout";
import { PageProps } from "@/types";
import { Head, usePage } from "@inertiajs/react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { User } from "@/types";
import { Header } from "@/components/header";
import { TabList } from "@headlessui/react";

interface ShowProps extends PageProps {
    user: User;

}
export default function Show() {
    const { user } = usePage<ShowProps>().props;
    return (
        <>
            <Head title="Detail Pengguna" />
            <div className="w-full">
                <Header title="Detail Pengguna" subtitle="Halaman ini digunakan untuk melihat detail pengguna" />
                <div className="p-6">
                    <Tabs defaultValue="information">
                        <TabsList>
                            <TabsTrigger value="information">Informasi Pribadi</TabsTrigger>
                            <TabsTrigger value="access">Hak Akses Pengguna</TabsTrigger>
                        </TabsList>
                        <TabsContent value="information">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Informasi Pribadi Pengguna</CardTitle>
                                    <CardDescription>Tabel ini digunakan untuk menampilkan informasi pribadi pengguna</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0">
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className="px-6 w-10font-bold dark:text-white">Nama</TableCell>
                                                <TableCell className="px-6">{user.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-6 -10 font-bold dark:text-white">Username</TableCell>
                                                <TableCell className="px-6">{user.username}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className="px-6 font-bold dark:text-white">Email</TableCell>
                                                <TableCell className="px-6">{user.email}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                        <TabsContent value="access" className="w-full">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Hak Akses Pengguna</CardTitle>
                                    <CardDescription>Tabel ini digunakan untuk menampilkan informasi hak pengguna</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead className="px-6 font-bold dark:text-white">Nama Akses Group</TableHead>
                                                <TableHead className="px-6 font-bold dark:text-white">Hak Akses</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {user.roles.map((role, i) => (
                                                <TableRow key={i}>
                                                    <TableCell className="px-6">{role.name}</TableCell>
                                                    <TableCell className="px-6">
                                                        <div className="flex flex-wrap gap-2">
                                                            {role.name === 'super-admin' ?
                                                                <Badge variant='default'>Semua Hak Akses</Badge> :
                                                                role.permissions.map((permission, index) => (
                                                                    <Badge variant='default' key={index}>{permission.name}</Badge>
                                                                ))
                                                            }
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </>
    )
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />
