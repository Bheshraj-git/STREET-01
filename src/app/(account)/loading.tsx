export default function AccountLoading() {
    return (
        <div className="container mx-auto max-w-[1440px] px-4 py-16 md:px-6 lg:px-10">
            <div className="h-4 w-24 animate-pulse bg-muted" />
            <div className="mt-4 h-12 w-64 animate-pulse bg-muted" />
            <div className="mt-12 grid gap-8 md:grid-cols-[200px_1fr]">
                <div className="h-40 animate-pulse bg-muted" />
                <div className="h-96 animate-pulse bg-muted" />
            </div>
        </div>
    );
}