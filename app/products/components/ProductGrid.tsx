// app/products/components/ProductGrid.tsx
import ProductCard from './ProductCard';
import { Product } from '@/app/types';

interface ProductGridProps {
  products: Product[];
}

export default function ProductGrid({ products = [] }: ProductGridProps) {
  if (!Array.isArray(products)) {
    return null;
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-4">
      {products.map((product) => (
        product && <ProductCard 
          key={product.id ?? 'fallback-key'} 
          product={product} 
        />
      ))}
    </div>
  );
}
