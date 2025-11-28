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
import { User } from '@/types'

interface EditProps extends PageProps {
    user: User;
    roles: Role[];
}

export default function Edit() {
    const { toast } = useToast();
    const { user, roles } = usePage<EditProps>().props
    const { data, setData, post, processing, errors, reset } = useForm({
        name: user.name,
        username: user.username,
        email: user.email,
        password: '',
        password_confirmation: '',
        selectedRoles: user.roles.map((role: Role) => role.name),
        _method: 'put'
    })

    // ✅ handler per role
    const selectedRole = (checked: boolean, roleName: string) => {
        let roleIds = data.selectedRoles

        if (checked) {
            roleIds = [...roleIds, roleName]
        } else {
            roleIds = roleIds.filter((name) => name !== roleName)
        }

        setData('selectedRoles', roleIds)
    }

    // ✅ handler select all
    const selectAllRole = (checked: boolean) => {
        const rolesIds = roles.map(role => role.name)
        setData('selectedRoles', checked ? rolesIds : [])
    }

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route('apps.users.update', user.id), {
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Data berhasil disimpan',
                })
                reset()
            },
        })
    }

    return (
        <>
            <Head title="Ubah Pengguna" />
            <div className="w-full">
                <Header
                    title="Ubah Data Pengguna"
                    subtitle="Halaman ini digunakan untuk mengubah data pengguna"
                />
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Pengguna</CardTitle>
                            <CardDescription>
                                Form ini digunakan untuk mengubah data pengguna
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full">
                                <form onSubmit={storeData}>
                                    {/* === Nama === */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama</Label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) =>
                                                setData('name', e.target.value)
                                            }
                                            placeholder="Masukan nama pengguna"
                                        />
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>
                                    {/* === Username === */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Username</Label>
                                        <Input
                                            type="text"
                                            value={data.username}
                                            onChange={(e) =>
                                                setData('username', e.target.value)
                                            }
                                            placeholder="Masukan username pengguna"
                                        />
                                        <p className="text-red-500 text-xs">{errors.username}</p>
                                    </div>
                                    {/* === Email === */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Email</Label>
                                        <Input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) =>
                                                setData('email', e.target.value)
                                            }
                                            placeholder="Masukan email pengguna"
                                        />
                                        <p className="text-red-500 text-xs">{errors.email}</p>
                                    </div>
                                    {/* === Password === */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Password</Label>
                                        <Input
                                            type="password"
                                            value={data.password}
                                            onChange={(e) =>
                                                setData('password', e.target.value)
                                            }
                                            placeholder="Masukan password pengguna"
                                        />
                                        <p className="text-red-500 text-xs">{errors.password}</p>
                                    </div>
                                    {/* === Password Confirmation === */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Password Confirmation</Label>
                                        <Input
                                            type="password"
                                            value={data.password_confirmation}
                                            onChange={(e) =>
                                                setData(
                                                    'password_confirmation',
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Masukan password confirmation pengguna"
                                        />
                                        <p className="text-red-500 text-xs">
                                            {errors.password_confirmation}
                                        </p>
                                    </div>
                                    {/* === Hak Akses Pengguna === */}
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
                                                                checked={
                                                                    data.selectedRoles.length ===
                                                                    roles.length
                                                                }
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
                                                                    checked={data.selectedRoles.includes(
                                                                        role.name
                                                                    )}
                                                                    onCheckedChange={(checked) =>
                                                                        selectedRole(
                                                                            checked === true,
                                                                            role.name
                                                                        )
                                                                    }
                                                                    id={`role-${i}`}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{role.name}</TableCell>
                                                            <TableCell>
                                                                <div className="flex flex-wrap gap-2">
                                                                    {role.permissions.map(
                                                                        (permission, j) => (
                                                                            <Badge
                                                                                variant="default"
                                                                                key={j}
                                                                            >
                                                                                {permission.name}
                                                                            </Badge>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableCard>
                                        <p className="text-red-500 text-xs">
                                            {errors.selectedRoles}
                                        </p>
                                    </div>
                                    {/* === Buttons === */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href="/apps/users">
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
                                                <Save />
                                            )}{' '}
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
    )
}

Edit.layout = (page: React.ReactNode) => <AppLayout children={page} />
