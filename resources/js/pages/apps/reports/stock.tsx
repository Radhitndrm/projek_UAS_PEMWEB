import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from '@/components/header'
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Category } from '@/types/category';
import DatePicker from '@/components/ui/date-picker';
import axios from 'axios'

interface StockProps extends PageProps {
    categories: Category[],
}

interface ProductDetail {
    sku: string;
    barcode: string;
    category: string;
    name: string;
    product_unit: string;
    remaining_stock: number;
}

interface Product {
    name: string;
    details: ProductDetail[];
}

interface ReportDataWraper {
    category: string;
    date: string;
    products: Product[];
}

export default function Stock() {

    const { toast } = useToast()
    const { categories } = usePage<StockProps>().props;

    const [loading, setLoading] = React.useState(false);
    const [selectedCategory, setSelectedCategory] = React.useState<string>('');
    const [selectedDate, setSelectedDate] = React.useState<string>('');
    const [reportsData, setReportsData] = React.useState<ReportDataWraper>({
        category: '',
        date: '',
        products: [],
    });

    const submit = async () => {
        try{
            if(!selectedCategory || !selectedDate){
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih tanggal dan kategori terlebih dahulu.",
                })
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.stocks-reports'), {
                params: {
                    selectedCategory: selectedCategory,
                    selectedDate: selectedDate,
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
                setReportsData(response.data.data);
                setLoading(false);
            }, 2000)
        }catch(e){
            console.log(e);
        }
    }

    const subtotal = (data : ProductDetail[]) : number => {
        return data.reduce((sum, item) => sum + item.remaining_stock, 0);
    }

    const grandTotal = (data : Product[]) : number => {
        return data.reduce((grandTotal, item) => {
            const itemTotal = item.details.reduce((sum, detail) => sum + detail.remaining_stock, 0);
            return grandTotal + itemTotal;
        }, 0);
    };

    return (
        <>
            <Head title='Laporan Sisa Stok'/>
            <div className='w-full'>
                <Header title='Laporan Sisa Stok' subtitle='Halaman ini digunakan untuk melihat laporan sisa stok'/>
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Tanggal <span className='text-rose-500'>*</span></Label>
                            <DatePicker date={selectedDate} setDate={setSelectedDate} label='Pilih Tanggal'/>
                        </div>
                        <div className='w-full lg:w-1/3 flex flex-col gap-2'>
                            <Label>Kategori <span className='text-rose-500'>*</span></Label>
                            <Select value={selectedCategory} onValueChange={(e) => setSelectedCategory(e)}>
                                <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                    <SelectValue placeholder="Pilih Kategori Produk"/>
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">
                                        Semua Kategori
                                    </SelectItem>
                                    {categories.map((category, index) => (
                                        <SelectItem key={index} value={category.id.toString()}>
                                            {category.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className='mt-5' type='submit' onClick={submit}>
                            Tampilkan Laporan
                        </Button>
                    </div>
                    {!loading && reportsData.products.length > 0 && (
                            <TableCard className='mt-6'>
                                <Table>
                                    <TableHeader>
                                        <TableRow  className='hover:bg-transparent'>
                                            <TableHead colSpan={5}>Produk</TableHead>
                                        </TableRow>
                                        <TableRow className='hover:bg-transparent bg-white dark:bg-transparent'>
                                            <TableHead className='text-center'>SKU</TableHead>
                                            <TableHead className='text-center'>Barcode</TableHead>
                                            <TableHead className='text-center'>Kategori</TableHead>
                                            <TableHead className='text-center'>Variant</TableHead>
                                            <TableHead className='text-center'>Sisa Stok</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {reportsData.products.map((report, reportIndex) => (
                                            <React.Fragment key={reportIndex}>
                                                <TableRow>
                                                    <TableCell colSpan={5} className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50 capitalize font-semibold text-center'>
                                                        {report.name}
                                                    </TableCell>
                                                </TableRow>
                                                {report.details.map((detail, detailIndex) => (
                                                    <TableRow key={`${reportIndex}-${detailIndex}`}>
                                                        <TableCell>{detail.sku}</TableCell>
                                                        <TableCell>{detail.barcode}</TableCell>
                                                        <TableCell>{detail.category}</TableCell>
                                                        <TableCell>{detail.name} {detail.product_unit}</TableCell>
                                                        <TableCell className="text-center">{detail.remaining_stock}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow>
                                                    <TableCell colSpan={4} className='text-right font-semibold'>Subtotal</TableCell>
                                                    <TableCell className='text-center font-semibold'>{subtotal(report.details)}</TableCell>
                                                </TableRow>
                                            </React.Fragment>
                                        ))}
                                        <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                            <TableCell colSpan={4} className="text-right font-bold">GRAND TOTAL</TableCell>
                                            <TableCell className='text-center font-bold'>{grandTotal(reportsData.products)}</TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCard>
                        )
                    }
                    {
                        loading && (
                            <TableCard className='mt-6'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead colSpan={5}>
                                                <div className='flex items-center'>
                                                    <Skeleton className="w-24 h-4"/>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                            <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                            <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                            <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                            <TableHead><Skeleton className="w-16 h-4"/></TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: 3 }).map((_, i) => (
                                            <TableRow key={i}>
                                                {Array.from({ length: 5 }).map((_, j) => (
                                                    <TableCell key={j}>
                                                        <Skeleton className="w-16 h-4"/>
                                                    </TableCell>
                                                ))}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableCard>
                        )
                    }
                </div>
            </div>
        </>
    )
}

Stock.layout = (page : React.ReactNode) => <AppLayout children={page} />