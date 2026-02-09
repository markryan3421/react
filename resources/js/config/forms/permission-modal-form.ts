import { CirclePlus } from "lucide-react"

export const PermissionModalFormConfig = {
    moduleTitle: 'Manage Permissions',
    title: 'Create Permission',
    description: 'Add a new permission to your system.',
    addButton: {
        id: 'add-permission',
        label: 'Add Permission',
        className: 'bg-primary hover:bg-chart-4 text-white cursor-pointer',
        icon: CirclePlus,
        type: 'button',
        variant: 'default',
        permission: 'create-permission',
    },
    fields: [
        {
            id: 'module',
            key: 'module',
            name: 'module',
            label: 'Module Name',
            placeholder: 'Enter module name',
            type: 'single-select',
            tabIndex: 1,
            autoFocus: true,
            options: [
                { label: 'Categories', value: 'categories', key: 'categories' },
                { label: 'Products', value: 'products', key: 'products' },
                { label: 'Roles', value: 'roles', key: 'roles' },
                { label: 'Users', value: 'users', key: 'users' },
                { label: 'Permissions', value: 'permissions', key: 'permissions' },
            ],
        },
        {
            id: 'permission-label',
            key: 'label',
            name: 'label',
            label: 'Permission Label (e.g. Create User)',
            placeholder: 'Enter permission label',
            type: 'text',
            autocomplete: 'label',
            tabIndex: 2,
        },
        {
            id: 'description',
            key: 'description',
            name: 'description',
            label: 'Description (optional)',
            placeholder: 'Enter permission description',
            type: 'textarea',
            autocomplete: 'description',
            tabIndex: 3,
            rows: 2,
        },
    ],
    buttons: [
        {
            key: 'cancel',
            type: 'button',
            label: 'Close',
            variant: 'ghost',
            className: 'outline cursor-pointer',
        },
        {
            key: 'submit',
            type: 'submit',
            label: 'Save',
            variant: 'default',
            className: 'cursor-pointer',
        }
    ]
}
