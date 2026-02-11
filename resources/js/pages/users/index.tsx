import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, usePage } from '@inertiajs/react';
import { useRoute } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { CustomTable } from '@/components/custom-table';
import { CustomModalForm } from '@/components/custom-modal-form';
import { useForm } from '@inertiajs/react';
import React from 'react';
import { CustomToast, toast } from '@/components/custom-toast';
import { UsersModalFormConfig } from '@/config/forms/users-modal-form';
import { UsersTableConfig } from '@/config/tables/users-table';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Users',
        href: '/users',
    },
];

// Define the Product interface, representing the structure of a product object
// This helps with type-checking and autocompletion in TypeScript
interface User {
    id: number;
    name: string;
    email: string;
    role: string;
}

// Define the LinkProps interface for pagination links
interface LinkProps {
    // From 'links' array
    active: boolean;
    label: string;
    url: string | null;
}

// Define the CategoryPagination interface for paginated product data
interface UserPagination {
    // This are the list of arrays inside the 'products' object
    data: User[]; // Array of Product objects
    links: LinkProps[]; // Array of pagination link objects
    from: number;
    to: number;
    total: number;
}

// Define the FilterProps interface for search filters
interface FilterProps {
    search: string;
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
    users: UserPagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ users, filters }: IndexProps) {
    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();

    // This will display flash message from the backend (success/error)
    // const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    // const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [mode, setMode] = React.useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
    const { props } = usePage();
    // console.log(roles);

    const { data, setData, errors, processing, reset, post, put } = useForm<{
        name: string;
        email: string;
        password: string;
        confirm_password: string;
        roles: string;
        _method: string;
        search: string;
    }>({
        name: '',
        email: '',
        password: '',
        confirm_password: '',
        roles: '',
        _method: 'POST',
        search: filters.search || '',
    });

    // Handle search input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setData('search', value);

        // Update the URL with the search query parameter
        const queryString = value ? { search: value } : {};

        // Pass the search query to the backend to filter users
        router.get(route('users.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Clears the search bar and resets the product list
    const handleReset = () => {
        setData('search', '');

        router.get(route('users.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

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
        // console.log('Form data:', data); return;

        if (mode === 'edit' && selectedCategory) {
            setData('_method', 'PUT');

            put(route('users.update', selectedCategory.id), {
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
            post(route('users.store'), {
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
                if (key === 'roles' && Array.isArray(value)) {
                    setData('roles', value[0]?.name);
                } else {
                    // Fetch the permission names from database
                    setData(key as keyof typeof data, (value as string || null) ?? '');
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
                        placeholder='Search role name...'
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
                        addButton={UsersModalFormConfig.addButton}
                        title={mode === 'view' ? 'View User' : (mode === 'edit' ? 'Update User' : UsersModalFormConfig.title)}
                        description={UsersModalFormConfig.description}
                        fields={UsersModalFormConfig.fields}
                        buttons={UsersModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        extraData={props}
                    />
                </div>

                <CustomTable
                    columns={UsersTableConfig.columns}
                    actions={UsersTableConfig.actions}
                    data={users.data}
                    from={users.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />
            </div>
        </AppLayout>
    );
}
