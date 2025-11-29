import { Header } from '@/components/header'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Combobox } from '@/components/ui/combobox'
import { Label } from '@/components/ui/label'
import AppLayout from '@/layouts/app-layout'
import { PageProps } from '@/types'
import { Head, useForm, usePage, Link } from '@inertiajs/react'
import { Supplier } from '@/types/supplier'
import { Order } from '@/types/order'
import { OrderDetail } from '@/types/order-detail'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, LoaderCircle, Check } from 'lucide-react'
import axios from 'axios'
import React from 'react'
import DatePicker from '@/components/ui/date-picker'
import { useToast } from '@/hooks/use-toast'
import { Input } from '@/components/ui/input'

interface CreateProps extends PageProps {
    suppliers: Supplier[]
}

export default function Create() {

    const { toast } = useToast();

    const { suppliers } = usePage<CreateProps>().props;

    const { data, setData, post, processing, errors } = useForm({
        receive_code: '',
        receive_date: '',
        orders: [] as Order[],
        details: [] as OrderDetail[],
        selectedSupplier: '',
        order_id: '',
        loading: false as boolean,
    })

    const handleSupplierChange = async (supplier: string) => {
        try {
            const response = await axios.get(route('apps.suppliers.get-orders', supplier));
            const orders = response.data.data;

            setData({ ...data, selectedSupplier: supplier, orders: orders, details: [], order_id: ''});
        } catch (error) {
            console.error(error);
        }
    };

    const handleOrderChange = async (order: string) => {
        try {
            setData('loading', true);
            const response = await axios.get(route('apps.orders.get-order-details', order));
            const details = response.data.data.map((detail: OrderDetail) => ({
                ...detail,
            }))

            setTimeout(() => {
                setData(prevData =>({
                    ...prevData,
                    details: details,
                    loading: false,
                }));
            }, 2000);
        } catch (error) {
            console.error(error);
        }
    };

    const grandTotal = (data : OrderDetail[]) : string => {
        const total = data.reduce((a, c) => a + c.quantity * c.price, 0);

        return new Intl.NumberFormat('id-ID').format(total);
    };

    const storeData = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        post(route('apps.order-receives.store'), {
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
            <Head title='Tambah Penerimaan Pembelian'/>
            <div className='w-full'>
                <Header title='Tambah Data Penerimaan Pembelian' subtitle='Halaman ini digunakan untuk menambahkan data penerimaan pembelian'/>
                <div className='p-6'>
                    <form onSubmit={storeData}>
                        <Card>
                            <CardHeader>
                                <CardTitle>Tambah Penerimaan Pembelian</CardTitle>
                                <CardDescription>Form ini digunakan untuk menambahkan data penerimaan pembelian</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                                    <div className='w-full lg:w-1/2 flex flex-col gap-2'>
                                        <Label>Pilih Supplier <span className='text-rose-500'>*</span></Label>
                                        <Combobox
                                            options={suppliers.map((supplier) => ({
                                                id: supplier.id.toString(),
                                                name: supplier.name
                                            }))}
                                            placeholder={"Pilih Supplier"}
                                            value={data.selectedSupplier}
                                            setValue={(e: string) => setData('selectedSupplier', (e))}
                                            message='supplier'
                                            withChain={(e) => handleSupplierChange(e)}
                                        />
                                        <p className="text-red-500 text-xs">{errors.selectedSupplier}</p>
                                    </div>
                                    <div className='w-full lg:w-1/2 flex flex-col gap-2'>
                                        <Label>Pilih Nomor Pembelian <span className='text-rose-500'>*</span></Label>
                                        <Combobox
                                            options={data.orders.map((order) => ({
                                                id: order.id.toString(),
                                                name: order.order_code
                                            }))}
                                            placeholder={"Pilih Nomor Pembelian"}
                                            value={data.order_id}
                                            setValue={(e: string) => setData('order_id', (e))}
                                            message='nomor pembelian'
                                            disabled={data.orders.length === 0}
                                            withChain={(e) => handleOrderChange(e)}
                                        />
                                        <p className="text-red-500 text-xs">{errors.order_id}</p>
                                    </div>
                                </div>
                                <div className='flex flex-col lg:flex-row gap-4 mb-4'>
                                    <div className='w-full lg:w-1/2 flex flex-col gap-2'>
                                        <Label>Nomor Penerimaan<span className='text-rose-500'>*</span></Label>
                                        <Input value={data.receive_code} onChange={(e) => setData('receive_code', e.target.value)} placeholder='Masukan nomor penerimaan'/>
                                        <p className="text-red-500 text-xs">{errors.receive_code}</p>
                                    </div>
                                    <div className='w-full lg:w-1/2 flex flex-col gap-2'>
                                        <Label>Tanggal Penerimaan <span className='text-rose-500'>*</span></Label>
                                        <DatePicker date={data.receive_date} setDate={(e : string) => setData('receive_date', e)} label="Pilih Tanggal Penerimaan"/>
                                        <p className="text-red-500 text-xs">{errors.receive_date}</p>
                                    </div>
                                </div>
                                {!data.loading ? data.details.length > 0 &&
                                    <>
                                        <TableCard className="mt-10 mb-4">
                                            <Table>
                                                <TableHeader>
                                                    <TableRow className="hover:bg-transparent">
                                                        <TableHead className='w-[10px] text-center'>No</TableHead>
                                                        <TableHead>Produk</TableHead>
                                                        <TableHead>Variant</TableHead>
                                                        <TableHead className="w-[100px] text-center">Kuantitas</TableHead>
                                                        <TableHead className="w-[150px] text-right">Harga/Satuan</TableHead>
                                                        <TableHead className="w-[150px] text-right">Total Harga</TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data.details.map((item, i) => (
                                                        <TableRow className="hover:bg-transparent" key={i}>
                                                            <TableCell className='text-center'>
                                                                {i + 1}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.product_unit.product.name}
                                                            </TableCell>
                                                            <TableCell>
                                                                {item.product_unit.name} {item.product_unit.unit.name}
                                                            </TableCell>
                                                            <TableCell className='text-center'>
                                                                {item.quantity}
                                                            </TableCell>
                                                            <TableCell className='text-right'>
                                                                <sup>Rp</sup> {item.formatted_price}
                                                            </TableCell>
                                                            <TableCell className='text-right'>
                                                                <sup>Rp</sup> {item.total_price}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                    <TableRow>
                                                        <TableCell className='text-right' colSpan={5}>
                                                            Total Harga
                                                        </TableCell>
                                                        <TableCell className='text-right'>
                                                            <sup>Rp</sup> {grandTotal(data.details)}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableBody>
                                            </Table>
                                        </TableCard>
                                        <div className="flex items-center gap-2">
                                            <Button variant="danger" asChild>
                                                <Link href={route('apps.order-receives.index')}>
                                                    <ArrowLeft/> Kembali
                                                </Link>
                                            </Button>
                                            <Button variant="default" type="submit" disabled={processing}>
                                                {processing ? <LoaderCircle className="animate-spin" /> : <Check /> } Simpan Data
                                            </Button>
                                        </div>
                                    </>
                                :
                                    <>
                                        <TableCard className='mt-10 mb-4'>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead className='w-[10px]'>
                                                            <div className='flex items-center justify-center'>
                                                                <Skeleton className="w-10 h-4"/>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className='w-[400px]'><Skeleton className="w-16 h-4"/></TableHead>
                                                        <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                                        <TableHead className='w-[100px]'>
                                                            <div className='flex items-center justify-center'>
                                                                <Skeleton className="w-16 h-4"/>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className='w-[150px]'>
                                                            <div className='flex items-center justify-end'>
                                                                <Skeleton className="w-16 h-4"/>
                                                            </div>
                                                        </TableHead>
                                                        <TableHead className='w-[150px]'>
                                                            <div className='flex items-center justify-end'>
                                                                <Skeleton className="w-16 h-4"/>
                                                            </div>
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {Array.from({ length: 3 }).map((_, i) => (
                                                        <TableRow key={i}>
                                                            <TableCell>
                                                                <div className='flex items-center justify-center'>
                                                                    <Skeleton className="w-10 h-4"/>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className="w-48 h-4"/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <Skeleton className="w-16 h-4"/>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex items-center justify-center'>
                                                                    <Skeleton className="w-16 h-4"/>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex items-center justify-end'>
                                                                    <Skeleton className="w-16 h-4"/>
                                                                </div>
                                                            </TableCell>
                                                            <TableCell>
                                                                <div className='flex items-center justify-end'>
                                                                    <Skeleton className="w-16 h-4"/>
                                                                </div>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </TableCard>
                                        <div className="flex items-center gap-2">
                                            <Skeleton className="h-10 w-28 rounded-md" />
                                            <Skeleton className="h-10 w-32 rounded-md" />
                                        </div>
                                    </>
                                }
                            </CardContent>
                        </Card>
                    </form>
                </div>
            </div>
        </>
    )
}

Create.layout = (page: React.ReactNode) => <AppLayout children={page} />