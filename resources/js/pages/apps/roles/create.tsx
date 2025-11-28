import React from "react"
import AppLayout from "@/layouts/app-layout"
import { Head, Link, useForm } from "@inertiajs/react"
import { Header } from "@/components/header"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Save, LoaderCircle } from "lucide-react"
import { TableCard } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"

interface Permission {
    name: string
}

interface Props {
    permissions: Permission[]
}

export default function Create({ permissions }: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: "",
        selectedPermissions: [] as string[],
    });

    // pilih semua / batal pilih semua
    const selectAllPermission = (checked: boolean) => {
        const permissionsIds = permissions.map((permission) => permission.name)
        setData("selectedPermissions", checked ? permissionsIds : [])
    }

    // submit data
    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        post(route("apps.roles.store"), {
            onSuccess: () => {
                toast({
                    variant: "success",
                    title: "Success",
                    description: "Data berhasil disimpan",
                })
                reset()
            },
        })
    }

    return (
        <>
            <Head title="Tambah Akses Group" />
            <div className="w-full">
                <Header
                    title="Tambah Data Akses Group"
                    subtitle="Halaman ini digunakan untuk menambahkan data akses group pengguna"
                />
                <div className="p-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Akses Group</CardTitle>
                            <CardDescription>
                                Form ini digunakan untuk menambahkan data akses
                                group
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="w-full">
                                <form onSubmit={storeData}>
                                    {/* Nama Group */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Akses Group</Label>
                                        <Input
                                            type="text"
                                            autoComplete="off"
                                            name="name"
                                            value={data.name}
                                            onChange={(e) => setData("name", e.target.value)}
                                            placeholder="Masukan nama akses group"
                                        />
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>

                                    {/* Permissions */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Hak Akses</Label>
                                        <TableCard>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className="w-[50px] text-center">
                                                            <Checkbox
                                                                checked={
                                                                    data.selectedPermissions.length ===
                                                                    permissions.length
                                                                }
                                                                onCheckedChange={selectAllPermission}
                                                            />
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {permissions.map((permission, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell className="w-[50px] text-center">
                                                                <Checkbox
                                                                    checked={data.selectedPermissions.includes(
                                                                        permission.name
                                                                    )}
                                                                    onCheckedChange={(checked) => {
                                                                        setData(
                                                                            "selectedPermissions",
                                                                            checked
                                                                                ? [...data.selectedPermissions, permission.name]
                                                                                : data.selectedPermissions.filter(
                                                                                    (p) => p !== permission.name
                                                                                )
                                                                        )
                                                                    }}
                                                                    id={`permission-${i}`}
                                                                />
                                                            </TableCell>
                                                            <TableCell>{permission.name}</TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableCard>
                                        <p className="text-red-500 text-xs">
                                            {errors.selectedPermissions}
                                        </p>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href="/apps/roles">
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

Create.layout = (page: React.ReactNode) => <AppLayout>{page}</AppLayout>
