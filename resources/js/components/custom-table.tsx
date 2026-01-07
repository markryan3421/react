// import { Link } from "@inertiajs/react";
import { Button } from "@headlessui/react";
import { Link, router } from "@inertiajs/react";
// import { get } from "http";
import * as LucidIcons from "lucide-react";
// import { Tooltip, TooltipTrigger, TooltipContent } from "@radix-ui/react-tooltip";
// import { ProductTableConfig } from "@/config/tables/product-table";
import { useRoute } from 'ziggy-js';

// This function takes an unknown value and safely converts it into something React can display
// It handles strings, numbers, booleans, nulls, and objects gracefully
function renderCellValue(value: unknown): React.ReactNode {
    // If the value is already a string or number,
    // React can render it directly
    if (typeof value === "string" || typeof value === "number") {
        return value;
    }

    // If the value is null or undefined,
    // render a dash instead of crashing
    if (value === null || value === undefined) {
        return "-";
    }

    // If the value is a boolean,
    // show a readable version
    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    // If the value is an object (but not null),
    // convert it to JSON text
    if (typeof value === "object") {
        return JSON.stringify(value);
    }

    // Fallback (should rarely happen)
    return String(value);
}

// Safely extract an image URL from an unknown value
function getImageSrc(value: unknown): string | null {
    // Only allow strings
    if (typeof value === "string" && value.length > 0) {
        return value;
    }

    // Anything else is invalid for <img src>
    return null;
}

function getRowId(row: TableRow): number | null {
    const value = row["id"];

    if (typeof value === "number") {
        return value;
    }

    return null;
}


interface TableColumn {
    // These are keys inside 'columns' array of ProductTableConfig from 'resources/js/config/tables/product-table.ts' JSON file
    label: string;
    key: string;
    isImage?: boolean; // '?' states for optional
    isAction?: boolean;
    className?: string;
}

interface ActionConfig {
    // These are keys inside 'actions' array of ProductTableConfig from 'resources/js/config/tables/product-table.ts' JSON file
    label: string;
    icon: keyof typeof LucidIcons;
    type?: 'delete';
    route: (id: number) => {
        name: string;
        params: Record<string, number>;
    };
    className: string;
    color: string;
}

interface TableRow {
    [key: string]: unknown;
}

interface CustomTableProps {
    columns: TableColumn[];
    actions: ActionConfig[];
    data: TableRow[];
    from: number;
}

export const CustomTable = ({ columns, actions, data, from }: CustomTableProps) => {
    // console.log('Columns', columns); // Column headers (e.g. Product Name, Desc, Price, etc.)
    // console.log('Data:', data); // Data from the database
    // console.log('Actions:', actions); // List of actions (e.g. View, Edit, Delete)

    const route = useRoute();

    const handleDelete = (routeConfig: { name: string; params: Record<string, number> }) => {
        if (!confirm('Are you sure you want to delete this product?')) {
            return;
        }

        router.delete(route(routeConfig.name, routeConfig.params), {
            preserveScroll: true,
            onSuccess: () => {
                console.log('Product deleted successfully');
            },
        });
    };

    // Action column, button configurations
    // This will be called on the part where the buttons will be displayed 
    const renderActionButtons = (row: TableRow) => {
        const id = getRowId(row);

        if (id === null) {
            return null;
        }

        return (
            <div className="flex">
                {actions.map((action, index) => {
                    const IconComponent = LucidIcons[action.icon] as React.ElementType;
                    const routeConfig = action.route(id);

                    // DELETE actions
                    if (action.label === 'Delete') {
                        return (
                            <Button
                                key={index}
                                onClick={() => handleDelete(routeConfig)}
                                className="p-2 hover:bg-red-900 rounded text-red-500"
                            >
                                <IconComponent name={action.icon} />
                            </Button>
                        );
                    }

                    return (
                        <Link
                            key={index}
                            href={route(routeConfig.name, routeConfig.params)}
                            className="p-2 hover:bg-muted rounded"
                        >
                            <IconComponent name={action.icon} />
                        </Link>
                    );
                })}
            </div>
        );
    };

    return (
        <div className="overflow-hidden rounded-lg border shadow-sm">
            <table className="w-full table-auto border-collapse text-center">
                <thead>
                    <tr className="border-b">
                        <th className="p-4">#</th>

                        {columns.map((column) => (
                            <th key={column.key} className={column.className}>{column.label}</th>
                        ))}
                    </tr>
                </thead>

                <tbody>
                    {data.length > 0 ? (
                        /* Loop through the products array using ".map" and render a row for each product*/
                        data.map((row, index) => (
                            <tr key={index}>
                                <td className="border p-4">{from + index}</td>
                                {columns.map((col) => (
                                    <td key={col.key} className="border p-4">
                                        {col.isImage ? (
                                            (() => {
                                                const src = getImageSrc(row[col.key]);
                                                return src ? (
                                                    <img src={src} alt={'No image uploaded.'} className="ms-7 h-16 w-16 object-cover rounded" />
                                                ) : (
                                                    <span className="text-muted-foreground text-sm">No image uploaded.</span>
                                                );
                                            })()
                                        ) : col.isAction ? (
                                            renderActionButtons(row)
                                        ) : (
                                            renderCellValue(row[col.key])
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className='text-center py-4 text-md font-bold'>
                            <td colSpan={7} className="p-4 text-center">
                                No products found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    );
}
