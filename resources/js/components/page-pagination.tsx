import React from 'react'
import Pagination from '@/components/ui/pagination'

export default function PagePagination({ data } : { data: any }) {
    return (
        <div className="flex items-center justify-between mt-4 w-full overflow-x-auto gap-10 scrollbar-hide">
            {data.total > 0 &&
                <div className="text-sm text-gray-700 dark:text-gray-400 py-4 whitespace-nowrap">Menampilkan {data.from} sampai {data.to} dari {data.total} data</div>
            }
            {data.last_page !== 1 && <Pagination links={data.links}/>}
        </div>
    )
}