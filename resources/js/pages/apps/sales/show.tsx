import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { PageProps } from '@/types'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableCard } from '@/components/ui/table'
import { Calendar, User, CreditCard } from 'lucide-react'
import { Separator } from '@/components/ui/separator'
import { Sale } from '@/types/sale'

interface ShowProps extends PageProps {
    sale: Sale
}

export default function Show() {

    const { sale } = usePage<ShowProps>().props

    return (
        <>
            <Head title='Detail Pembelian'/>
            <div className='w-full'>
                <Header title="Detail Pembelian" subtitle="Halaman ini digunakan untuk melihat detail pembelian"/>
                <div className='p-6'>
                    <Card className="shadow-lg">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">Faktur Penjualan</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Detail transaksi penjualan barang
                                    </p>
                                </div>
                                <div className="text-end">
                                    <div className="bg-primary/5 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Nomor Invoice</p>
                                        <p className="text-2xl font-bold tracking-tight text-primary">
                                            #{sale.sale_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-8" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Detail Penjualan</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <User className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Pelanggan</p>
                                                <p className="text-sm text-muted-foreground capitalize">{sale.customer}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Tanggal penjualan</p>
                                                <p className="text-sm text-muted-foreground">{sale.sale_date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CreditCard className="size-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Metode Pembayaran</p>
                                                <p className="text-sm text-muted-foreground">{sale.payment_method}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-8" />
                            <TableCard>
                                <Table>
                                    <TableHeader>
                                        <TableRow className="bg-muted/50 divide-muted/50">
                                            <TableHead className="w-[50px] text-center">No.</TableHead>
                                            <TableHead>Produk</TableHead>
                                            <TableHead>Variant</TableHead>
                                            <TableHead className="text-center">Kuantitas</TableHead>
                                            <TableHead className="text-start">Harga/Satuan</TableHead>
                                            <TableHead className="text-start">Total</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {sale.sale_details.map((item, index) => (
                                            <TableRow key={index} className='hover:bg-transparent'>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>{item.product_unit.product.name}</TableCell>
                                                <TableCell>{item.product_unit.name} {item.product_unit.unit.name}</TableCell>
                                                <TableCell className="text-center">{item.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    <sup>Rp</sup> {item.price}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <sup>Rp</sup> {item.total_price}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className='bg-muted/50 divide-muted/50'>
                                            <TableCell colSpan={5} className="text-right font-medium">Total Harga</TableCell>
                                            <TableCell className="text-right font-medium">
                                                <sup>Rp</sup> {sale.total_amount}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCard>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />