// app/components/Loading.tsx
export default function Loading() {
    return (
      <div className="flex items-center justify-center min-h-[600px]">
        <div className="relative w-20 h-20">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="w-20 h-20 border-4 border-violet-200 rounded-full animate-spin border-t-violet-600" />
          </div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      </div>
    );
   }