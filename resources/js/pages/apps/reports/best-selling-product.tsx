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

export default function BestSellingProduct() {
    const { toast } = useToast();
    const { lastSale, today } = usePage().props;

    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<any>({
        from: lastSale,
        to: today,
    });
    const [data, setData] = React.useState<Sale[]>([]);

    const submit = async () => {
        try {
            if (!selectedDate.from || !selectedDate.to) {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih range tanggal terlebih dahulu",
                });
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.best-selling-products-reports'), {
                params: {
                    from: selectedDate.from,
                    to: selectedDate.to,
                }
            });

            setTimeout(() => {
                const code = response.data.code ?? 500;

                if (code === 200) {
                    toast({
                        variant: 'success',
                        title: 'Success',
                        description: 'Data berhasil ditemukan!',
                    });
                } else {
                    toast({
                        variant: 'destructive',
                        title: 'Error',
                        description: response.data.message ?? 'Data tidak ditemukan!',
                    });
                }

                // FIX: jangan pernah setData(null)
                setData(response.data.data ?? []);

                setLoading(false);
            }, 800);
        } catch (e) {
            console.log(e);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Terjadi kesalahan koneksi!',
            });
            setLoading(false);
            setData([]); // fail-safe
        }
    }

    const totalSale = (sale: Sale[]): string => {
        const total = sale.reduce((sum, item) => sum + item.total_revenue, 0);
        return new Intl.NumberFormat('id-ID').format(total);
    };

    return (
        <>
            <Head title='Laporan Produk Terlaris' />
            <div className='w-full'>
                <Header title='Laporan Produk Terlaris' subtitle='Halaman ini digunakan untuk melihat laporan produk terlaris' />
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Tanggal Transaksi <span className='text-rose-500'>*</span></Label>
                            <DateRangePicker date={selectedDate} setDate={setSelectedDate} label="Pilih range tanggal transaksi" />
                        </div>
                        <Button className='mt-5' type="button" onClick={submit}>
                            Tampilkan Laporan
                        </Button>
                    </div>

                    {/* FIX: cek data aman */}
                    {!loading && (data?.length ?? 0) > 0 ? (
                        <TableCard className='mt-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                        <TableHead className="w-[10px] text-center">No</TableHead>
                                        <TableHead>SKU</TableHead>
                                        <TableHead>Barcode</TableHead>
                                        <TableHead>Produk</TableHead>
                                        <TableHead>Variant</TableHead>
                                        <TableHead className='text-center'>Terjual</TableHead>
                                        <TableHead>Harga Jual</TableHead>
                                        <TableHead>Pendapatan</TableHead>
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {data.map((report, i) => (
                                        <TableRow key={i}>
                                            <TableCell className="text-center">{i + 1}</TableCell>
                                            <TableCell>{report.sku}</TableCell>
                                            <TableCell>{report.barcode}</TableCell>
                                            <TableCell>{report.product_name}</TableCell>
                                            <TableCell>{report.unit_name} {report.unit}</TableCell>
                                            <TableCell className='text-center'>{report.total_sale}</TableCell>
                                            <TableCell className='text-right'><sup>Rp</sup> {report.price}</TableCell>
                                            <TableCell className='text-right'><sup>Rp</sup> {report.total_revenue_formatted}</TableCell>
                                        </TableRow>
                                    ))}

                                    <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                        <TableCell colSpan={7} className='text-right font-bold border-t'>
                                            Total Pendapatan
                                        </TableCell>
                                        <TableCell className='text-right font-bold border-t'>
                                            <sup>Rp</sup> {totalSale(data)}
                                        </TableCell>
                                    </TableRow>
                                </TableBody>
                            </Table>
                        </TableCard>

                    ) : !loading ? (
                        <div className="mt-6 text-center text-gray-500">Tidak ada data</div>
                    ) : (
                        <TableCard className='mt-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        {Array.from({ length: 8 }).map((_, i) => (
                                            <TableHead key={i}>
                                                <div className='flex justify-center'>
                                                    <Skeleton className="w-16 h-4" />
                                                </div>
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                </TableHeader>

                                <TableBody>
                                    {Array.from({ length: 4 }).map((_, i) => (
                                        <TableRow key={i}>
                                            {Array.from({ length: 8 }).map((__, j) => (
                                                <TableCell key={j}>
                                                    <div className='flex justify-center'>
                                                        <Skeleton className="w-16 h-4" />
                                                    </div>
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableCard>
                    )}
                </div>
            </div>
        </>
    );
}

BestSellingProduct.layout = (page: React.ReactNode) => <AppLayout children={page} />

