import React, { useState } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage, Link, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { PageProps } from '@/types'
import { Unit } from '@/types/unit'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LoaderCircle, Check } from 'lucide-react'
import { Product } from '@/types/product'
import { ProductUnit } from '@/types/product-unit'

interface EditProps extends PageProps {
    units: Unit[],
    product: Product
    productUnit: ProductUnit
}

export default function Edit() {

    const { toast } = useToast();
    const { units, product, productUnit } = usePage<EditProps>().props

    const [previewImage, setPreviewImage] = useState<string | null>(productUnit.image ? `/storage/${productUnit.image}` : null);

    const { data, setData, post, processing, errors } = useForm({
        name: productUnit.name,
        barcode: productUnit.barcode,
        unit_id: productUnit.unit_id.toString(),
        price: productUnit.price,
        image: null as File | null,
        _method: 'put'
    })


    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('apps.product-units.update', [product.id, productUnit.id]), {
            forceFormData: true, // pastikan inertia kirim sebagai multipart/form-data
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Data berhasil disimpan!',
                })
            },
        });
    }

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('image', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    }

    return (
        <>
            <Head title="Ubah Variant Produk" />
            <div className='w-full'>
                <Header title="Ubah Data Variant Produk" subtitle="Halaman ini digunakan untuk mengubah variant produk" />
                <div className='p-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Variant Produk</CardTitle>
                            <CardDescription>Form ini digunakan untuk mengubah data variant produk</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className='w-full'>
                                <form onSubmit={storeData} encType="multipart/form-data">
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Variant Produk <span className="text-rose-500">*</span></Label>
                                        <Input type="text" value={data.name} onChange={(e) => setData('name', e.target.value)} placeholder='Masukan nama variant produk' />
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>

                                    <div className='mb-4 flex items-star justify-center gap-4'>
                                        <div className="w-1/2 flex flex-col gap-2">
                                            <Label>Barcode <span className="text-rose-500">*</span></Label>
                                            <Input type="text" value={data.barcode} onChange={(e) => setData('barcode', e.target.value)} placeholder='Masukan barcode produk' />
                                            <p className="text-red-500 text-xs">{errors.barcode}</p>
                                        </div>
                                        <div className="w-1/2 flex flex-col gap-2">
                                            <Label>Satuan Produk <span className="text-rose-500">*</span></Label>
                                            <Select value={data.unit_id} onValueChange={(e) => setData('unit_id', e)}>
                                                <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                                    <SelectValue placeholder="Pilih satuan produk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {units.map((unit, i) => (
                                                        <SelectItem value={unit.id.toString()} key={i}>{unit.name}</SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                            <p className="text-red-500 text-xs">{errors.unit_id}</p>
                                        </div>
                                    </div>

                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Harga <span className="text-rose-500">*</span></Label>
                                        <Input type="number" value={data.price} onChange={(e) => setData('price', parseInt(e.target.value))} placeholder='Masukan harga produk' />
                                        <p className="text-red-500 text-xs">{errors.price}</p>
                                    </div>

                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Gambar Produk</Label>
                                        <Input type="file" accept="image/*" onChange={handleImageChange} />
                                        {previewImage && (
                                            <img src={previewImage} alt="Preview" className="mt-2 h-32 w-32 object-cover border" />
                                        )}
                                        <p className="text-red-500 text-xs">{errors.image}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href={route('apps.products.show', product.id)}>
                                                <ArrowLeft /> Kembali
                                            </Link>
                                        </Button>
                                        <Button variant="default" type="submit" disabled={processing}>
                                            {processing ? <LoaderCircle className="animate-spin" /> : <Check />} Simpan Data
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
