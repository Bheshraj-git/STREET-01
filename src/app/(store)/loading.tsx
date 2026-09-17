export default function StoreLoading() {
    return (
        <div className="container mx-auto max-w-[1440px] px-4 md:px-6 lg:px-10">
            <div className="py-16 md:py-24">
                <div className="h-4 w-32 animate-pulse bg-muted" />
                <div className="mt-4 h-16 w-2/3 animate-pulse bg-muted md:h-24" />
                <div className="mt-6 flex gap-3">
                    <div className="h-12 w-40 animate-pulse bg-muted" />
                    <div className="h-12 w-32 animate-pulse bg-muted" />
                </div>
            </div>
            <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i}>
                        <div className="aspect-[3/4] w-full animate-pulse bg-muted" />
                        <div className="mt-4 h-4 w-3/4 animate-pulse bg-muted" />
                        <div className="mt-2 h-3 w-1/2 animate-pulse bg-muted" />
                    </div>
                ))}
            </div>
        </div>
    );
}