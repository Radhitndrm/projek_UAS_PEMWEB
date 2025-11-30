import React, { useEffect } from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from '@/components/header'
import { Select, SelectValue, SelectContent, SelectItem, SelectTrigger } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { PageProps } from '@/types'
import { Combobox } from '@/components/ui/combobox'
import { Button } from '@/components/ui/button'
import { ProductUnit } from '@/types/product-unit'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableCell } from '@/components/ui/table'
import { useToast } from '@/hooks/use-toast'
import { Barcode, Box, FileText, Package, Tags } from 'lucide-react';
import axios from 'axios'
import { Product } from '@/types/product';

interface CardStockProps extends PageProps {
    months: [
        { value: string, label: string}
    ],
    years: [],
    products: Product[],
}

interface ReportDetail {
    in: number;
    out: number;
    expired: number;
    retur: number;
    stock: number;
}

interface ReportDataItem {
    date: string;
    detail: ReportDetail;
}

interface ReportsData {
    month: string;
    year: string;
    product: {
        product: { sku: string; name: string; category: { name: string } };
        unit: { name: string };
        barcode: string;
        name: string;
    };
    lastMonthStock: string;
    total: {
        in: number;
        out: number;
        expired: number;
        retur: number;
        stock: number;
    };
    data: ReportDataItem[];
}

