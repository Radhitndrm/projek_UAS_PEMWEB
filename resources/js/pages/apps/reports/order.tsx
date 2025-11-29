import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Skeleton } from '@/components/ui/skeleton'
import type { Order } from '@/types/order'
import axios from 'axios'

export default function Order() {

    const { toast } = useToast();
    
    const { lastPurchase, today } = usePage().props;

    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<any>({
        from: lastPurchase,
        to: today,
    });
    const [data, setData] = React.useState<Order[]>([]);

    const submit = async () => {
        try{
            if(!selectedDate){
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih range tanggal terlebih dahulu",
                })
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.order-reports'), {
                params: {
                    from: selectedDate.from,
                    to: selectedDate.to,
                }
            });

            setTimeout(() => {
                if(response.data.code === 200)
                    toast({
                        'variant': 'success',
                        'title': 'Success',
                        'description': 'Data berhasil ditemukan!',
                    })
                else
                    toast({
                        'variant': 'destructive',
                        'title': 'Error',
                        'description': 'Data tidak ditemukan!',
                    })

                setData(response.data.data);
                setLoading(false);

                console.log(data);
            }, 2000)
        }catch(e){
            console.log(e);
        }
    }

    const totalOrder = (order: Order[]): string => {
        const total = order.reduce((sum, item) => sum + item.total_amount, 0);
        return new Intl.NumberFormat('id-ID').format(total);
    };

    return (
        <>
            <Head title="Laporan Pembelian"/>
            <div className="w-full">
                <Header title='Laporan Pembelian' subtitle='Halaman ini digunakan untuk melihat laporan pembelian'/>
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Tanggal Transaksi <span className='text-rose-500'>*</span></Label>
                            <DateRangePicker date={selectedDate} setDate={setSelectedDate} label="Pilih range tanggal transaksi"/>
                        </div>
                        <Button className='mt-5' type='submit' onClick={submit}>
                            Tampilkan Laporan
                        </Button>
                    </div>
                    {!loading ?
                        data.length > 0 && (
                        <>
                            <TableCard className='mt-6'>
                                <Table>
                                    <TableHeader>
                                        <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                            <TableHead className="w-[10px] text-center" rowSpan={2}>No</TableHead>
                                            <TableHead colSpan={2}>Supplier</TableHead>
                                            <TableHead rowSpan={2} className='text-center'>Nomor Faktur</TableHead>
                                            <TableHead rowSpan={2} className='text-center'>Tanggal Pembelian</TableHead>
                                            <TableHead rowSpan={2} className='text-center'>Total Pembelian</TableHead>
                                        </TableRow>
                                        <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                            <TableHead className='border-l'>Kode</TableHead>
                                            <TableHead>Nama</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((report, reportIndex) => (
                                            <React.Fragment key={reportIndex}>
                                                <TableRow className='bg-gray-100/50 dark:bg-gray-900/50 border-t'>
                                                    <TableCell className="text-center">{reportIndex + 1}</TableCell>
                                                    <TableCell>{report.supplier.code}</TableCell>
                                                    <TableCell>{report.supplier.name}</TableCell>
                                                    <TableCell className='text-center'>{report.order_code}</TableCell>
                                                    <TableCell className='text-center'>{report.order_date}</TableCell>
                                                    <TableCell className='text-right'>
                                                        <sup>Rp</sup> {report.formatted_amount}
                                                    </TableCell>
                                                </TableRow>
                                                {report.order_details.map((detail : any, detailIndex : any) => (
                                                    <TableRow className='border-none' key={detailIndex}>
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={3} className={`border-b border-dashed ${detailIndex === report.order_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            {detail.product_unit.product.name} {detail.product_unit.name} {detail.product_unit.unit.name}
                                                        </TableCell>
                                                        <TableCell className={`border-b border-dashed text-center ${detailIndex === report.order_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            {detail.quantity} x <sup>Rp</sup> {detail.price}
                                                        </TableCell>
                                                        <TableCell className={`border-b border-dashed text-right ${detailIndex === report.order_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            <sup>Rp</sup> {detail.total_price}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                        <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                            <TableCell colSpan={5} className='text-right font-bold border-t'>
                                                Total Pembelian
                                            </TableCell>
                                            <TableCell className='text-right font-bold border-t'>
                                                <sup>Rp</sup> {totalOrder(data)}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCard>
                        </>
                    ):
                        <TableCard className='mt-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className='w-[10px]' rowSpan={2}>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-6 h-6"/>
                                            </div>
                                        </TableHead>
                                        <TableHead colSpan={2}>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className='border-l'>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <React.Fragment key={i}>
                                            <TableRow>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-6 h-6"/>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center'>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center'>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                            {Array.from({ length: 2 }).map((_, j) => (
                                                <TableRow key={j}>
                                                    <TableCell className='justify-center flex items-center'>
                                                        <Skeleton className='w-4 h-16'/>
                                                    </TableCell>
                                                    <TableCell colSpan={3}>
                                                        <div className='flex items-center justify-center'>
                                                            <Skeleton className="w-full h-4"/>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center justify-center'>
                                                            <Skeleton className="w-16 h-4"/>
                                                        </div>
                                                    </TableCell>
                                                    <TableCell>
                                                        <div className='flex items-center justify-center'>
                                                            <Skeleton className="w-16 h-4"/>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </React.Fragment>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCard>
                    }
                </div>
            </div>
        </>
    )
}

Order.layout = (page : React.ReactNode) => <AppLayout children={page} />