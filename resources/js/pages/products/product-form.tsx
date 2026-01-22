import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, Link, useForm } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { CustomTextarea } from '@/components/ui/custom-textarea';
import { Button } from '@/components/ui/button';
import InputError from '@/components/input-error';
import { ArrowLeft, LoaderCircle } from 'lucide-react';

export default function ProductForm({ ...props }) {
    const route = useRoute();

    // // This will help to debug and see what props are being passed to this component
    // console.log('props:', props);

    // Destructure props, inside the {} are the variables being passed/compact from the controller
    const { product, viewMode, editMode } = props;

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: `${viewMode ? 'Show' : editMode ? 'Edit' : 'Create'} Product`,
            href: route('products.create'),
        },
    ];

    // 1. Define the form data structure for display
    interface FormData {
        name: string;
        description: string;
        price: string | number;
        featured_image: null | File;
    }

    // 2.  Initialize the form with useForm hook (node_modules\@inertiajs\react\types\useForm.d.ts)
    const { data, setData, post, errors, processing, put, reset } = useForm<FormData>({
        name: product?.name || '', // 'product?.name' if EDITING and '' if CREATING 
        description: product?.description || '',
        price: product?.price || '',
        featured_image: null as File | null,
    });

    // This function will handle the file upload and set the file to the form data
    // It takes a React.ChangeEvent<HTMLInputElement> as input
    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        // Check if file exist
        if (e.target.files && e.target.files.length > 0) {
            setData('featured_image', e.target.files[0]);
        }
    }

    // 3. send to backend
    const submit = (e: React.FormEvent<HTMLFormElement>) => {
        // Prevent the page from reloading
        e.preventDefault();

        // Send to backend, the 'store()' / 'update()' method in ProductController will do the validation
        if (editMode) {
            put(route('products.update', product.id), {
                forceFormData: true, // To handle file uploads
                onSuccess: () => reset(), // Reset the form
            })
        } else {
            post(route('products.store'), {
                forceFormData: true, // To handle file uploads
                onSuccess: () => reset(), // Reset the form
            })
        }

        console.log('data: ', data);
    }

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Product Management" />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                <div className="ml-auto">
                    <Link
                        as='button'
                        className="bg-primary hover:bg-chart-4 flex items-center w-fit cursor-pointer py-3 px-4 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-transparent"
                        href={route('products.index')}>
                        <ArrowLeft />
                        Back to Products
                    </Link>
                </div>

                <Card>
                    <CardTitle className="text-lg font-semibold p-4">
                        {viewMode ? 'Show' : editMode ? 'Edit' : 'Create'} Product
                    </CardTitle>

                    <CardContent className="space-y-6">
                        <form onSubmit={submit}>
                            {/* Product Name */}
                            <div className='grid gap-2 mt-4'>
                                <Label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                    <span className='text-red-500 font-bold me-1'>*</span>
                                    Product Name
                                </Label>
                                <Input
                                    value={data.name}
                                    onChange={e => setData('name', e.target.value)}
                                    type="text"
                                    name="name"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product name"
                                    autoFocus
                                    tabIndex={1}
                                    disabled={viewMode || processing}
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Product Description */}
                            <div className='grid gap-2 mt-4'>
                                <Label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                    <span className='text-red-500 font-bold me-1'>*</span>
                                    Description
                                </Label>
                                <CustomTextarea
                                    onChange={e => setData('description', e.target.value)}
                                    value={data.description}
                                    name="description"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product description"
                                    rows={4}
                                    tabIndex={2}
                                    disabled={viewMode || processing}
                                />
                                <InputError message={errors.description} />
                            </div>

                            {/* Product Price */}
                            <div className='grid gap-2 mt-4'>
                                <Label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                    <span className='text-red-500 font-bold me-1'>*</span>
                                    Product Price
                                </Label>
                                <Input
                                    onChange={e => setData('price', e.target.value)}
                                    value={data.price}
                                    type="text"
                                    name="price"
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="Enter product price"
                                    autoFocus
                                    tabIndex={3}
                                    disabled={viewMode || processing}
                                />
                                <InputError message={errors.price} />
                            </div>

                            {/* Featured Image */}
                            {!viewMode && (
                                // If not view mode, display the file input form
                                <div className='grid gap-2 mt-4'>
                                    <Label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                        Featured Image
                                    </Label>
                                    <Input
                                        onChange={handleFileUpload}
                                        type="file"
                                        name="featured_image"
                                        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                        tabIndex={4}
                                    />
                                    <InputError message={errors.featured_image} />
                                </div>
                            )}

                            {(viewMode || editMode) && (
                                // If view mode, display the image
                                <div className='grid gap-2 mt-6'>
                                    <Label className="block mb-2 font-medium text-sm text-gray-700 dark:text-gray-300">
                                        Current Featured Image
                                    </Label>
                                    {product.featured_image ? (
                                        <img src={`/${product.featured_image}`} alt="Featured Image" className="h-32 w-32 border rounded-md" />
                                    ) : (
                                        <span className='text-gray-500 text-sm'>- No image uploaded.</span>
                                    )}
                                </div>
                            )}

                            {/* Submit Button */}
                            {!viewMode && (
                                <Button
                                    type="submit"
                                    className="mt-4 w-fit cursor-pointer"
                                    tabIndex={4}
                                    data-test="login-button"
                                >
                                    {processing && <LoaderCircle className='h-4 w-4 animate-spin' />}
                                    {processing ? (editMode ? 'Updating...' : 'Creating...') : editMode ? 'Update Product' : 'Create Product'}
                                </Button>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
