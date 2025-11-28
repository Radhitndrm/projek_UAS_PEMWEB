import React from 'react'
import AppLayout from '@/layouts/app-layout'
import { Head, usePage, Link, useForm } from '@inertiajs/react'
import { Header } from '@/components/header'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell, TableEmpty } from '@/components/ui/table'
import { PageProps } from '@/types'
import { Button } from '@/components/ui/button'
import { PlusCircle } from 'lucide-react'
import { Product } from '@/types/product'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { ModalDelete } from '@/components/modal-delete'
import { ActionButton } from '@/components/action-button'
import { ProductUnit } from '@/types/product-unit'
import hasAnyPermission from '@/utils/has-permissions'

interface ShowProps extends PageProps {
    product: Product
}

export default function Show() {
    const { product } = usePage<ShowProps>().props

    const [modalDelete, setModalDelete] = React.useState(false)
    const { data, setData } = useForm({
        id: 0,
    })

    const handleModalDelete = (productUnit: ProductUnit) => {
        setModalDelete(true)
        setData(prevData => ({
            ...prevData,
            id: productUnit.id,
        }))
    }

    return (
        <>
            <Head title='Detail Produk' />
            <div className="w-full">
                <Header title="Detail Produk" subtitle="Halaman ini digunakan untuk melihat detail produk">
                    {hasAnyPermission(['product-variants-create']) &&
                        <Button asChild variant='outline'>
                            <Link href={route('apps.product-units.create', product.id)}>
                                <PlusCircle className="size-4" /> <span className="hidden sm:inline-flex">Tambah Variant Produk</span>
                            </Link>
                        </Button>
                    }
                </Header>
                <div className="p-6">
                    <Tabs defaultValue="product">
                        <TabsList>
                            <TabsTrigger value="product">Detail Produk</TabsTrigger>
                            <TabsTrigger value="variant">Variant Produk</TabsTrigger>
                        </TabsList>

                        {/* Detail Produk */}
                        <TabsContent value="product">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Produk</CardTitle>
                                    <CardDescription>Tabel ini digunakan untuk melihat detail produk</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto scrollbar-hide">
                                    <Table>
                                        <TableBody>
                                            <TableRow>
                                                <TableCell className='w-[100px] font-semibold'>Gambar</TableCell>
                                                <TableCell>
                                                    {product.image_url ? (
                                                        <img
                                                            src={product.image_url}
                                                            alt={product.name}
                                                            className="w-32 h-32 object-cover rounded border"
                                                        />
                                                    ) : (
                                                        <span className="text-gray-500 italic">Tidak ada gambar</span>
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='w-[100px] font-semibold'>SKU</TableCell>
                                                <TableCell>{product.sku}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='font-semibold'>Nama</TableCell>
                                                <TableCell>{product.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='font-semibold'>Kategori</TableCell>
                                                <TableCell>{product.category.name}</TableCell>
                                            </TableRow>
                                            <TableRow>
                                                <TableCell className='font-semibold'>Deskripsi</TableCell>
                                                <TableCell>{product.description}</TableCell>
                                            </TableRow>
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        {/* Variant Produk */}
                        <TabsContent value="variant">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Variant Produk</CardTitle>
                                    <CardDescription>Tabel ini berisi informasi variant produk</CardDescription>
                                </CardHeader>
                                <CardContent className="p-0 overflow-x-auto scrollbar-hide">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Gambar</TableHead>
                                                <TableHead>Barcode</TableHead>
                                                <TableHead>Nama Variant</TableHead>
                                                <TableHead>Harga Jual</TableHead>
                                                <TableHead className='w-[100px] text-center'>Stok</TableHead>
                                                <TableHead className="w-[10px] text-center">Aksi</TableHead>
                                            </TableRow>
                                        </TableHeader>

                                        <TableBody>
                                            {product.product_units.length === 0 ?
                                                <TableEmpty colSpan={6} message="Data variant produk" />
                                                :
                                                product.product_units.map((productUnit, index) => (
                                                    <TableRow key={index}>
                                                        {/* Kolom Gambar */}
                                                        <TableCell>
                                                            {productUnit.image_url ? (
                                                                <img
                                                                    src={productUnit.image_url}
                                                                    alt={productUnit.name}
                                                                    className="w-16 h-16 object-cover rounded border"
                                                                />
                                                            ) : (
                                                                <span className="text-gray-500 italic text-xs">Tidak ada</span>
                                                            )}
                                                        </TableCell>
                                                        <TableCell>{productUnit.barcode}</TableCell>
                                                        <TableCell>{productUnit.name} {productUnit.unit.name}</TableCell>
                                                        <TableCell className='text-right'>
                                                            <sup>Rp</sup> {productUnit.price}
                                                        </TableCell>
                                                        <TableCell className='text-center'>{productUnit.stock}</TableCell>
                                                        <TableCell className='text-center'>
                                                            {(hasAnyPermission(['product-variants-update']) || hasAnyPermission(['product-variants-delete'])) &&
                                                                <ActionButton
                                                                    permissionPrefix="product-variants"
                                                                    actionDelete={() => handleModalDelete(productUnit)}
                                                                    actionEditHref={route('apps.product-units.edit', [product.id, productUnit.id])}
                                                                />
                                                            }

                                                            <ModalDelete
                                                                open={modalDelete}
                                                                onOpenChange={setModalDelete}
                                                                url={route('apps.product-units.destroy', data.id)}
                                                            />
                                                        </TableCell>
                                                    </TableRow>
                                                ))}
                                        </TableBody>
                                    </Table>
                                </CardContent>
                            </Card>
                        </TabsContent>

                    </Tabs>
                </div>
            </div>
        </>
    )
}

Show.layout = (page: React.ReactNode) => <AppLayout children={page} />
