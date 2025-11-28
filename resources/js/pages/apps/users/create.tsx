import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell, TableCard } from '@/components/ui/table'
import { PageProps } from '@/types'
import { Checkbox } from '@/components/ui/checkbox'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LoaderCircle, Save } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Badge } from '@/components/ui/badge'
import { Role } from '@/types/role'

interface CreateProps extends PageProps {
    roles: Role[];
}

export default function Create() {
    const { toast } = useToast();
    const { roles } = usePage<CreateProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        username: '',
        email: '',
        password: '',
        password_confirmation: '',
        selectedRoles: [] as string[],
    });

    const selectedRole = (checked: boolean, roleName: string) => {
        let roleIds = data.selectedRoles;
        if (checked) {
            roleIds = [...roleIds, roleName];
        } else {
            roleIds = roleIds.filter((name) => name !== roleName);
        }
        setData('selectedRoles', roleIds);
    }

    const selectAllRole = (checked: boolean) => {
        const roleIds = roles.map(role => role.name);
        setData('selectedRoles', checked ? roleIds : []);
    }

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('apps.users.store'), {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Data berhasil disimpan',
                });
                reset();
            },
        });
    }

    return (
        <>
            <Head title="Tambah Pengguna" />
            <div className="w-full">
                <Header
                    title="Tambah Data Pengguna"
                    subtitle="Halaman ini digunakan untuk menambahkan data pengguna"
                />
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Pengguna</CardTitle>
                            <CardDescription>
                                Form ini digunakan untuk menambah data pengguna
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={storeData}>
                                {/* Nama */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Nama</Label>
                                    <Input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Masukan nama pengguna"
                                    />
                                    <p className="text-red-500 text-xs">{errors.name}</p>
                                </div>
                                {/* Username */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Username</Label>
                                    <Input
                                        type="text"
                                        value={data.username}
                                        onChange={(e) => setData('username', e.target.value)}
                                        placeholder="Masukan username pengguna"
                                    />
                                    <p className="text-red-500 text-xs">{errors.username}</p>
                                </div>
                                {/* Email */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Email</Label>
                                    <Input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="Masukan email pengguna"
                                    />
                                    <p className="text-red-500 text-xs">{errors.email}</p>
                                </div>
                                {/* Password */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Password</Label>
                                    <Input
                                        type="password"
                                        value={data.password}
                                        onChange={(e) => setData('password', e.target.value)}
                                        placeholder="Masukan password pengguna"
                                    />
                                    <p className="text-red-500 text-xs">{errors.password}</p>
                                </div>
                                {/* Password Confirmation */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Password Confirmation</Label>
                                    <Input
                                        type="password"
                                        value={data.password_confirmation}
                                        onChange={(e) => setData('password_confirmation', e.target.value)}
                                        placeholder="Masukan password confirmation pengguna"
                                    />
                                    <p className="text-red-500 text-xs">{errors.password_confirmation}</p>
                                </div>
                                {/* Hak Akses */}
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Hak Akses Pengguna</Label>
                                    <TableCard>
                                        <Table>
                                            <TableHeader>
                                                <TableRow>
                                                    <TableHead className="w-[50px] text-center">
                                                        <Checkbox
                                                            onCheckedChange={(checked) =>
                                                                selectAllRole(checked === true)
                                                            }
                                                            checked={data.selectedRoles.length === roles.length}
                                                        />
                                                    </TableHead>
                                                    <TableHead>Nama Akses Group</TableHead>
                                                    <TableHead>Hak Akses</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {roles.map((role, i) => (
                                                    <TableRow key={i}>
                                                        <TableCell className="w-[50px] text-center">
                                                            <Checkbox
                                                                checked={data.selectedRoles.includes(role.name)}
                                                                onCheckedChange={(checked) =>
                                                                    selectedRole(checked === true, role.name)
                                                                }
                                                                id={`role-${i}`}
                                                            />
                                                        </TableCell>
                                                        <TableCell>{role.name}</TableCell>
                                                        <TableCell>
                                                            <div className="flex flex-wrap gap-2">
                                                                {role.permissions.map((permission, j) => (
                                                                    <Badge variant="default" key={j}>{permission.name}</Badge>
                                                                ))}
                                                            </div>
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </TableBody>
                                        </Table>
                                    </TableCard>
                                    <p className="text-red-500 text-xs">{errors.selectedRoles}</p>
                                </div>
                                {/* Buttons */}
                                <div className="flex items-center gap-2">
                                    <Button variant="danger" asChild>
                                        <Link href="/apps/users">
                                            <ArrowLeft /> Kembali
                                        </Link>
                                    </Button>
                                    <Button variant="default" type="submit" disabled={processing}>
                                        {processing ? <LoaderCircle className="animate-spin" /> : <Save />} Simpan Data
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

Create.layout = (page: React.ReactNode) => <AppLayout children={page} />
