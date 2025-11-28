import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, usePage, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import hasAnyPermission from '@/utils/has-permissions'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableEmpty, TableFilter, TableCell } from '@/components/ui/table'
import { ActionButton } from '@/components/action-button'
import { Unit, UnitLink } from '@/types/unit'
import { PageProps } from '@/types'
import { ModalDelete } from '@/components/modal-delete'
import PagePagination from '@/components/page-pagination'

interface IndexProps extends PageProps {
    units : {
        data: Unit[],
        links: UnitLink[],
        current_page: number,
        per_page: number,
    }
    currentPage: number,
    perPage: number,
}

export default function Index() {

    const { units, currentPage, perPage } = usePage<IndexProps>().props

    const [modalDelete, setModalDelete] = React.useState(false)
    const {data, setData} = useForm({
        id: 0
    })

    const handleModalDelete = (unit : Unit) => {
        setModalDelete(true)
        setData('id', unit.id)
    }

    return (
        <>
            <Head title='Satuan'/>
            <div className='w-full'>
                <Header title='Satuan' subtitle='Halaman ini digunakan untuk mengelola data satuan'>
                    {hasAnyPermission(['units-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.units.create')}>
                                <PlusCircle className="size-4"/> <span className="hidden sm:inline-flex">Tambah Data Satuan</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className='p-6'>
                    <TableFilter
                        withFilterPage
                        currentPage={currentPage}
                        perPage={perPage}
                        url={route('apps.units.index')}
                        placeholder="Cari data satuan berdasarkan nama satuan"
                    />
                    <TableCard className='mt-6'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead>Nama Satuan</TableHead>
                                    <TableHead>Deskripsi</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {units.data.length === 0 ? (
                                    <TableEmpty colSpan={4} message='Data satuan'/>
                                ) : (
                                    units.data.map((unit, index) => (
                                        <TableRow key={unit.id}>
                                            <TableCell className="text-center">{++index + + (units.current_page - 1) * units.per_page}</TableCell>
                                            <TableCell>{unit.name}</TableCell>
                                            <TableCell>{unit.description}</TableCell>
                                            <TableCell className="text-center">
                                                {(hasAnyPermission(['units-update']) || hasAnyPermission(['units-delete'])) &&
                                                    <ActionButton
                                                        permissionPrefix="units"
                                                        isModal={false}
                                                        actionDelete={() => handleModalDelete(unit)}
                                                        actionEditHref={route('apps.units.edit', unit.id)}
                                                    />
                                                }
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete open={modalDelete} onOpenChange={setModalDelete} url={route('apps.units.destroy', data.id)}/>
                    <PagePagination data={units}/>
                </div>
            </div>
        </>
    )
}

Index.layout = (page : React.ReactNode) => <AppLayout children={page} />