export default function CardStock() {

    const { toast } = useToast()
    const { months, products, years } = usePage<CardStockProps>().props;

    const [loading, setLoading] = React.useState(false);
    const [units, setUnits] = React.useState<ProductUnit[]>([]);
    const [selectedMonth, setSelectedMonth] = React.useState<string>('');
    const [selectedYear, setSelectedYear] = React.useState<string>('');
    const [selectedProduct, setSelectedProduct] = React.useState<string>('');
    const [selectedUnit, setSelectedUnit] = React.useState<string>('');
    const [reportsData, setReportsData] = React.useState<ReportsData>({
        month: '',
        year: '',
        product: {
            product: { sku: '', name: '', category: { name: '' } },
            unit: { name: '' },
            barcode: '',
            name: '',
        },
        lastMonthStock: '',
        total: {
            in: 0,
            out: 0,
            expired: 0,
            retur: 0,
            stock: 0,
        },
        data: [],
    });

    const handleProductChange = async (product: string) => {
        try {
            const response = await axios.get(route('apps.products.get-product-units', product));
            setUnits(response.data.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        if (selectedProduct) {
            handleProductChange(selectedProduct);
        }
    }, [selectedProduct]);

    const submit = async () => {
        try{
            if(!selectedMonth || !selectedYear || !selectedProduct || !selectedUnit){
                toast({
                    variant: 'destructive',
                    title: "Error",
                    description: "Silahkan pilih bulan, tahun dan produk terlebih dahulu.",
                })
                return;
            }

            setLoading(true);

            const response = await axios.get(route('apps.reports.card-stocks-reports'), {
                params: {
                    selectedMonth: selectedMonth,
                    selectedYear: selectedYear,
                    selectedProduct: selectedUnit,
                }
            });

            setTimeout(() => {
                toast({
                    'variant': 'success',
                    'title': 'Success',
                    'description': 'Data berhasil ditemukan!',
                })
                setReportsData(response.data.data);
                setLoading(false);
            }, 2000)
        }catch(e){
            console.log(e);
        }
    }

    return (
        <>
            <Head title='Laporan Kartu Stok'/>
            <div className='w-full'>
                <Header title='Laporan Kartu Stok' subtitle='Halaman ini digunakan untuk melihat laporan kartu stok'/>
                <div className='p-6'>
                    <div className='flex flex-col lg:flex-row gap-4'>
                        <div className='flex flex-row gap-4'>
                            <div className='w-1/2 lg:w-full flex flex-col gap-2'>
                                <Label>Bulan <span className='text-rose-500'>*</span></Label>
                                <Select value={selectedMonth} onValueChange={(e) => setSelectedMonth(e)}>
                                    <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                        <SelectValue placeholder="Pilih Bulan"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {months.map((month, index) => (
                                            <SelectItem key={index} value={month.value}>
                                                {month.label}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className='w-1/2 lg:w-full flex flex-col gap-2'>
                                <Label>Tahun <span className='text-rose-500'>*</span></Label>
                                <Select value={selectedYear} onValueChange={(e) => setSelectedYear(e)}>
                                    <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                        <SelectValue placeholder="Pilih Tahun"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        {years.map((year, index) => (
                                            <SelectItem key={index} value={year}>
                                                {year}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                        <div className='w-full lg:w-5/6 flex flex-col gap-2'>
                            <Label>Produk <span className='text-rose-500'>*</span></Label>
                            <Combobox
                                options={products.map((product) => ({
                                    id: product.id.toString(),
                                    name: product.name
                                }))}
                                placeholder={"Pilih Produk"}
                                value={selectedProduct}
                                setValue={(e) => setSelectedProduct(e)}
                            />
                        </div>
                        <div className='w-full lg:w-1/6 flex flex-col gap-2'>
                            <Label>Pilih Variant <span className='text-rose-500'>*</span></Label>
                            <Select value={selectedUnit} onValueChange={(e) => setSelectedUnit(e)} disabled={units.length === 0}>
                                <SelectTrigger className="w-full focus:ring-1 focus:ring-indigo-500">
                                    <SelectValue placeholder="Pilih Variant Produk"/>
                                </SelectTrigger>
                                <SelectContent>
                                    {units.map((unit, index) => (
                                        <SelectItem key={index} value={unit.id.toString()}>
                                            {unit.name} {unit.unit.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button className='mt-5' type='submit' disabled={loading} onClick={submit}>
                            Tampilkan Laporan
                        </Button>
                    </div>
                    {!loading ?
                        reportsData.data?.length > 0 && (
                        <>
                            <div className="py-6">
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-br from-card to-background rounded-md border shadow-sm">
                                    <div className="p-6 md:p-8 border-b">
                                        <div className="flex items-center gap-4">
                                        <div className="p-3 bg-primary/10 rounded-xl">
                                            <Package className="h-8 w-8 text-primary" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-bold tracking-tight">{reportsData.product.product.name}</h2>
                                            <p className="text-muted-foreground">Informasi detail produk</p>
                                        </div>
                                        </div>
                                    </div>
                                    <div className="p-6 md:p-8">
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                            <div className="mt-1">
                                                <FileText className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">SKU</p>
                                                <p className="text-base font-semibold mt-1">{reportsData.product.product.sku}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                            <div className="mt-1">
                                                <Barcode className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Barcode</p>
                                                <p className="text-base font-semibold mt-1">{reportsData.product.barcode}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                            <div className="mt-1">
                                                <Box className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Variant</p>
                                                <p className="text-base font-semibold mt-1">{reportsData.product.name} {reportsData.product.unit.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                            <div className="mt-1">
                                                <Tags className="h-5 w-5 text-primary" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-muted-foreground">Kategori</p>
                                                <p className="text-base font-semibold mt-1">{reportsData.product.product.category.name}</p>
                                            </div>
                                        </div>
                                        </div>
                                    </div>
                                    </div>
                                    <TableCard className='mt-6'>
                                        <Table>
                                            <TableHeader>
                                                <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                                    <TableHead className="w-[10px] text-center">Tanggal</TableHead>
                                                    <TableHead className='text-center'>Masuk</TableHead>
                                                    <TableHead className='text-center'>Keluar</TableHead>
                                                    <TableHead className='text-center'>Sisa</TableHead>
                                                </TableRow>
                                                <TableRow>
                                                    <TableHead colSpan={3}>Sisa Stok Bulan Lalu</TableHead>
                                                    <TableHead className='text-center font-semibold'>{reportsData.lastMonthStock ?? 0}</TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {reportsData.data.map((report, index) => (
                                                    <TableRow key={index}>
                                                        <TableCell className='text-center'>{report.date}</TableCell>
                                                        <TableCell className='text-center'>{report.detail.in > 0 ? report.detail.in : '-'}</TableCell>
                                                        <TableCell className='text-center'>{report.detail.out > 0 ? report.detail.out : '-'}</TableCell>
                                                        <TableCell className='text-center'>{report.detail.stock > 0 ? report.detail.stock : '-'}</TableCell>
                                                    </TableRow>
                                                ))}
                                                <TableRow className='hover:bg-transparent bg-gray-100/50 dark:bg-gray-900/50'>
                                                    <TableCell className="text-center font-semibold">
                                                        TOTAL
                                                    </TableCell>
                                                    <TableCell className='text-center'>
                                                        {reportsData.total.in > 0 ? reportsData.total.in : '-'}
                                                    </TableCell>
                                                    <TableCell className='text-center'>
                                                        {reportsData.total.out > 0 ? reportsData.total.out : '-'}
                                                    </TableCell>
                                                    <TableCell className='text-center'>
                                                        {reportsData.total.stock > 0 ? reportsData.total.stock : '-'}
                                                    </TableCell>
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableCard>
                                </div>
                            </div>
                        </>
                    ):
                        <>
                            <div className="py-6">
                                <div className="space-y-8">
                                    <div className="bg-gradient-to-br from-card to-background rounded-md border shadow-sm">
                                        <div className="p-6 md:p-8 border-b">
                                            <div className="flex items-center gap-4">
                                                <div className="p-3 bg-primary/10 rounded-xl">
                                                    <Skeleton className="h-8 w-8 bg-primary/10" />
                                                </div>
                                                <div>
                                                    <Skeleton className="w-36 h-6 bg-primary/10" />
                                                    <Skeleton className="w-24 h-4 mt-2 bg-muted-foreground" />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-6 md:p-8">
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                                    <div className="mt-1">
                                                        <Skeleton className="h-5 w-5 bg-primary/10" />
                                                    </div>
                                                    <div>
                                                        <Skeleton className="w-16 h-4 bg-muted-foreground" />
                                                        <Skeleton className="w-20 h-6 mt-1 bg-primary/10" />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                                    <div className="mt-1">
                                                        <Skeleton className="h-5 w-5 bg-primary/10" />
                                                    </div>
                                                    <div>
                                                        <Skeleton className="w-16 h-4 bg-muted-foreground" />
                                                        <Skeleton className="w-20 h-6 mt-1 bg-primary/10" />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                                    <div className="mt-1">
                                                        <Skeleton className="h-5 w-5 bg-primary/10" />
                                                    </div>
                                                    <div>
                                                        <Skeleton className="w-16 h-4 bg-muted-foreground" />
                                                        <Skeleton className="w-20 h-6 mt-1 bg-primary/10" />
                                                    </div>
                                                </div>
                                                <div className="flex items-start gap-4 p-4 rounded-lg bg-primary/5 transition-colors hover:bg-primary/10">
                                                    <div className="mt-1">
                                                        <Skeleton className="h-5 w-5 bg-primary/10" />
                                                    </div>
                                                    <div>
                                                        <Skeleton className="w-16 h-4 bg-muted-foreground" />
                                                        <Skeleton className="w-20 h-6 mt-1 bg-primary/10" />
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <TableCard className='mt-6'>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[10px]">
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
                                            <TableHead>
                                                <div className='flex items-center justify-center'>
                                                    <Skeleton className="w-16 h-4"/>
                                                </div>
                                            </TableHead>
                                            <TableHead className="whitespace-nowrap">
                                                <div className='flex items-center justify-center'>
                                                    <Skeleton className="w-16 h-4"/>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                        <TableRow>
                                            <TableHead colSpan={5}>
                                                <Skeleton className="w-36 h-4"/>
                                            </TableHead>
                                            <TableHead>
                                                <div className='flex items-center justify-center'>
                                                    <Skeleton className="w-16 h-4"/>
                                                </div>
                                            </TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {Array.from({ length: 31 }).map((_, i) => (
                                            <TableRow key={i}>
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
                                    </TableBody>
                                </Table>
                            </TableCard>
                        </>
                    }
                </div>
            </div>
        </>
    )
}

CardStock.layout = (page : React.ReactNode) => <AppLayout children={page} />