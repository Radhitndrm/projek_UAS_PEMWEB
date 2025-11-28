import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, useForm, Link, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { ArrowLeft, Check, LoaderCircle } from 'lucide-react'
import { useToast } from '@/hooks/use-toast'
import { PageProps } from '@/types'
import { Category } from '@/types/category'
import { Product } from '@/types/product'

interface EditProps extends PageProps {
    categories: Category[]
    product: Product
}

export default function Edit() {

    const { toast } = useToast();
    const { categories, product } = usePage<EditProps>().props

    const { data, setData, post, processing, errors } = useForm({
        name: product.name,
        sku: product.sku,
        category_id: product.category_id.toString(),
        description: product.description ?? '',
        image: null as File | null,
        _method: 'put'
    });

    const [previewImage, setPreviewImage] = React.useState<string | null>(
        product.image ? `/storage/${product.image}` : null
    );

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setData('image', file ?? null);

        if (file) {
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        post(route('apps.products.update', product.id), {
            forceFormData: true,
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Data berhasil diperbarui!',
                });
            },
        });
    };

    return (
        <>
            <Head title="Ubah Produk" />
            <div className='w-full'>
                <Header title='Ubah Data Produk' subtitle='Halaman ini digunakan untuk mengubah data produk' />
                <div className='p-6'>
                    <Card>
                        <CardHeader>
                            <CardTitle>Ubah Produk</CardTitle>
                            <CardDescription>Form ini digunakan untuk mengubah data produk</CardDescription>
                        </CardHeader>

                        <CardContent>
                            <div className='w-full'>
                                <form onSubmit={storeData} encType="multipart/form-data">

                                    {/* Upload Gambar */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Gambar Produk</Label>

                                        <Input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                        />

                                        {previewImage && (
                                            <img
                                                src={previewImage}
                                                alt="Preview"
                                                className="w-40 h-40 object-cover rounded-md border mt-2"
                                            />
                                        )}

                                        <p className="text-red-500 text-xs">{errors.image}</p>
                                    </div>

                                    {/* SKU + Kategori */}
                                    <div className='mb-4 flex flex-col md:flex-row items-star justify-center gap-4'>
                                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                                            <Label>SKU <span className="text-rose-500">*</span></Label>
                                            <Input
                                                type="text"
                                                value={data.sku}
                                                onChange={(e) => setData('sku', e.target.value)}
                                                placeholder='Masukkan sku produk'
                                            />
                                            <p className="text-red-500 text-xs">{errors.sku}</p>
                                        </div>

                                        <div className="w-full md:w-1/2 flex flex-col gap-2">
                                            <Label>Kategori Produk <span className="text-rose-500">*</span></Label>

                                            <Select
                                                value={data.category_id}
                                                onValueChange={(e) => setData('category_id', e)}
                                            >
                                                <SelectTrigger className="w-full">
                                                    <SelectValue placeholder="Pilih kategori produk" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {categories.map((category) => (
                                                        <SelectItem value={category.id.toString()} key={category.id}>
                                                            {category.name}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>

                                            <p className="text-red-500 text-xs">{errors.category_id}</p>
                                        </div>
                                    </div>

                                    {/* Nama Produk */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Nama Produk <span className="text-rose-500">*</span></Label>
                                        <Input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            placeholder='Masukkan nama produk'
                                        />
                                        <p className="text-red-500 text-xs">{errors.name}</p>
                                    </div>

                                    {/* Deskripsi */}
                                    <div className="mb-4 flex flex-col gap-2">
                                        <Label>Deskripsi Produk</Label>
                                        <Textarea
                                            value={data.description}
                                            onChange={(e) => setData('description', e.target.value)}
                                            placeholder='Masukkan deskripsi produk'
                                        />
                                        <p className="text-red-500 text-xs">{errors.description}</p>
                                    </div>

                                    {/* Tombol */}
                                    <div className="flex items-center gap-2">
                                        <Button variant="danger" asChild>
                                            <Link href={route('apps.products.index')}>
                                                <ArrowLeft /> Kembali
                                            </Link>
                                        </Button>

                                        <Button variant="default" type="submit" disabled={processing}>
                                            {processing ? <LoaderCircle className="animate-spin" /> : <Check />}
                                            Simpan Perubahan
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
