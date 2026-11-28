
import {
    Skeleton,
} from "@/components/ui/skeleton";

export function ChartSkeleton() {
    return (
        <div
            role="status"
            aria-label="Loading financial chart"
            className="space-y-4"
        >
            <div className="flex gap-3">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-24" />
            </div>

            <div className="flex h-60 items-end gap-3">
                {[45, 70, 55, 90, 65, 80].map(
                    (height, index) => (
                        <Skeleton
                            key={index}
                            className="flex-1 rounded-t-lg"
                            style={{
                                height: `${height}%`,
                            }}
                        />
                    )
                )}
            </div>

            <Skeleton className="h-4 w-full" />
        </div>
    );
}
