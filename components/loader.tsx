import { cn } from '@/lib/utils';

export function Loader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
    return (
        <div className={cn('flex items-center justify-center min-h-[200px]', className)} {...props}>
            <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
    );
}