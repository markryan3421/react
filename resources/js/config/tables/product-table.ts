// JSON data for fetching table contents
// This configuration is used in 'resources/js/pages/products/index.tsx' and 'resources/js/components/custom-table.tsx'
// Defines the columns and actions for the Product table
export const ProductTableConfig = {
    columns: [
        { label: 'Product Name', key: 'name', className: 'border p-4' }, // 'key' values are the column names from the database, capture dynamically
        { label: 'Description', key: 'description', className: 'w-90 border p-4' },
        { label: 'Price', key: 'price', className: 'border p-4' },
        { label: 'Featured Image', key: 'featured_image', isImage: true, className: 'border p-4' }, //isImage for we will capture the data as image and not as normal text
        { label: 'Created Date', key: 'created_at', className: 'border p-4' },
        { label: 'Action', key: 'actions', isAction: true, className: 'border p-4' }, //isAction for we will capture the data as buttons and not as normal text
    ],
    actions: [
        {
            label: 'View',
            icon: 'Eye',
            color: '#3c3adf',
            route: (id: number) => ({
                name: 'products.show',
                params: { product: id },
            }),
            className: 'cursor-pointer p-2 hover:bg-blue-950 rounded-sm',
        },
        {
            label: 'Edit',
            icon: 'Pencil',
            color: '#ada21f',
            route: (id: number) => ({
                name: 'products.edit',
                params: { product: id },
            }),
            className: 'cursor-pointer p-2 hover:bg-yellow-950 rounded-sm',
        },
        {
            label: 'Delete',
            icon: 'Trash',
            color: '#f72222',
            route: (id: number) => ({
                name: 'products.destroy',
                params: { product: id },
            }),
            className: 'cursor-pointer p-2 hover:bg-red-950 rounded-sm',
        },
    ]

    // actions: [
    //     { label: 'View', icon: 'Eye', color: '#3c3adf', route: (id: number) => `/products/${id}`, className: 'cursor-pointer p-2 hover:bg-blue-950 rounded-sm' },
    //     { label: 'Edit', icon: 'Pencil', color: '#ada21f', route: (id: number) => `/products/${id}/edit`, className: 'cursor-pointer p-2 hover:bg-yellow-950 rounded-sm' },
    //     { label: 'Delete', icon: 'Trash', color: '#f72222', route: (id: number) => `/products/${id}/destroy`, className: 'cursor-pointer p-2 hover:bg-red-950 rounded-sm' },
    // ]
}
