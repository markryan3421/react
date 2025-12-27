import { Link } from '@inertiajs/react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface LinkProps {
    // From links array 
    active: boolean;
    label: string;
    url: string | null;
}

interface PaginationData {
    links: LinkProps[];
    from: number;
    to: number;
    total: number;
}

interface PaginationProps {
    products: PaginationData;
    perPage: string;
    onPerPageChange: (value: string) => void;
}

export const Pagination = ({ products, perPage, onPerPageChange }: PaginationProps) => {
    console.log('Per page:', perPage);

    return (
        <div className='flex items-center justify-between mt-4'>
            <p>Showing <strong>{products.from}</strong> to <strong>{products.to}</strong> of <strong>{products.total}</strong> products</p>

            <div className='flex items-center gap-2'>
                <span className='text-sm'>Rows per page:</span>

                <Select onValueChange={onPerPageChange} value={perPage}>
                    <SelectTrigger className='w-[90px]'>
                        <SelectValue placeholder='Row' />
                    </SelectTrigger>

                    <SelectContent>
                        <SelectItem value='5'>5</SelectItem>
                        <SelectItem value='10'>10</SelectItem>
                        <SelectItem value='25'>25</SelectItem>
                        <SelectItem value='50'>50</SelectItem>
                        <SelectItem value='100'>100</SelectItem>
                        <SelectItem value='-1'>All</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className='flex gap-2'>
                {products.links.map((link, index) => (
                    <Link
                        className={`px-2 py-1 border rounded ${link.active ? 'bg-blue-500 text-white' : ''}`}
                        href={link.url || '#'}
                        key={index}
                        dangerouslySetInnerHTML={{ __html: link.label }}
                    />
                ))}
            </div>
        </div>
    )
}
