import AppLayout from '@/layouts/app-layout';
// import { dashboard } from '@/routes';
import { type BreadcrumbItem } from '@/types';
import { Head, Link } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { usePage } from '@inertiajs/react';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { useEffect, useState } from 'react';
import { Eye, Pencil, Trash, CirclePlusIcon } from 'lucide-react';

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
    created_at: string;
}

export default function Index({ ...props }: { products: Product[] }) {
    // Destructure 'products' from props, which is an array of Product objects fetched from the controller
    const { products } = props;
    console.log('Props:', props);

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

    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();
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


                {/* Add Product Button */}
                <div className="ml-auto">
                    <Link
                        className="flex items-center cursor-pointer py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent bg-blue-100 text-blue-800 hover:bg-blue-200 focus:outline-hidden focus:bg-blue-200 disabled:opacity-50 disabled:pointer-events-none dark:text-blue-400 dark:bg-blue-800/30 dark:hover:bg-blue-800/20 dark:focus:bg-blue-800/20"
                        as='button'
                        href={route('products.create')}>
                        <CirclePlusIcon />
                        Add Product
                    </Link>
                </div>

                <div className="overflow-hidden rounded-lg border shadow-sm">
                    <table className="w-full table-auto border-collapse text-center">
                        <thead>
                            <tr className="border-b">
                                <th className="p-4">#</th>
                                <th className="p-4">Product Name</th>
                                <th className="p-4">Description</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Featured Image</th>
                                <th className="p-4">Created Date</th>
                                <th className="p-4">Action</th>
                            </tr>
                        </thead>

                        <tbody>
                            {products.length > 0 ? (
                                /* Loop through the products array using ".map" and render a row for each product*/
                                products.map((product, index) => (
                                    <tr key={index}>
                                        <td className="p-4">{index + 1}</td>
                                        <td className="p-4">{product.name}</td>
                                        <td className="p-4">{product.description}</td>
                                        <td className="p-4">${product.price}</td>
                                        <td className="p-4">
                                            {product.featured_image ? (
                                                <img src={product.featured_image} alt={product.name} className="ms-4 h-16 w-16 object-cover" />
                                            ) : (
                                                <span className='text-gray-500 text-sm'>No image uploaded.</span>
                                            )}
                                        </td>
                                        <td className="p-4">{product.created_at}</td>
                                        <td className="p-4">
                                            <Link
                                                as="button"
                                                href={route('products.show', product.id)}
                                                className='cursor-pointer p-2 hover:bg-blue-950 rounded-sm'
                                            >
                                                <Eye color="#3c3adf" size={20} />
                                            </Link>
                                            <Link
                                                as="button"
                                                href={route('products.edit', product.id)}
                                                className='cursor-pointer p-2 hover:bg-yellow-950 rounded-sm'
                                            >
                                                <Pencil color="#ada21f" size={20} />
                                            </Link>
                                            <Link
                                                as="button"
                                                method="delete"
                                                href={route('products.destroy', product.id)}
                                                className='cursor-pointer p-2 hover:bg-red-950 rounded-sm'
                                                onClick={(e) => {
                                                    if (!window.confirm('Are you sure you want to delete this product?')) {
                                                        e.preventDefault();
                                                    }
                                                }}
                                                preserveScroll={true}
                                                onSuccess={() => {
                                                    // Show alert on successful deletion
                                                    setShowAlert(true);
                                                }}
                                            >
                                                <Trash color="#f72222" size={20} />
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr className='text-center py-4 text-md font-bold'>
                                    <td colSpan={7} className="p-4 text-center">
                                        No products found.
                                    </td>
                                </tr>
                            )}

                        </tbody>
                    </table>
                </div>
            </div>
        </AppLayout>
    );
}