import React from 'react'
import AppLayout from '@/Layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { DateRangePicker } from '@/components/ui/date-range-picker'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Combobox } from '@/components/ui/combobox'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { Skeleton } from '@/components/ui/skeleton'
import { PageProps } from '@/types'
import { Supplier } from '@/types/supplier'
import { Order } from '@/types/order'
import { useToast } from '@/hooks/use-toast'
import axios from 'axios'
import { X } from 'lucide-react'

interface PendingOrderReceiveProps extends PageProps {
    suppliers: Supplier[],
}

export default function PendingOrderReceive() {

    const { toast } = useToast();
    const { suppliers, lastPurchase, today } = usePage<PendingOrderReceiveProps>().props;

    const [selectedSupplier, setSelectedSupplier] = React.useState('')
    const [loading, setLoading] = React.useState(false);
    const [selectedDate, setSelectedDate] = React.useState<any>({
        from: lastPurchase,
        to: today,
    });
    const [data, setData] = React.useState<Order[]>([]);

    const submit = async () => {
        try {
            if (!selectedDate) {
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih range tanggal terlebih dahulu",
                })
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.pending-order-receives-reports'), {
                params: {
                    from: selectedDate.from,
                    to: selectedDate.to,
                    supplier: selectedSupplier
                }
            });

            setTimeout(() => {
                if (response.data.code === 200)
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
        } catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Head title='Laporan Penerimaan Belum Diterima' />
            <div className='w-full'>
                <Header title="Laporan Penerimaan Belum Diterima" subtitle="Halaman ini digunakan untuk melihat penerimaan yang belum diterima" />
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Tanggal Transaksi <span className='text-rose-500'>*</span></Label>
                            <DateRangePicker date={selectedDate} setDate={setSelectedDate} label="Pilih range tanggal transaksi" />
                        </div>
                        <div className='w-full lg:w-5/6 flex flex-col gap-2'>
                            <Label>Supplier</Label>
                            <Combobox
                                options={suppliers.map((supplier) => ({
                                    id: supplier.id.toString(),
                                    name: '[ ' + supplier.code + ' ] ' + ' - ' + supplier.name
                                }))}
                                placeholder={"Pilih Supplier"}
                                value={selectedSupplier}
                                setValue={(e) => setSelectedSupplier(e)}
                                message='supplier'
                            />
                        </div>
                        <div className='flex flex-row gap-2'>
                            {selectedSupplier &&
                                <Button className='mt-5' size={'input'} variant={'destructive'} onClick={() => setSelectedSupplier('')}>
                                    <X />
                                </Button>
                            }
                            <Button className='mt-5' size={'input'} type='submit' onClick={submit}>
                                Tampilkan Laporan
                            </Button>
                        </div>
                    </div>
                    {!loading ?
                        data.length > 0 && (
                            <>
                                <TableCard className='mt-6'>
                                    <Table>
                                        <TableHeader>
                                            <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                                <TableHead rowSpan={2} className="w-[10px] text-center">No</TableHead>
                                                <TableHead rowSpan={2} className='text-center'>Nomor Faktur Pembelian</TableHead>
                                                <TableHead rowSpan={2} className='text-center'>Tanggal Pembelian</TableHead>
                                                <TableHead colSpan={2}>Supplier</TableHead>
                                                <TableHead rowSpan={2} className='text-center'>Jumlah Item</TableHead>
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
                                                    <TableRow>
                                                        <TableCell className="text-center">{reportIndex + 1}</TableCell>
                                                        <TableCell className='text-center'>{report.order_code}</TableCell>
                                                        <TableCell className='text-center'>{report.order_date}</TableCell>
                                                        <TableCell>{report.supplier.code}</TableCell>
                                                        <TableCell>{report.supplier.name}</TableCell>
                                                        <TableCell className='text-center'>
                                                            {report.order_details_count}
                                                        </TableCell>
                                                        <TableCell className='text-end'>
                                                            <sup>Rp</sup> {report.total_amount}
                                                        </TableCell>
                                                    </TableRow>
                                                </React.Fragment>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableCard>
                            </>
                        ) :
                        <TableCard className='mt-6'>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead rowSpan={2} className='w-[10px]'>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-6 h-6" />
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead colSpan={2}>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead rowSpan={2}>
                                            <div className='flex items-center justify-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                    </TableRow>
                                    <TableRow>
                                        <TableHead className='border-l'>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-20 h-4" />
                                            </div>
                                        </TableHead>
                                        <TableHead>
                                            <div className='flex items-center'>
                                                <Skeleton className="w-20 h-4" />
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
                                                        <Skeleton className="w-6 h-6" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-20 h-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-20 h-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center'>
                                                        <Skeleton className="w-12 h-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center'>
                                                        <Skeleton className="w-20 h-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-center'>
                                                        <Skeleton className="w-20 h-4" />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <div className='flex items-center justify-end'>
                                                        <Skeleton className="w-20 h-4" />
                                                    </div>
                                                </TableCell>
                                            </TableRow>
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

PendingOrderReceive.layout = (page: React.ReactNode) => <AppLayout children={page} />
