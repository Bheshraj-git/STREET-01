import { cn } from "@/lib/utils";

export interface Column<T> {
    key: string;
    header: string;
    render: (row: T) => React.ReactNode;
    align?: "left" | "right" | "center";
    width?: string;
}

export function DataTable<T extends { id: string }>({
    columns,
    rows,
    empty,
}: {
    columns: Column<T>[];
    rows: T[];
    empty?: React.ReactNode;
}) {
    if (rows.length === 0) {
        return (
            <div className="border border-border p-12 text-center text-sm text-muted-foreground">
                {empty ?? "No records."}
            </div>
        );
    }

    return (
        <div className="overflow-x-auto border border-border">
            <table className="w-full min-w-[640px] text-sm">
                <thead className="border-b border-border bg-muted/40">
                    <tr>
                        {columns.map((c) => (
                            <th
                                key={c.key}
                                className={cn(
                                    "px-4 py-3 text-eyebrow text-muted-foreground",
                                    c.align === "right" && "text-right",
                                    c.align === "center" && "text-center",
                                    !c.align && "text-left"
                                )}
                                style={c.width ? { width: c.width } : undefined}
                            >
                                {c.header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="divide-y divide-border">
                    {rows.map((row) => (
                        <tr key={row.id} className="hover:bg-muted/30">
                            {columns.map((c) => (
                                <td
                                    key={c.key}
                                    className={cn(
                                        "px-4 py-3",
                                        c.align === "right" && "text-right",
                                        c.align === "center" && "text-center"
                                    )}
                                >
                                    {c.render(row)}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}