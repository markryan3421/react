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
import { RolesTableConfig } from '@/config/tables/roles-table';
import { RolesModalFormConfig } from '@/config/forms/roles-modal-form';
import { Pagination } from '@/components/ui/pagination';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Manage Roles',
        href: '/roles',
    },
];

// Define the Product interface, representing the structure of a permission object
// This helps with type-checking and autocompletion in TypeScript
interface Role {
    id: number;
    label: string;
    description: string;
}

// Define the LinkProps interface for pagination links
interface LinkProps {
    // From 'links' array
    active: boolean;
    label: string;
    url: string | null;
}

// Define the CategoryPagination interface for paginated role data
interface RolePagination {
    // This are the list of arrays inside the 'roles' object
    data: Role[]; // Array of Product objects
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
// Get the 'roles' and 'filters' in the form of object array - compacted from the controller
interface IndexProps {
    roles: RolePagination;
    filters: FilterProps;
    totalCount: number;
    filteredCount: number;
}

export default function Index({ roles, filters, totalCount, filteredCount }: IndexProps) {
    // Get the route function from ziggy-js to generate URLs
    const route = useRoute();

    // This will display flash message from the backend (success/error)
    // const { flash } = usePage<{ flash?: { success?: string; error?: string } }>().props;
    // const flashMessage = flash?.success || flash?.error;
    const [modalOpen, setModalOpen] = React.useState(false);
    const [mode, setMode] = React.useState<'create' | 'view' | 'edit'>('create');
    const [selectedCategory, setSelectedCategory] = React.useState<any>(null);
    const { permissions } = usePage().props;
    // console.log(permissions);

    const { data, setData, errors, processing, reset, post, put } = useForm<{
        label: string;
        description: string;
        permissions: string[];
        _method: string;
        search: string;
        perPage: string;
    }>({
        label: '',
        description: '',
        permissions: [],
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

        // Pass the search query to the backend to filter roles
        router.get(route('roles.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    // Clears the search bar and resets the role list
    const handleReset = () => {
        setData('search', '');
        setData('perPage', '5');

        router.get(route('roles.index'), {}, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    // Handle number of role to display per page
    const handlePerPageChange = (value: string) => {
        setData('perPage', value);

        // Update the URL with the per page value
        const queryString = {
            ...(data.search && { search: data.search }),
            ...(value && { perPage: value }),
        };

        router.get(route('roles.index'), queryString, {
            preserveState: true,
            preserveScroll: true,
        });
    }

    const handleDelete = (route: string) => {
        if (confirm('Are you sure you want to delete this role?')) {
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

            put(route('roles.update', selectedCategory.id), {
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
            post(route('roles.store'), {
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
                if (key === 'permissions' && Array.isArray(value)) {
                    setData(
                        'permissions',
                        value.map((permission: any) => permission.name),
                    );
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
            <Head title="Role Management" />
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
                        addButton={RolesModalFormConfig.addButton}
                        title={mode === 'view' ? 'View Role' : (mode === 'edit' ? 'Update Role' : RolesModalFormConfig.title)}
                        description={RolesModalFormConfig.description}
                        fields={RolesModalFormConfig.fields}
                        buttons={RolesModalFormConfig.buttons}
                        data={data}
                        setData={setData}
                        errors={errors}
                        processing={processing}
                        handleSubmit={handleSubmit}
                        open={modalOpen}
                        onOpenChange={handleModalToggle}
                        mode={mode}
                        extraData={permissions}
                    />
                </div>

                <CustomTable
                    columns={RolesTableConfig.columns}
                    actions={RolesTableConfig.actions}
                    data={roles.data}
                    from={roles.from}
                    onDelete={handleDelete}
                    onView={(category) => openModal('view', category)}
                    onEdit={(category) => openModal('edit', category)}
                    isModal={true}
                />

                <Pagination
                    pagination={roles}
                    perPage={data.perPage}
                    onPerPageChange={handlePerPageChange}
                    totalCount={totalCount}
                    filteredCount={filteredCount}
                    search={data.search}
                    resourceName='role'
                />
            </div>
        </AppLayout>
    );
}
