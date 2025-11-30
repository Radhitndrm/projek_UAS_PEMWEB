import { Header } from '@/components/header'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Label } from '@/components/ui/label'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import type { Sale } from '@/types/sale'
import React from 'react'
import axios from 'axios'

export default function Sale() {
    const { toast } = useToast();
    const { lastSale, today } = usePage().props;
    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<any>({
        from: lastSale,
        to: today,
    });
    const [data, setData] = React.useState<Sale[]>([]);

    const submit = async () => {
        try{
            if(!selectedDate.from || !selectedDate.to){
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih range tanggal terlebih dahulu",
                })
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.sales-reports'), {
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

    const totalSale = (sale: Sale[]): string => {
        const total = sale.reduce((sum, item) => sum + item.total_amount, 0);
        return new Intl.NumberFormat('id-ID').format(total);
    };

    return (
        <>
            <Head title='Laporan Penjualan'/>
            <div className='w-full'>
                <Header title='Laporan Penjualan' subtitle='Halaman ini digunakan untuk melihat laporan penjualan'/>
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Tanggal Transaksi <span className='text-rose-500'>*</span></Label>
                            <DateRangePicker date={selectedDate} setDate={setSelectedDate} label="Pilih range tanggal transaksi"/>
                        </div>
                        <Button className='mt-5' type="button" onClick={submit}>
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
                                            <TableHead>Nomor Invoice</TableHead>
                                            <TableHead>Tanggal Penjualan</TableHead>
                                            <TableHead>Pelanggan</TableHead>
                                            <TableHead>Total Penjualan</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {data.map((report, reportIndex) => (
                                            <React.Fragment key={reportIndex}>
                                                <TableRow className='bg-gray-100/50 dark:bg-gray-900/50 border-t'>
                                                    <TableCell className="text-center">{reportIndex + 1}</TableCell>
                                                    <TableCell>{report.sale_code}</TableCell>
                                                    <TableCell>{report.sale_date}</TableCell>
                                                    <TableCell>{report.customer}</TableCell>
                                                    <TableCell className='text-right'>
                                                        <sup>Rp</sup> {report.formatted_amount}
                                                    </TableCell>
                                                </TableRow>
                                                {report.sale_details.map((detail, detailIndex) => (
                                                    <TableRow className='border-none' key={detailIndex}>
                                                        <TableCell></TableCell>
                                                        <TableCell colSpan={2} className={`border-b border-dashed ${detailIndex === report.sale_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            {detail.product_unit.product.name} {detail.product_unit.name} {detail.product_unit.unit.name}
                                                        </TableCell>
                                                        <TableCell className={`border-b border-dashed text-center ${detailIndex === report.sale_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            {detail.quantity} x <sup>Rp</sup> {detail.price}
                                                        </TableCell>
                                                        <TableCell className={`border-b border-dashed text-right ${detailIndex === report.sale_details.length - 1 ? 'border-b-0' : ''}`}>
                                                            <sup>Rp</sup> {detail.total_price}
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                            </React.Fragment>
                                        ))}
                                        <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                            <TableCell colSpan={4} className='text-right font-bold border-t'>
                                                Total Penjualan
                                            </TableCell>
                                            <TableCell className='text-right font-bold border-t'>
                                                <sup>Rp</sup> {totalSale(data)}
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
                                        <TableHead className='w-[10px]'>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-6 h-6"/>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-16 h-4"/>
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center justify-center'>
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
                                                    <TableCell colSpan={2}>
                                                        <div className='flex items-center'>
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

Sale.layout = (page: React.ReactNode) => <AppLayout children={page} />