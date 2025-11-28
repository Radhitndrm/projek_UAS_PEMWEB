import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import hasAnyPermission from '@/utils/has-permissions'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableEmpty, TableFilter, TableCell } from '@/components/ui/table'
import { ActionButton } from '@/components/action-button'
import { Supplier, SupplierLink } from '@/types/supplier'
import { PageProps } from '@/types'
import { ModalDelete } from '@/components/modal-delete'
import PagePagination from '@/components/page-pagination'

interface IndexProps extends PageProps {
    suppliers : {
        data: Supplier[],
        links: SupplierLink[],
        current_page: number,
        per_page: number,
    },
    currentPage: number,
    perPage: number,
}

export default function Index() {

    const { suppliers, currentPage, perPage } = usePage<IndexProps>().props

    const [modalDelete, setModalDelete] = React.useState(false)
    const {data, setData} = useForm({
        id: 0
    });

    const handleModalDelete = (supplier: Supplier) => {
        setModalDelete(true)
        setData(preveData => ({
            ...preveData,
            id: supplier.id
        }))
    }

    return (
        <>
            <Head title='Supplier'/>
            <div className='w-full'>
                <Header title='Supplier' subtitle='Halaman ini digunakan untuk mengelola data supplier'>
                    {hasAnyPermission(['suppliers-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.suppliers.create')}>
                                <PlusCircle className="size-4"/> <span className="hidden sm:inline-flex">Tambah Data Supplier</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className='p-6'>
                    <TableFilter
                        withFilterPage
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route('apps.suppliers.index')}
                        placeholder="Cari data supplier berdasarkan nama supplier atau kode supplier"
                    />
                    <TableCard className='mt-6'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead>Kode Supplier</TableHead>
                                    <TableHead>Nama Supplier</TableHead>
                                    <TableHead>Email</TableHead>
                                    <TableHead>Telp</TableHead>
                                    <TableHead>Alamat</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {suppliers.data.length === 0 ? (
                                    <TableEmpty colSpan={7} message='Data supplier'/>
                                ) : (
                                    suppliers.data.map((supplier, index) => (
                                        <TableRow key={supplier.id}>
                                            <TableCell className="text-center">{++index + + (suppliers.current_page - 1) * suppliers.per_page}</TableCell>
                                            <TableCell>{supplier.code}</TableCell>
                                            <TableCell>{supplier.name}</TableCell>
                                            <TableCell>{supplier.email}</TableCell>
                                            <TableCell>{supplier.phone}</TableCell>
                                            <TableCell>{supplier.address}</TableCell>
                                            <TableCell className="text-center">
                                                {(hasAnyPermission(['suppliers-update']) || hasAnyPermission(['suppliers-delete'])) &&
                                                    <ActionButton
                                                        permissionPrefix="suppliers"
                                                        actionDelete={() => handleModalDelete(supplier)}
                                                        actionEditHref={route('apps.suppliers.edit', supplier.id)}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete open={modalDelete} onOpenChange={setModalDelete} url={route('apps.suppliers.destroy', data.id)}/>
                    <PagePagination data={suppliers}/>
                </div>
            </div>
        </>
    )
}

Index.layout = (page : React.ReactNode) => <AppLayout children={page} />
