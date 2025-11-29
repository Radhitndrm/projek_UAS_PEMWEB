import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardContent } from '@/components/ui/card'
import { PageProps } from '@/types'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableCard } from '@/components/ui/table'
import { Check, Phone, Mail, Calendar, Tag, NotebookPen, Truck, Building, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/hooks/use-toast'
import { OrderReceive } from '@/types/order-receive'
import hasAnyPermission from '@/utils/has-permissions'

interface ShowProps extends PageProps {
    orderReceive: OrderReceive
}

export default function Show() {

    const { toast } = useToast();

    const { orderReceive } = usePage<ShowProps>().props

    const { post, processing } = useForm({
        _method: 'put',
    });

    const updateStatus = (status : string) => {
        post(route('apps.order-receives.update-status', [orderReceive.id, status]),{
            onSuccess: () => {
                toast({
                    'variant': 'success',
                    'title': 'Success',
                    'description': 'Data berhasil disimpan!',
                })
            }
        });
    }

    return (
        <>
            <Head title='Detail Penerimaan Pembelian'/>
            <div className='w-full'>
                <Header title="Detail Penerimaan Pembelian" subtitle="Halaman ini digunakan untuk melihat detail penerimaan pembelian"/>
                <div className='p-6'>
                    <Card className="shadow-lg">
                        <CardContent className="p-8">
                            <div className="flex flex-wrap justify-between items-start gap-4">
                                <div className="space-y-1">
                                    <h2 className="text-2xl font-bold tracking-tight">Faktur Penerimaan Pembelian</h2>
                                    <p className="text-sm text-muted-foreground">
                                        Detail transaksi penerimaan pembelian
                                    </p>
                                </div>
                                <div className="text-end">
                                    <div className="bg-primary/5 rounded-lg p-4">
                                        <p className="text-sm text-muted-foreground">Nomor Penerimaan</p>
                                        <p className="text-2xl font-bold tracking-tight text-primary">
                                            #{orderReceive.receive_code}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <Separator className="my-8" />
                            <div className="grid md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Informasi Supplier</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <NotebookPen className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Kode Supplier</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.supplier.code}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Truck className="h-4 w-4 text-muted-foreground"/>
                                            <div>
                                                <p className="text-sm font-medium">Nama Supplier</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.supplier.name}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Mail className="h-4 w-4 text-muted-foreground"/>
                                            <div>
                                                <p className="text-sm font-medium">Email Supplier</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.supplier.email}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone className="h-4 w-4 text-muted-foreground"/>
                                            <div>
                                                <p className="text-sm font-medium">Telp Supplier</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.supplier.telp ?? '-'}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Building className="h-4 w-4 text-muted-foreground"/>
                                            <div>
                                                <p className="text-sm font-medium">Alamat Supplier</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.supplier.address}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Detail Pembelian</h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Tanggal Penerimaan</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.receive_date}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Nomor Faktur Pembelian</p>
                                                <p className="text-sm text-muted-foreground">{orderReceive.order.order_code}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Tag className="size-4 text-muted-foreground" />
                                            <div>
                                                <p className="text-sm font-medium">Status Penerimaan</p>
                                                <Badge variant={orderReceive.status == 'success' ? 'default' : 'destructive'}>{orderReceive.status}</Badge>
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
                                            <TableHead className='w-[400px]'>Produk</TableHead>
                                            <TableHead>Variant</TableHead>
                                            <TableHead className="text-center">Kuantitas</TableHead>
                                            <TableHead className="text-right">Harga/Satuan</TableHead>
                                            <TableHead className="text-right">Total Harga</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {orderReceive.order_receive_details.map((item, index) => (
                                            <TableRow key={index} className='hover:bg-transparent'>
                                                <TableCell className="text-center">{index + 1}</TableCell>
                                                <TableCell>{item.order_detail.product_unit.product.name}</TableCell>
                                                <TableCell>{item.order_detail.product_unit.name} {item.order_detail.product_unit.unit.name}</TableCell>
                                                <TableCell className="text-center">{item.order_detail.quantity}</TableCell>
                                                <TableCell className="text-right">
                                                    <sup>Rp</sup> {item.order_detail.formatted_price}
                                                </TableCell>
                                                <TableCell className="text-right font-medium">
                                                    <sup>Rp</sup> {item.order_detail.total_price}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow className='bg-muted/50 divide-muted/50'>
                                            <TableCell colSpan={5} className="text-right font-medium">Total Harga</TableCell>
                                            <TableCell className="text-right font-medium">
                                                <sup>Rp</sup> {orderReceive.order.total_amount}
                                            </TableCell>
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableCard>
                            {hasAnyPermission(['order-receives-verification']) &&
                                <div className="mt-8 flex items-center justify-end gap-4">
                                    <Button variant="default" type='button' onClick={() => updateStatus('success')} disabled={processing || orderReceive.status == 'cancel' || orderReceive.status == 'success'}>
                                        <Check/> Setujui
                                    </Button>
                                </div>
                            }
                        </CardContent>
                    </Card>
                </div>
            </div>
        </>
    )
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />