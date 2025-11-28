import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, useForm, Link } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'

export default function Create() {

    const { toast } = useToast();

    const { data, setData, post, processing, errors } = useForm({
        name : '',
        description : '',
    });

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('apps.units.store'), {
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
            <Head title="Tambah Satuan"/>
            <div className='w-full'>
                <Header title='Tambah Data Satuan' subtitle='Halaman ini digunakan untuk menambahkan data satuan'/>
                <div className='p-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Tambah Satuan</CardTitle>
                            <CardDescription>Form ini digunakan untuk menambahkan data satuan</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='w-full'>
                                <form onSubmit={storeData}>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Satuan  <span className="text-rose-500">*</span></Label>
                                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Masukkan nama satuan'/>
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Deskripsi Satuan</Label>
                                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} placeholder='Masukkan deskripsi satuan'/>
                                        <p className="text-red-500 text-xs">{errors.description}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href={route('apps.units.index')}>
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