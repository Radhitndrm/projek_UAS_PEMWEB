import React from 'react'
import { Header } from '@/components/header'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '@/layouts/app-layout'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableEmpty, TableFilter, TableCell } from '@/components/ui/table'
import { ActionButton } from '@/components/action-button'
import { PageProps } from '@/types'
import PagePagination from '@/components/page-pagination'
import { Sale, SaleLink } from '@/types/sale'
import hasAnyPermission from '@/utils/has-permissions'

interface IndexProps extends PageProps {
    sales: {
        data: Sale[],
        links: SaleLink[],
        current_page: number,
        per_page: number,
    }
    currentPage: number;
    perPage: number;
}

export default function Index() {
    const { currentPage, perPage, sales } = usePage<IndexProps>().props

    return (
        <>
            <Head title='Penjualan'/>
            <div className='w-full'>
                <Header title='Penjualan' subtitle='Halaman ini digunakan untuk mengelola data penjualan'>
                    {hasAnyPermission(['sales-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.sales.create')}>
                                <PlusCircle className="size-4"/> <span className="hidden sm:inline-flex">Tambah Data Penjualan</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className='p-6'>
                    <TableFilter
                        withFilterPage
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route('apps.sales.index')}
                        placeholder="Cari data penjualan berdasarkan nomor invoice, tanggal penjualan atau nama pelanggan"
                    />
                    <TableCard className='mt-6'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead>Nomor Invoice</TableHead>
                                    <TableHead>Tanggal Penjualan</TableHead>
                                    <TableHead>Pelanggan</TableHead>
                                    <TableHead>Metode Pembayaran</TableHead>
                                    <TableHead>Total Penjualan</TableHead>
                                    <TableHead>Dibuat Oleh</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {sales.data.length === 0 ? (
                                    <TableEmpty colSpan={8} message='Data penjualan'/>
                                ) : (
                                    sales.data.map((sale, index) => (
                                        <TableRow key={sale.id}>
                                            <TableCell className="text-center">{++index + + (sales.current_page - 1) * sales.per_page}</TableCell>
                                            <TableCell>{sale.sale_code}</TableCell>
                                            <TableCell>{sale.sale_date}</TableCell>
                                            <TableCell className='capitalize'>{sale.customer}</TableCell>
                                            <TableCell>{sale.payment_method}</TableCell>
                                            <TableCell className='text-right'>
                                                <sup>Rp</sup> {sale.formated_amount}
                                            </TableCell>
                                            <TableCell>
                                                {sale.user.name}
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {hasAnyPermission(['sales-show']) &&
                                                    <ActionButton
                                                        permissionPrefix="sales"
                                                        withDetail={true}
                                                        actionDetailHref={route('apps.sales.show', sale.id)}
                                                        withDelete={false}
                                                        withEdit={false}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <PagePagination data={sales}/>
                </div>
            </div>
        </>
    )
}

Index.layout = (page : React.ReactNode) => <AppLayout children={page} />