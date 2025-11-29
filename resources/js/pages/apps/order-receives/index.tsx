import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import hasAnyPermission from '@/utils/has-permissions'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableEmpty, TableFilter, TableCell } from '@/components/ui/table'
import { ActionButton } from '@/components/action-button'
import { PageProps } from '@/types'
import { ModalDelete } from '@/components/modal-delete'
import PagePagination from '@/components/page-pagination'
import { OrderReceive, OrderReceiveLink } from '@/types/order-receive'
import { Badge } from '@/components/ui/badge'

interface IndexProps extends PageProps {
    orderReceives: {
        data: OrderReceive[],
        links: OrderReceiveLink[],
        current_page: number,
        per_page: number,
    }
    currentPage: number,
    perPage: number
}

export default function Index() {

    const { orderReceives, currentPage, perPage } = usePage<IndexProps>().props

    const [modalDelete, setModalDelete] = React.useState(false)
    const {data, setData} = useForm({
        id: 0
    })

    const handleModalDelete = (orderReceive: OrderReceive) => {
        setModalDelete(true)
        setData(preveData => ({
            ...preveData,
            id: orderReceive.id
        }))
    }

    return (
        <>
            <Head title='Penerimaan Pembelian'/>
            <div className='w-full'>
                <Header title='Penerimaan Pembelian' subtitle='Halaman ini digunakan untuk mengelola data penerimaan pembelian'>
                    {hasAnyPermission(['order-receives-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.order-receives.create')}>
                                <PlusCircle className="size-4" /> <span className="hidden sm:inline-flex">Tambah Data Penerimaan</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className='p-6'>
                    <TableFilter
                        withFilterPage={true}
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route('apps.order-receives.index')}
                        placeholder="Cari data penerimaaan pembelian berdasarkan nomor penerimaan"
                    />
                    <TableCard className='mt-6'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead>Nomor Penerimaan</TableHead>
                                    <TableHead>Nomor Pembelian</TableHead>
                                    <TableHead>Supplier</TableHead>
                                    <TableHead>Tanggal Penerimaan</TableHead>
                                    <TableHead>Jumlah</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {orderReceives.data.length === 0 ? (
                                    <TableEmpty colSpan={8} message='Data penerimaan pembelian' />
                                ) : (
                                    orderReceives.data.map((order, index) => (
                                        <TableRow key={order.id}>
                                            <TableCell className="text-center">{++index + + (orderReceives.current_page - 1) * orderReceives.per_page}</TableCell>
                                            <TableCell>{order.receive_code}</TableCell>
                                            <TableCell>{order.order.order_code}</TableCell>
                                            <TableCell>{order.order.supplier.name}</TableCell>
                                            <TableCell>{order.receive_date}</TableCell>
                                            <TableCell className='text-right'>
                                                <sup>Rp</sup> {order.order.total_amount}
                                            </TableCell>
                                            <TableCell className='capitalize'>
                                                <Badge variant={order.status == 'pending' || order.status == 'cancel' ? 'destructive' : 'default'}>{order.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-center">
                                                {(hasAnyPermission(['order-receives-edit']) || hasAnyPermission(['order-receives-delete']) || hasAnyPermission(['order-receives-show'])) &&
                                                    <ActionButton
                                                        permissionPrefix="order-receives"
                                                        isModal={false}
                                                        withDetail={true}
                                                        actionDelete={() => handleModalDelete(order)}
                                                        actionEditHref={route('apps.order-receives.edit', order.id)}
                                                        actionDetailHref={route('apps.order-receives.show', order.id)}
                                                        withDelete={order.status == 'success' || order.status == 'cancel' ? false : true}
                                                        withEdit={order.status == 'success' || order.status == 'cancel' ? false : true}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete open={modalDelete} onOpenChange={setModalDelete} url={route('apps.order-receives.destroy', data.id)} />
                    <PagePagination data={orderReceives} />
                </div>
            </div>
        </>
    )
}

Index.layout = (page : React.ReactNode) => <AppLayout children={page} />