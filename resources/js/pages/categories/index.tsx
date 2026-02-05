import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { usePage } from '@inertiajs/react';
// import { CirclePlusIcon } from 'lucide-react';
import { router } from '@inertiajs/react';
import { CustomTable } from '@/components/custom-table';
import { CategoryTableConfig } from '@/config/tables/category-table';
import { CustomModalForm } from '@/components/custom-modal-form';
import { CategoryModalFormConfig } from '@/config/forms/category-modal-form';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { CustomToast, toast } from '@/components/custom-toast';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Categories',
        href: '/categories',
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

// Define the CategoryPagination interface for paginated product data
interface CategoryPagination {
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

interface FlashProps extends Record<string, any> {
    flash?: {
        success?: string;
        error?: string;
    }
}

// Define the props for the Index component
// Get the 'products' and 'filters' in the form of object array - compacted from the controller
interface IndexProps {
    categories: CategoryPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ categories }: IndexProps) {
    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();

    // This will display flash message from the backend (success/error)
    // const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    // const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [mode, setMode] = React.useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
    const [previewImage, setPreviewImage] = React.useState<string | null>(null);

    const { data, setData, errors, processing, reset, post } = useForm({
        name: '',
        description: '',
        image: null as File | null,
        _method: 'POST',
    });

    const handleDelete = (route: string) => {
        if (confirm('Are you sure you want to delete this product?')) {
            router.delete(route, {
                preserveScroll: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Category deleted successfully.'
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to delete category.';
                    toast.error(errorMessage);
                }
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // console.log('Form data:', data);

        if (mode === 'edit' && selectedCategory) {
            data._method = 'PUT';

            post(route('categories.update', selectedCategory.id), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Category updated successfully.'
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to update category.';
                    toast.error(errorMessage);
                }
            })
        } else {
            post(route('categories.store'), {
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success || 'Category created successfully.'
                    toast.success(successMessage);
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message || 'Failed to create category.';
                    toast.error(errorMessage);
                }
            })
        }
    };

    // Will trigger after submitting the data
    const closeModal = () => {
        // Reset the input fields, remove the values
        reset();
        setMode('create');
        setPreviewImage(null);
        setSelectedCategory(null);
        setModalOpen(false);
    };

    // Will either close or open the modal
    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setMode('create');
            setPreviewImage(null);
            setSelectedCategory(null);
            reset();
        }
    };

    // Modal for creating/viewing/editing category
    const openModal = (mode: 'create' | 'view' | 'edit', category?: any) => {
        setMode(mode);

        if (category) {
            Object.entries(category).forEach(([key, value]) => {
                if (key !== 'image') {
                    // Set
                    setData(key as keyof typeof data, value as string | null);
                }
            });

            setPreviewImage(category.image);
            setSelectedCategory(category);
        }
        // console.log('Data', data);
        setModalOpen(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Category Management" />
            <CustomToast />
            <div className="flex h-full flex-1 flex-col gap-4 overflow-x-auto rounded-xl p-4">
                {/* Custom Modal Form */}
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={CategoryModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Category' : (mode === 'edit' ? 'Update Category' : CategoryModalFormConfig.title)}
                        description={CategoryModalFormConfig.description}
                        fields={CategoryModalFormConfig.fields}
                        buttons={CategoryModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        previewImage={previewImage}
                    />
                </div>

                <CustomTable
                    columns={CategoryTableConfig.columns}
                    actions={CategoryTableConfig.actions}
                    data={categories.data}
                    from={categories.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
