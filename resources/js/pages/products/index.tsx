import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { usePage } from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { CirclePlusIcon } from 'lucide-react';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { CustomTable } from '@/components/custom-table';
import { ProductTableConfig } from '@/config/tables/product-table';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Products',
        href: '/products',
    },
];

// Define the Product interface, representing the structure of a product object
// This helps with type-checking and autocompletion in TypeScript
interface Product {
    id: number;
    name: string;
    description: string;
    price: number;
    featured_image: string;
    featured_image_original_name: string;
    created_at: string;
}

// Define the LinkProps interface for pagination links
interface LinkProps {
    // From 'links' array
    active: boolean;
    label: string;
    url: string | null;
}

// Define the ProductPagination interface for paginated product data
interface ProductPagination {
    // This are the list of arrays inside the 'products' object
    data: Product[]; // Array of Product objects
    links: LinkProps[]; // Array of pagination link objects
    from: number;
    to: number;
    total: number;
}

// Define the FilterProps interface for search filters
interface FilterProps {
    search: string;
    perPage: string;
}

// Define the props for the Index component
// Get the 'products' and 'filters' in the form of object array - compacted from the controller
interface IndexProps {
    products: ProductPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ products, filters, totalCount, filteredCount }: IndexProps) {
    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();

    // Destructure 'products' from props, which is an array of Product objects fetched from the controller
    // const { products } = props;
    console.log('Products: ', products);

    // This will display flash message from the backend (success/error)
    const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    const flashMessage = flash?.success || flash?.error;
    const [showAlert, setShowAlert] = useState(flashMessage ? true : false);

    // This function will hide the alert notification after 3 seconds
    useEffect(() => {
        if (flashMessage) {
            const timer = setTimeout(() => setShowAlert(false), 3000);
            return () => clearTimeout(timer);
        }
    }, [flashMessage]);

    // Search form state management using Inertia's useForm hook
    const { data, setData } = useForm({
        search: filters.search || '',
        perPage: filters.perPage || '5',
    });

    // Handle search input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        // Update the URL with the search query value
        const queryString = {
            ...(value && { search: value }),
            ...(data.perPage && { perPage: data.perPage }),
        };

        // Pass the search query to the backend to filter products
        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Clears the search bar and resets the product list
    const handleReset = () => {
        setData('search', '');
        setData('perPage', '5');

        router.get(route('products.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    // Handle number of products to display per page
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        // Update the URL with the per page value
        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('products.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleDelete = (id: number, route: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route, {
                preserveScroll: true,
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">

                {showAlert && flashMessage && (
                    <Alert variant={"default"}
                        className={`${flash?.success ? 'bg-green-800' : flash?.error ? 'bg-red-800' : ''} ml-auto max-w-md text-white`}>

                        <AlertTitle className='font-bold'>
                            {flash.success ? 'Success' : 'Error'}
                        </AlertTitle>

                        <AlertDescription className="text-white">
                            {flashMessage}
                        </AlertDescription>
                    </Alert>
                )}


                <div className="flex items-center justify-between gap-4 w-full">
                    {/* Search Bar */}
                    <Input
                        type="text"
                        value={data.search}
                        onChange={handleChange}
                        placeholder='Search product...'
                        name="search"
                        className='max-w-sm h-10 w-1/3'
                    />

                    <Button onClick={handleReset} className="bg-primary ml-2 h-10 px-5 cursor-pointer">
                        clear
                    </Button>

                    {/* Add Product Button */}
                    <div className="ml-auto">
                        <Link
                            className="bg-primary hover:bg-chart-4 text-white flex items-center cursor-pointer py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none"
                            as='button'
                            href={route('products.create')}>
                            <CirclePlusIcon />
                            Add Product
                        </Link>
                    </div>
                </div>

                <CustomTable
                    columns={ProductTableConfig.columns}
                    actions={ProductTableConfig.actions}
                    data={products.data}
                    from={products.from}
                    onDelete={handleDelete}
                />

                <Pagination products={products} perPage={data.perPage} onPerPageChange={handlePerPageChange} totalCount={totalCount} filteredCount={filteredCount} search={data.search} />
            </div>
        </AppLayout>
    );
}
