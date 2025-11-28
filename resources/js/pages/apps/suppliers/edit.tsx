import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, useForm, Link, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { PageProps } from '@/types'
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { Supplier } from '@/types/supplier'

interface EditProps extends PageProps{
    supplier: Supplier
}

export default function Edit() {

    const { toast } = useToast();

    const { supplier } = usePage<EditProps>().props

    const { data, setData, post, processing, errors } = useForm({
        code: supplier.code,
        name : supplier.name,
        address : supplier.address,
        email: supplier.email,
        phone: supplier.phone,
        _method: 'put'
    });

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('apps.suppliers.update', supplier.id), {
            onSuccess: () => {
                toast({
                    'variant': 'success',
                    'title': 'Success',
                    'description': 'Data berhasil disimpan!',
                })
            },
        });
    }

    return (
        <>
            <Head title="Ubah Supplier"/>
            <div className='w-full'>
                <Header title='Ubah Data Supplier' subtitle='Halaman ini digunakan untuk mengubah data supplier'/>
                <div className='p-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Supplier</CardTitle>
                            <CardDescription>Form ini digunakan untuk mengubah data supplier</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='w-full'>
                                <form onSubmit={storeData}>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Kode Supplier <span className="text-rose-500">*</span></Label>
                                        <Input className='cursor-not-allowed dark:bg-gray-900/50 focus:ring-0' readOnly  type="text" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder='Masukkan kode supplier'/>
                                        <p className="text-red-500 text-xs">{errors.code}</p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Supplier <span className="text-rose-500">*</span></Label>
                                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Masukkan nama supplier'/>
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Email</Label>
                                        <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} placeholder='Masukkan email supplier'/>
                                        <p className="text-red-500 text-xs">{errors.email}</p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Telp</Label>
                                        <Input type="number" value={data.phone} onChange={(e) => setData('phone', e.target.value)} placeholder='Masukkan telp supplier'/>
                                        <p className="text-red-500 text-xs">{errors.phone}</p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Alamat Supplier</Label>
                                        <Textarea value={data.address} onChange={(e) => setData('address', e.target.value)} placeholder='Masukkan alamat supplier'/>
                                        <p className="text-red-500 text-xs">{errors.address}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href={route('apps.suppliers.index')}>
                                                <ArrowLeft/> Kembali
                                            </Link>
                                        </Button>
                                        <Button variant="default" type="submit" disabled={processing}>
                                            {processing ? <LoaderCircle className="animate-spin" /> : <Check /> } Simpan Data
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

Edit.layout = (page : React.ReactNode) => <AppLayout children={page} />