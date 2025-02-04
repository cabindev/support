// app/products/[id]/page.tsx
import { Suspense } from 'react';
import { ProductDetails } from '../components/ProductDetails';
import prisma from '@/app/lib/db';
import { notFound } from 'next/navigation';
import Loading from '@/app/products/loading';
import { Product, ProductStatus } from '@/app/types/product';

interface Props {
  params: { id: string };
}

async function getProduct(id: string): Promise<Product> {
  const product = await prisma.product.findUnique({
    where: { id },
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      images: {
        select: {
          id: true,
          url: true,
          alt: true,
          sortOrder: true,
        },
        orderBy: {
          sortOrder: 'asc',
        },
      },
      sizes: {
        include: {
          size: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          size: {
            name: 'asc',
          },
        },
      },
    },
  });

  if (!product) notFound();

  const transformedProduct: Product = {
    id: product.id,
    name: product.name,
    description: product.description,
    price: Number(product.price),
    status: product.status as ProductStatus,
    category: {
      id: product.category.id,
      name: product.category.name,
    },
    images: product.images.map((img) => ({
      id: img.id,
      url: img.url,
      alt: img.alt || undefined,
      sortOrder: img.sortOrder,
    })),
    sizes: product.sizes.map((size) => ({
      size: {
        id: size.size.id,
        name: size.size.name,
      },
      stock: size.stock,
    })),
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
  };

  return transformedProduct;
}

export default async function ProductPage({ params }: Props) {
  const product = await getProduct(params.id);

  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <div className="container mx-auto px-4 py-12 pt-24 max-w-7xl">
        <Suspense fallback={<Loading />}>
          <ProductDetails product={product} />
        </Suspense>
      </div>
    </main>
  );
}

export async function generateMetadata({ params }: Props) {
  const product = await getProduct(params.id);

  return {
    title: `${product.name} | SDN Thailand Store`,
    description: product.description,
    openGraph: {
      title: product.name,
      description: product.description,
      images: product.images.map((img) => ({
        url: img.url,
        alt: img.alt || product.name,
      })),
    },
  };
}