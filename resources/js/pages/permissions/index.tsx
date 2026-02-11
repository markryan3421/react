import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { CustomTable } from '@/components/custom-table';
import { CustomModalForm } from '@/components/custom-modal-form';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { CustomToast, toast } from '@/components/custom-toast';
import { PermissionsTableConfig } from '@/config/tables/permissions-table';
import { PermissionModalFormConfig } from '@/config/forms/permission-modal-form';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Permissions',
        href: '/permissions',
    },
];

// Define the Product interface, representing the structure of a permission object
// This helps with type-checking and autocompletion in TypeScript
interface Permission {
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

// Define the CategoryPagination interface for paginated permission data
interface PermissionPagination {
    // This are the list of arrays inside the 'permissions' object
    data: Permission[]; // Array of Product objects
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
// Get the 'permissions' and 'filters' in the form of object array - compacted from the controller
interface IndexProps {
    permissions: PermissionPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ permissions, filters, totalCount, filteredCount }: IndexProps) {
    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();

    // This will display flash message from the backend (success/error)
    // const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    // const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [mode, setMode] = React.useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = React.useState<any>(null);

    const { data, setData, errors, processing, reset, post, put } = useForm({
        module: '',
        label: '',
        description: '',
        _method: 'POST',
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

        // Pass the search query to the backend to filter permissions
        router.get(route('permissions.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Clears the search bar and resets the permission list
    const handleReset = () => {
        setData('search', '');
        setData('perPage', '5');

        router.get(route('permissions.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    // Handle number of permissions to display per page
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        // Update the URL with the per page value
        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('permissions.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleDelete = (route: string) => {
        if (confirm('Are you sure you want to delete this permission?')) {
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
            setData('_method', 'PUT');

            put(route('permissions.update', selectedCategory.id), {
                forceFormData: true,
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success
                    if (successMessage) {
                        toast.success(successMessage);
                    }
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;
                    if (errorMessage) {
                        toast.error(errorMessage);
                    }
                }
            })
        } else {
            post(route('permissions.store'), {
                onSuccess: (response: { props: FlashProps }) => {
                    const successMessage = response.props.flash?.success
                    if (successMessage) {
                        toast.success(successMessage);
                    }
                    closeModal();
                },
                onError: (error: Record<string, string>) => {
                    const errorMessage = error?.message;
                    if (errorMessage) {
                        toast.error(errorMessage);
                    }
                }
            })
        }
    };

    // Will trigger after submitting the data
    const closeModal = () => {
        // Reset the input fields, remove the values
        reset();
        setMode('create');
        setSelectedCategory(null);
        setModalOpen(false);
    };

    // Will either close or open the modal
    const handleModalToggle = (open: boolean) => {
        setModalOpen(open);
        if (!open) {
            setMode('create');
            setSelectedCategory(null);
            reset();
        }
    };

    // Modal for creating/viewing/editing category
    const openModal = (mode: 'create' | 'view' | 'edit', category?: any) => {
        setMode(mode);

        if (category) {
            Object.entries(category).forEach(([key, value]) => {
                if (key !== 'image' && value !== null) {
                    // Set
                    setData(key as keyof typeof data, value as string);
                }
            });

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

                <div className="flex items-center justify-items-start gap-4 w-full">
                    {/* Search Bar */}
                    <Input
                        type="text"
                        value={data.search}
                        onChange={handleChange}
                        placeholder='Search permission...'
                        name="search"
                        className='max-w-sm h-10 w-1/3'
                    />

                    <Button onClick={handleReset} className="bg-primary ml-2 h-10 px-5 cursor-pointer">
                        clear
                    </Button>
                </div>
                {/* Custom Modal Form */}
                <div className="ml-auto">
                    <CustomModalForm
                        addButton={PermissionModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Permission' : (mode === 'edit' ? 'Update Permission' : PermissionModalFormConfig.title)}
                        description={PermissionModalFormConfig.description}
                        fields={PermissionModalFormConfig.fields}
                        buttons={PermissionModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                    />
                </div>

                <CustomTable
                    columns={PermissionsTableConfig.columns}
                    actions={PermissionsTableConfig.actions}
                    data={permissions.data}
                    from={permissions.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />

                <Pagination
                    pagination={permissions}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                    resourceName='permission'
                />
            </div>
        </AppLayout >
    );
}
