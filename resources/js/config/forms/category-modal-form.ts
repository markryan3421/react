import { CirclePlus } from "lucide-react"

export const CategoryModalFormConfig = {
    moduleTitle: 'Manage Categories',
    title: 'Create Category',
    description: 'Add a new category to your product catalog',
    addButton: {
        id: 'add-category',
        label: 'Add Category',
        className: 'bg-primary hover:bg-chart-4 text-white cursor-pointer',
        icon: CirclePlus,
        type: 'button',
        variant: 'default',
    },
    fields: [
        {
            id: 'category-name',
            key: 'name',
            name: 'name',
            label: 'Category Name',
            placeholder: 'Enter category name',
            type: 'text',
            autocomplete: 'name',
            tabIndex: 1,
            autoFocus: true,
        },
        {
            id: 'category-description',
            key: 'description',
            name: 'description',
            label: 'Description (optional)',
            placeholder: 'Enter category description',
            type: 'textarea',
            autocomplete: 'description',
            tabIndex: 2,
            rows: 3,
        },
        {
            id: 'category-image',
            key: 'image',
            name: 'image',
            label: 'Image (optional)',
            type: 'file',
            accept: 'image/*',
            tabIndex: 3,
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
            label: 'Save Category',
            variant: 'default',
            className: 'cursor-pointer',
        }
    ]
}
