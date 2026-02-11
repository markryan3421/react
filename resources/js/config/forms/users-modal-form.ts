    import { CirclePlus } from "lucide-react"

    export const UsersModalFormConfig = {
        moduleTitle: 'Manage Users',
        title: 'Create User',
        description: 'Add a new user to your system',
        addButton: {
            id: 'add-user',
            label: 'Add User',
            className: 'bg-primary hover:bg-chart-4 text-white cursor-pointer',
            icon: CirclePlus,
            type: 'button',
            variant: 'default',
            permission: 'create-user',
        },
        fields: [
            {
                id: 'full-name',
                key: 'name',
                name: 'name',
                label: 'Full Name',
                placeholder: 'Enter full name',
                type: 'text',
                autocomplete: 'name',
                tabIndex: 1,
            },
            {
                id: 'email',
                key: 'email',
                name: 'email',
                label: 'Email Address',
                placeholder: 'Enter email address',
                type: 'text',
                autocomplete: 'email',
                tabIndex: 2,
            },
            {
                id: 'password',
                key: 'password',
                name: 'password',
                label: 'Password',
                placeholder: 'Enter password',
                type: 'password',
                autocomplete: 'new-password',
                tabIndex: 3,
            },
            {
                id: 'confirm-password',
                key: 'confirm_password',
                name: 'confirm_password',
                label: 'Confirm Password',
                placeholder: 'Confirm password',
                type: 'password',
                autocomplete: 'confirm_password',
                tabIndex: 4,
            },
            {
                id: 'roles',
                key: 'roles',
                name: 'roles',
                label: 'Roles',
                type: 'single-select',
                tabIndex: 5,
                options: [], 
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
