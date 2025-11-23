// ProfileSkeleton.jsx
import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

export function ProfileSkeleton() {
  return (
    <div className="p-4 rounded-xl shadow-sm bg-white w-full max-w-md">
      <div className="flex items-center space-x-4">
        <Skeleton className="h-16 w-16 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1">
          <Skeleton className="h-5 w-40 rounded bg-gray-200 animate-pulse" />
          <Skeleton className="h-4 w-32 rounded bg-gray-200 animate-pulse mt-2" />
        </div>
      </div>

      <div className="mt-4 space-y-3">
        <Skeleton className="h-3 w-full rounded bg-gray-200 animate-pulse" />
        <Skeleton className="h-3 w-3/4 rounded bg-gray-200 animate-pulse" />
        <Skeleton className="h-3 w-1/2 rounded bg-gray-200 animate-pulse" />
      </div>
    </div>
  );
}
