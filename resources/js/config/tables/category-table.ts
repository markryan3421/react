export const CategoryTableConfig = {
    columns: [
        { label: 'Category Name', key: 'name', className: 'border p-4' },
        { label: 'Description', key: 'description', className: 'w-90 p-4' },
        { label: 'Image', key: 'image', isImage: true, className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Actions', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', className: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-900 cursor-pointer' },
        { label: 'Edit', icon: 'Pencil', className: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-900 cursor-pointer' },
        { label: 'Delete', icon: 'Trash', route: 'categories.destroy', className: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-900 cursor-pointer' },
    ],
}