// app/products/components/ProductBadge.tsx
interface ProductBadgeProps {
    type: 'new' | 'pre-order'; 
   }
   
   export default function ProductBadge({ type }: ProductBadgeProps) {
    if (type === 'new') {
      return (
        <div className="absolute top-2 left-2 bg-emerald-500 text-white text-xs font-medium px-2 py-1 rounded-full">
          New
        </div>
      );
    }
   
    return (
      <div className="absolute top-2 left-2 bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded-full">
        Pre-Order
      </div>
    );
   }