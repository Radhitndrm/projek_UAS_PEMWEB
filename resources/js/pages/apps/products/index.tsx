import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, Link, useForm, usePage } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import hasAnyPermission from '@/utils/has-permissions'
import { Table, TableCard, TableBody, TableHead, TableHeader, TableRow, TableEmpty, TableFilter, TableCell } from '@/components/ui/table'
import { ActionButton } from '@/components/action-button'
import { Product, ProductLink } from '@/types/product'
import { Category } from '@/types/category'
import { PageProps } from '@/types'
import { ModalDelete } from '@/components/modal-delete'
import PagePagination from '@/components/page-pagination'

interface IndexProps extends PageProps {
    products: {
        data: Product[],
        links: ProductLink[],
        current_page: number,
        per_page: number,
    }
    categories: Category[]
    currentPage: number;
    perPage: number;
}

export default function Index() {

    const { products, currentPage, perPage, categories } = usePage<IndexProps>().props

    const [modalDelete, setModalDelete] = React.useState(false)
    const { data, setData } = useForm({
        id: 0,
    })

    const handleModalDelete = (product: Product) => {
        setModalDelete(true)
        setData(prevData => ({
            ...prevData,
            id: product.id,
        }))
    }

    return (
        <>
            <Head title='Produk' />
            <div className='w-full'>
                <Header title='Produk' subtitle='Halaman ini digunakan untuk mengelola data produk'>
                    {hasAnyPermission(['products-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.products.create')}>
                                <PlusCircle className="size-4" /> <span className="hidden sm:inline-flex">Tambah Data Produk</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className='p-6'>
                    <TableFilter
                        withFilterPage
                        currentPage={currentPage}
                        perPage={perPage}
                        optionsCategory={categories}
                        withFilterCategory
                        url={route('apps.products.index')}
                        placeholder="Cari data produk berdasarkan nama produk atau sku produk"
                    />
                    <TableCard className='mt-6'>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[10px] text-center">No</TableHead>
                                    <TableHead className="w-[80px] text-center">Gambar</TableHead>
                                    <TableHead className="w-[120px]">SKU</TableHead>
                                    <TableHead>Nama Produk</TableHead>
                                    <TableHead>Kategori</TableHead>
                                    <TableHead className="w-[10px]">Aksi</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {products.data.length === 0 ? (
                                    <TableEmpty colSpan={6} message='Data produk' />
                                ) : (
                                    products.data.map((product, index) => (
                                        <TableRow key={product.id}>
                                            <TableCell className="text-center">{++index + (products.current_page - 1) * products.per_page}</TableCell>

                                            {/* Gambar Produk */}
                                            <TableCell className="text-center">
                                                <img
                                                    src={
                                                        product.image
                                                            ? `/storage/${product.image}`
                                                            : `/images/no-image.png`
                                                    }
                                                    alt={product.name}
                                                    className="w-12 h-12 object-cover rounded-md mx-auto border"
                                                />
                                            </TableCell>

                                            <TableCell>{product.sku}</TableCell>
                                            <TableCell>{product.name}</TableCell>
                                            <TableCell>{product.category.name}</TableCell>

                                            <TableCell className="text-center">
                                                {(hasAnyPermission(['products-update']) ||
                                                    hasAnyPermission(['products-delete']) ||
                                                    hasAnyPermission(['products-show'])) && (
                                                        <ActionButton
                                                            permissionPrefix="products"
                                                            withDetail
                                                            actionDelete={() => handleModalDelete(product)}
                                                            actionEditHref={route('apps.products.edit', product.id)}
                                                            actionDetailHref={route('apps.products.show', product.id)}
                                                        />
                                                    )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </TableCard>
                    <ModalDelete open={modalDelete} onOpenChange={setModalDelete} url={route('apps.products.destroy', data.id)} />
                    <PagePagination data={products} />
                </div>
            </div>
        </>
    )
}

Index.layout = (page: React.ReactNode) => <AppLayout children={page} />
