import { Link } from '@inertiajs/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface LinkPagination {
    url: string | null;
    label: string;
    active: boolean;
}

interface PaginationProps {
    links: LinkPagination[]
}
export default function Pagination({ links } : PaginationProps) {
    const style = 'p-2 text-sm border rounded-md bg-white text-gray-500 hover:bg-gray-100 dark:bg-gray-950 dark:text-gray-400 dark:hover:bg-gray-900 dark:border-gray-900'

    return (
        <>
            <ul className="justify-end flex items-center gap-1">
                {links.map((item, i) => {
                    return item.url != null ? (
                        item.label.includes('Previous') ? (
                            <Link className={style} key={i} href={item.url}>
                                <ChevronLeft className='size-4'/>
                            </Link>
                        ) : item.label.includes('Next') ? (
                            <Link className={style} key={i} href={item.url}>
                                <ChevronRight className='size-4'/>
                            </Link>
                        ) : (
                            <Link className={`px-3 py-1.5 text-sm border rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-900 dark:border-gray-900 ${item.active ? 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-50' : 'bg-white dark:bg-gray-950'}`} key={i} href={item.url}>
                                {item.label}
                            </Link>
                        )
                    ) : null;
                })}
            </ul>
        </>
    )
}