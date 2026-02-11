import { Link, usePage } from "@inertiajs/react";
// import { Eye, Pencil, Trash } from "lucide-react";
import { useRoute } from "ziggy-js";
import * as LucidIcons from "lucide-react";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { hasPermission } from "@/utils/authorization";

interface TableColumn {
    label: string;
    key: string;
    isImage?: boolean;
    isAction?: boolean;
    className?: string;
    type?: string;
}

interface ActionConfig {
    label: string;
    icon: keyof typeof LucidIcons;
    route: string;
    className?: string;
    permission?: string;
}

interface TableRow {
    // Dynamic keys based on the columns
    // Could be string, num, etc.
    [key: string]: any;
}

interface CustomTableProps {
    columns: TableColumn[];
    actions: ActionConfig[];
    data: TableRow[];
    from: number;
    onDelete: (route: string) => void;
    onView: (row: TableRow) => void;
    onEdit: (row: TableRow) => void;
    isModal?: boolean;
}

export const CustomTable = ({ columns, actions, data, from, onDelete, onView, onEdit, isModal }: CustomTableProps) => {
    const route = useRoute();
    // console.log(columns);
    // console.log('Data:', data);

    const { auth } = usePage().props as any;
    const roles = auth.roles;
    const permissions = auth.permissions;

    const renderActionButtons = (row: TableRow) => {
        return (
            <div className="flex justify-center">
                {actions.map((action, index) => {
                    if (action.permission && !hasPermission(permissions, action.permission)) {
                        return null;
                    }
                    const IconComponent = LucidIcons[action.icon] as React.ElementType;

                    if (isModal) {
                        // View Button
                        if (action.label === 'View') {
                            return (
                                <Button key={index} className={action.className} onClick={() => onView?.(row)}>
                                    <IconComponent size={20} />
                                </Button>
                            );
                        }

                        // Edit Button
                        if (action.label === 'Edit') {
                            return (
                                <Button key={index} className={action.className} onClick={() => onEdit?.(row)}>
                                    <IconComponent size={20} />
                                </Button>
                            );
                        }
                    }

                    // Delete Button
                    if (action.label === 'Delete') {
                        return (
                            <Button key={index} className={action.className} onClick={() => onDelete(route(action.route, row.id))}>
                                <IconComponent size={20} />
                            </Button>
                        );
                    }

                    return (
                        <Link key={index} as="button" href={route(action.route, row.id)} className={action.className}>
                            <IconComponent size={20} />
                        </Link>
                    );
                })}
            </div>
        );
    }

    // Define the Product interface, representing the structure of a product object
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
                        data.map((row, index) => (
                            <tr key={index}>
                                <td className="border p-4 text-center">{from + index}</td>

                                {/* Loop to 'columns' JSON to match its "key" value to database column's value. Then display the data */}
                                {columns.map((col) => (
                                    <td key={col.key} className={`border p-4 text-center ${col.className}`}>
                                        {col.isImage ? (
                                            <div> <img src={row[col.key]} alt="Product Image" className="h-32 w-32 rounded-lg object-cover justify-self-center" /></div>
                                        ) : col.isAction ? (
                                            renderActionButtons(row)
                                        ) : col.key === 'created_at' ? (
                                            <span>{new Date(row[col.key]).toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                                        ) : col.type === 'multi-values' && Array.isArray(row[col.key]) ? (
                                            <div className="flex flex-wrap justify-center items-center gap-1">
                                                {row[col.key].map((item: any, idx: number) => (
                                                    <Badge key={idx} variant='outline' className="bg-primary text-white p-2">
                                                        {typeof item === 'object' ? (item.label || item.name) : item}
                                                    </Badge>
                                                ))}
                                            </div>
                                        ) : (
                                            row[col.key]
                                        )}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr className='text-center py-4 text-md font-bold'>
                            <td colSpan={7} className="p-4 text-center text-red-700">
                                No data found.
                            </td>
                        </tr>
                    )}

                </tbody>
            </table>
        </div >
    );
}
