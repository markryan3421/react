export const ProductTableConfig = {
    columns: [
        { label: 'Product Name', key: 'name', className: 'border p-4' },
        { label: 'Description', key: 'description', className: 'w-90 p-4' },
        { label: 'Price', key: 'price', className: 'border p-4' },
        { label: 'Featured Image', key: 'featured_image', isImage: true, className: 'border p-4' },
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Action', key: 'actions', isAction: true, className: 'border p-4' },
    ],
    actions: [
        { label: 'View', icon: 'Eye', route: 'products.show', className: 'mx-1 text-gray-600 hover:text-gray-900 cursor-pointer' },
        { label: 'Edit', icon: 'Pencil', route: 'products.edit', className: 'mx-1 text-gray-600 hover:text-gray-900 cursor-pointer' },
        { label: 'Delete', icon: 'Trash', route: 'products.destroy', className: 'bg-transparent hover:bg-transparent text-gray-600 hover:text-gray-900 cursor-pointer' },
    ],
}
