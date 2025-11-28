import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage, Link, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'
import { PageProps } from '@/types'
import { Unit } from '@/types/unit'
import { Button } from '@/components/ui/button'
import { ArrowLeft, LoaderCircle, Check, PlusCircle, Trash, X } from 'lucide-react'
import { Product } from '@/types/product'

interface CreateProps extends PageProps {
    units: Unit[],
    product: Product
}

interface ItemForm {
    barcode: string;
    name: string;
    unit: string;
    price: number;
    image: File | null;
}

export default function Create() {

    const { toast } = useToast();
    const { units, product } = usePage<CreateProps>().props

    const { data, setData, post, processing, errors } = useForm<{ items: ItemForm[] }>({
        items: [
            { barcode: '', name: '', unit: '', price: 0, image: null }
        ]
    })

    const setItemsData = (key: number, e: React.ChangeEvent<HTMLInputElement> | string) => {
        let updatedItems = [...data.items];

        const value = typeof e !== 'string' ? e.target.value : e;
        const name = typeof e !== 'string' ? e.target.name : 'unit';

        updatedItems[key] = {
            ...updatedItems[key],
            [name]: value
        }

        setData({ ...data, items: updatedItems })
    }

    const setItemsDataFile = (key: number, e: React.ChangeEvent<HTMLInputElement>) => {
        let updatedItems = [...data.items];
        updatedItems[key] = {
            ...updatedItems[key],
            image: e.target.files ? e.target.files[0] : null
        }
        setData("items", updatedItems)
    }

    const addMoreColumn = () => {
        let items = [...data.items, { barcode: '', name: '', unit: '', price: 0, image: null }];
        setData('items', items);
    }

    const removeColumn = (key: number) => {
        let items = [...data.items];
        items.splice(key, 1);
        setData('items', items);
    }

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('apps.product-units.store', product.id), {
            forceFormData: true, // WAJIB supaya file ikut terkirim
            onSuccess: () => {
                toast({
                    variant: 'success',
                    title: 'Success',
                    description: 'Data berhasil disimpan!',
                })
            },
        });
    }

    return (
        <>
            <Head title="Tambah Variant Produk" />
            <div className='w-full'>
                <Header title="Tambah Data Variant Produk" subtitle="Halaman ini digunakan untuk menambahkan variant produk" />
                <div className='p-6'>
                    <form onSubmit={storeData}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tambah Variant Produk</CardTitle>
                                <CardDescription>Form ini digunakan untuk menambahkan data variant produk</CardDescription>
                            </CardHeader>
                            <CardContent className="p-0 overflow-x-auto">
                                <Table className='border-b'>
                                    <TableHeader>
                                        <TableRow className="hover:bg-transparent">
                                            <TableHead className='text-center'>Aksi</TableHead>
                                            <TableHead>Barcode <span className="text-rose-500">*</span></TableHead>
                                            <TableHead>Nama Variant <span className="text-rose-500">*</span></TableHead>
                                            <TableHead>Satuan Produk <span className="text-rose-500">*</span></TableHead>
                                            <TableHead>Harga <span className="text-rose-500">*</span></TableHead>
                                            <TableHead>Gambar <span className="text-rose-500">*</span></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.items.map((item, i) => (
                                            <TableRow className="hover:bg-transparent" key={i}>
                                                <TableCell>
                                                    <div className='flex items-start justify-center'>
                                                        <Button type="button" variant="danger" onClick={() => removeColumn(i)} disabled={i === 0}>
                                                            {i === 0 ? <X /> : <Trash />}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Input type="text" name="barcode" value={item.barcode} onChange={(e) => setItemsData(i, e)} placeholder='Masukan kode barcode produk' />
                                                    {(errors as any)[`items.${i}.barcode`] && <span className="text-xs text-red-500">{(errors as any)[`items.${i}.barcode`]}</span>}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Input type="text" name="name" value={item.name} onChange={(e) => setItemsData(i, e)} placeholder='Masukan nama variant produk' />
                                                    {(errors as any)[`items.${i}.name`] && <span className="text-xs text-red-500">{(errors as any)[`items.${i}.name`]}</span>}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Select value={item.unit} onValueChange={(e) => setItemsData(i, e)}>
                                                        <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                                            <SelectValue placeholder="Pilih satuan" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            {units.map((unit, i) => (
                                                                <SelectItem value={unit.id.toString()} key={i}>{unit.name}</SelectItem>
                                                            ))}
                                                        </SelectContent>
                                                    </Select>
                                                    {(errors as any)[`items.${i}.unit`] && <span className="text-xs text-red-500">{(errors as any)[`items.${i}.unit`]}</span>}
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Input type="number" name="price" value={item.price} onChange={(e) => setItemsData(i, e)} placeholder='Masukan harga' />
                                                    {(errors as any)[`items.${i}.price`] && <span className="text-xs text-red-500">{(errors as any)[`items.${i}.price`]}</span>}
                                                </TableCell>

                                                {/* Kolom Gambar */}
                                                <TableCell className="align-top">
                                                    <Input type="file" accept="image/*" onChange={(e) => setItemsDataFile(i, e)} />
                                                    {(errors as any)[`items.${i}.image`] && (
                                                        <span className="text-xs text-red-500">
                                                            {(errors as any)[`items.${i}.image`]}
                                                        </span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>

                                <div className='p-4'>
                                    <Button type="button" onClick={addMoreColumn} variant="indigo" size="sm">
                                        <PlusCircle /> Tambah Kolom
                                    </Button>
                                </div>
                            </CardContent>

                            <CardFooter className='border-t p-4 w-full overflow-x-auto scrollbar-hide'>
                                <div className="flex justify-end items-center gap-2">
                                    <Button variant="danger" asChild>
                                        <Link href={route('apps.products.show', product.id)}>
                                            <ArrowLeft /> Kembali
                                        </Link>
                                    </Button>
                                    <Button variant="default" type="submit" disabled={processing}>
                                        {processing ? <LoaderCircle className="animate-spin" /> : <Check />} Simpan Data
                                    </Button>
                                </div>
                            </CardFooter>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    )
}

Create.layout = (page: React.ReactNode) => <AppLayout children={page} />
