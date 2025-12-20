import { Link } from '@inertiajs/react';

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

export const Pagination = ({ products }: { products: PaginationData }) => {
    return (
        <div className='flex items-center justify-between mt-4'>
            <p>Showing <strong>{products.from}</strong> to <strong>{products.to}</strong> of <strong>{products.total}</strong> products</p>

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
