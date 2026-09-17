export default function AdminLoading() {
    return (
        <div className="flex flex-col gap-6">
            <div className="h-4 w-24 animate-pulse bg-muted" />
            <div className="h-10 w-64 animate-pulse bg-muted" />
            <div className="grid gap-3 md:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-24 animate-pulse bg-muted" />
                ))}
            </div>
            <div className="h-72 animate-pulse bg-muted" />
        </div>
    );
}