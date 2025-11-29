import React, { useEffect } from 'react'
import AppLayout from '@/Layouts/app-layout'
import { Head, usePage, Link, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card'
import { PageProps } from '@/types'
import { Supplier } from '@/types/supplier'
import { Label } from '@/components/ui/label'
import { Input } from '@/components/ui/input'
import { ProductUnit } from '@/types/product-unit'
import { Combobox } from '@/components/ui/combobox'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { PlusCircle, X, Trash, LoaderCircle, Check, ArrowLeft } from 'lucide-react'
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { useToast } from '@/hooks/use-toast'
import { Order } from '@/types/order'
import { Product } from '@/types/product'
import axios from 'axios'
import DatePicker from '@/components/ui/date-picker'

interface EditProps extends PageProps {
    order: Order
    products: Product[],
    suppliers: Supplier[],
    units: ProductUnit[];
}

export default function Edit() {

    const { toast } = useToast();

    const { products, suppliers, order } = usePage<EditProps>().props

    const {data, setData, post, processing, errors} = useForm({
        order_code: order.order_code,
        supplier_id: order.supplier_id.toString(),
        order_date: order.order_date,
        items: order.order_details.map((detail) => {
            return {
                product: detail.product_unit.product_id.toString(),
                units: detail.product_unit.product.product_units,
                product_unit: detail.product_unit_id.toString(),
                quantity: detail.quantity,
                price: detail.price,
                total_price: detail.price * detail.quantity
            }
        }),
        grand_price: 0,
        _method: 'put',
    })

    const setItemsData = async (key : number, e : React.ChangeEvent<HTMLInputElement> | string, fieldName? : string) => {
        let updatedItems = [...data.items];

        let value: string | any;
        let name: string;

        if (typeof e !== 'string') {
            value = e.target.value;
            name = e.target.name;
        } else {
            value = e;
            name = fieldName || 'product';
        }

        if (name === 'quantity' || name === 'price')
            value = parseFloat(value) || 0;

        updatedItems[key] = {
            ...updatedItems[key],
            [name] : value,
        }

        setData({...data, items: updatedItems })
    }

    useEffect(() => {
        const updatedItems = data.items.map(item => ({
            ...item,
            total_price: item.price * item.quantity,
        }));

        const grandPrice = updatedItems.reduce((total, item) => total + item.total_price, 0);

        if (
            JSON.stringify(data.items) !== JSON.stringify(updatedItems) ||
            data.grand_price !== grandPrice
        ) {
            setData(prev => ({
                ...prev,
                items: updatedItems,
                grand_price: grandPrice,
            }));
        }
    }, [data.items]);

    const handleProductChange = async (product: string, index: number) => {
        try {
            const response = await axios.get(route('apps.products.get-product-units', product));
            const units = response.data.data;

            const updatedItems = [...data.items];
            updatedItems[index] = {
                ...updatedItems[index],
                units: units,
                product: product,
            };

            setData({ ...data, items: updatedItems });
        } catch (error) {
            console.error(error);
        }
    };

    const addMoreColumn = () => {
        let items = [...data.items, { product : '', units: [], product_unit: '', quantity: 0, price: 0, total_price: 0}];

        setData('items', items);
    }

    const removeColumn = (key : number) => {
        let items = [...data.items];

        items.splice(key, 1);

        setData('items', items);
    }

    const storeData = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('apps.orders.update', order.id), {
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
            <Head title='Ubah Pembelian'/>
            <div className="w-full">
                <Header title="Ubah Data Pembelian" subtitle="Halaman ini digunakan untuk mengubah data pembelian"/>
                <div className="p-6">
                    <Card>
                        <form onSubmit={storeData}>
                            <CardHeader>
                                <CardTitle>
                                    Ubah Pembelian
                                </CardTitle>
                                <CardDescription>
                                    Form ini digunakan untuk mengubah data pembelian
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="mb-4 flex flex-col gap-2">
                                    <Label>Nomor Faktur  <span className="text-rose-500">*</span></Label>
                                    <Input type="text" value={data.order_code} onChange={(e) => setData('order_code', e.target.value)} placeholder='Masukkan nomor faktur'/>
                                    <p className="text-red-500 text-xs">{errors.order_code}</p>
                                </div>
                                <div className='mb-4 flex flex-col md:flex-row items-star justify-center gap-4'>
                                    <div className="w-1/2 flex flex-col gap-2">
                                        <Label>Supplier <span className="text-rose-500">*</span></Label>
                                        <Combobox
                                            options={suppliers.map((supplier) => ({
                                                id: supplier.id.toString(),
                                                name:  '[ ' + supplier.code + ' ] - ' + supplier.name,
                                            }))}
                                            placeholder={"Pilih Supplier"}
                                            value={data.supplier_id}
                                            setValue={(e) => setData('supplier_id', (e))}
                                        />
                                    </div>
                                    <div className="w-1/2 flex flex-col gap-2">
                                        <Label>Tanggal Berlaku Pembelian <span className="text-rose-500">*</span></Label>
                                        <DatePicker date={data.order_date} setDate={(e : any) => setData('order_date', e)} label='Pilih Tanggal Pembelian'/>
                                    </div>
                                </div>
                                <TableCard className='mt-8'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className="hover:bg-transparent">
                                            <TableHead className='text-center w-[10px]'>Aksi</TableHead>
                                                <TableHead className='w-[400px]'>Produk <span className="text-rose-500">*</span></TableHead>
                                                <TableHead>Variant <span className="text-rose-500">*</span></TableHead>
                                                <TableHead className="w-[120px]">Kuantitas <span className="text-rose-500">*</span></TableHead>
                                                <TableHead className="w-[150px]">Harga/Satuan <span className="text-rose-500">*</span></TableHead>
                                                <TableHead className="w-[150px]">Total Harga</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {data.items.map((item, i) => (
                                                <TableRow className="hover:bg-transparent" key={i}>
                                                <TableCell className='align-top'>
                                                    <div className='flex items-start justify-center'>
                                                        <Button type="button" variant="danger" onClick={() => removeColumn(i)} disabled={i === 0}>
                                                        {i === 0 ? <X/> : <Trash/>}
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className='flex flex-col gap-2'>
                                                        <Combobox
                                                            options={products.map((product) => ({
                                                                id: product.id.toString(),
                                                                name: product.name,
                                                            }))}
                                                            placeholder={"Pilih Produk"}
                                                            value={item.product}
                                                            setValue={(e) => setItemsData(i, e, 'product')}
                                                            withChain={(e) => handleProductChange(e.toString(), i)}
                                                        />
                                                        <span className="text-xs text-red-500">{(errors as any)[`items.${i}.product`]}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className='flex flex-col gap-2'>
                                                        <Select value={item.product_unit} onValueChange={(e) => setItemsData(i, e, 'product_unit')} disabled={item.units.length === 0}>
                                                            <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                                                <SelectValue placeholder="Pilih Satuan"/>
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {item.units.map((unit, index) => (
                                                                    <SelectItem key={index} value={unit.id.toString()}>
                                                                        {unit.name} {unit.unit.name}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                        <span className="text-xs text-red-500">{(errors as any)[`items.${i}.product_unit`]}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className='flex flex-col gap-2'>
                                                        <Input type="text" name="quantity" value={item.quantity} onChange={(e) => setItemsData(i, e)}/>
                                                        <span className="text-xs text-red-500">{(errors as any)[`items.${i}.quantity`]}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <div className='flex flex-col gap-2'>
                                                        <Input type="text" name="price" value={item.price} onChange={(e) => setItemsData(i, e)}/>
                                                        <span className="text-xs text-red-500">{(errors as any)[`items.${i}.price`]}</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell className="align-top">
                                                    <Input type="text" readOnly value={item.total_price} className='cursor-not-allowed focus:ring-0'/>
                                                </TableCell>
                                            </TableRow>
                                            ))}
                                            <TableRow className='dark:hover:bg-gray-950'>
                                                <TableCell colSpan={5} className="text-right font-semibold py-3">GrandTotal</TableCell>
                                                <TableCell>
                                                    <Input type="text" readOnly value={data.grand_price} className='cursor-not-allowed focus:ring-0'/>
                                                </TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </TableCard>
                                <div className='py-4'>
                                    <Button type="button" onClick={addMoreColumn} variant="indigo" size="sm">
                                        <PlusCircle/> Tambah Kolom
                                    </Button>
                                </div>
                            </CardContent>
                            <CardFooter className='border-t p-4 w-full overflow-x-auto scrollbar-hide'>
                                <div className="flex justify-end items-center gap-2">
                                    <Button variant="danger" asChild>
                                        <Link href={route('apps.orders.index')}>
                                            <ArrowLeft/> Kembali
                                        </Link>
                                    </Button>
                                    <Button variant="default" type="submit" disabled={processing}>
                                        {processing ? <LoaderCircle className="animate-spin" /> : <Check /> } Simpan Data
                                    </Button>
                                </div>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    )
}

Edit.layout = (page: React.ReactNode) => <AppLayout children={page} />
