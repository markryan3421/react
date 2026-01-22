import { Link } from "@inertiajs/react";
import { Eye, Pencil, Trash } from "lucide-react";
import { useRoute } from "ziggy-js";
import * as LucidIcons from "lucide-react";
import { Button } from "./ui/button";

interface TableColumn {
    label: string;
    key: string;
    isImage?: boolean;
    isAction?: boolean;
    className?: string;
}

interface ActionConfig {
    label: string;
    icon: keyof typeof LucidIcons;
    route: string;
    className?: string;
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
    onDelete: (id: number, route: string) => void;
}

export const CustomTable = ({ columns, actions, data, from, onDelete }: CustomTableProps) => {
    const route = useRoute();
    console.log(columns);
    console.log('Data:', data);

    const renderActionButtons = (row: TableRow) => {
        return (
            <div className="flex">
                {actions.map((action, index) => {
                    const IconComponent = LucidIcons[action.icon] as React.ElementType;

                    // Delete Function
                    if (action.label === 'Delete') {
                        return (
                            <Button key={index} className={action.className} onClick={() => onDelete(row.id, route(action.route, row.id))}>
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
                                    <td key={col.key} className="border p-4 text-center">
                                        {col.isImage ? (
                                            <div> <img src={row[col.key]} alt="Product Image" className="h-20 w-20 rounded-lg object-cover justify-self-center" /></div>
                                        ) : col.isAction ? (
                                            renderActionButtons(row)
                                        ) : (
                                            row[col.key]
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
        </div >
    );
}
