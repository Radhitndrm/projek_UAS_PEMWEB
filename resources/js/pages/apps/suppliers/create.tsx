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

interface CreateProps extends PageProps{
    supplierCode: string;
}

export default function Create() {

    const { toast } = useToast();

    const { supplierCode } = usePage<CreateProps>().props

    const { data, setData, post, processing, errors } = useForm({
        code: supplierCode,
        name : '',
        address : '',
        email: '',
        phone: ''
    });

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('apps.suppliers.store'), {
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
            <Head title="Tambah Supplier"/>
            <div className='w-full'>
                <Header title='Tambah Data Supplier' subtitle='Halaman ini digunakan untuk menambahkan data supplier'/>
                <div className='p-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Supplier</CardTitle>
                            <CardDescription>Form ini digunakan untuk menambahkan data supplier</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='w-full'>
                                <form onSubmit={storeData}>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Kode Supplier <span className="text-rose-500">*</span></Label>
                                        <Input className='cursor-not-allowed dark:bg-gray-900/50 focus:ring-0' readOnly type="text" value={data.code} onChange={(e) => setData('code', e.target.value)} placeholder='Masukkan kode supplier'/>
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

Create.layout = (page : React.ReactNode) => <AppLayout children={page} />