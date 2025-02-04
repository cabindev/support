// app/products/page.tsx
import prisma from "@/app/lib/db";
import ProductGrid from "./components/ProductGrid";
import SortSelect from "./components/SortSelect";
import { serializeProduct } from "@/app/types";
import { ProductWithRelations } from "@/app/types";

interface SearchParams {
  category?: string;
  search?: string;
  sort?: string;
  minPrice?: string;
  maxPrice?: string;
}

export default async function StorePage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  try {
    const where = {
      ...(searchParams.category && { categoryId: searchParams.category }),
      ...(searchParams.search && {
        OR: [
          { name: { contains: searchParams.search } },
          { description: { contains: searchParams.search } },
        ],
      }),
      ...(searchParams.minPrice && {
        price: {
          gte: parseFloat(searchParams.minPrice),
        },
      }),
      ...(searchParams.maxPrice && {
        price: {
          lte: parseFloat(searchParams.maxPrice),
          ...(searchParams.minPrice && {
            gte: parseFloat(searchParams.minPrice),
          }),
        },
      }),
    };

    const orderBy = (() => {
      switch (searchParams.sort) {
        case "price-asc":
          return { price: "asc" as const };
        case "price-desc":
          return { price: "desc" as const };
        case "newest":
          return { createdAt: "desc" as const };
        default:
          return { createdAt: "desc" as const };
      }
    })();

    const products = await prisma.product.findMany({
      where,
      orderBy,
      include: {
        category: true,
        images: {
          orderBy: {
            sortOrder: "asc",
          },
        },
        sizes: {
          include: {
            size: true,
          },
        },
        _count: {
          select: {
            orderItems: true,
          },
        },
      },
    });

    const serializedProducts = products.map((product) =>
      serializeProduct(product as ProductWithRelations)
    );

    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-[#2A0134] via-[#4B0082] to-[#800080]">
          <div className="container mx-auto px-4 py-12">
            {" "}
            {/* ลดจาก py-20 เป็น py-12 */}
            <div className="max-w-3xl relative z-10">
              <span className="font-grbj inline-block px-4 py-1.5 rounded-full bg-white/10 text-red-400 text-sm font-medium mb-3">
                {" "}
                {/* ลด padding และ margin */}
                ALCOHOL FREE
              </span>
              <h1 className="font-grbj text-5xl font-bold mb-4 leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-violet-200 to-pink-200">
                {" "}
                {/* ลดขนาด font และ margin */}
                กองทุนผู้ได้รับ
                <br />
                ผลกระทบจากน้ำเมา
              </h1>
              <p className="font-grbj text-base text-violet-200/90 mb-6 leading-relaxed">
                {" "}
                {/* ลดขนาด font และ margin */}
                ร่วมเป็นส่วนหนึ่งในการช่วยเหลือและสนับสนุน
                <br />
                ผู้ได้รับผลกระทบจากปัญหาแอลกอฮอล์ผ่านการเลือกซื้อสินค้าของเรา
              </p>
            </div>
            {/* Decorative Elements - ปรับขนาดลง */}
            <div className="absolute -right-20 -top-10 w-[400px] h-[400px] opacity-10 animate-[spin_60s_linear_infinite]">
              {" "}
              {/* ลดขนาดและปรับตำแหน่ง */}
              <svg className="w-full h-full" viewBox="0 0 400 400" fill="none">
                <circle
                  cx="200"
                  cy="200"
                  r="180"
                  stroke="white"
                  strokeWidth="1"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="140"
                  stroke="white"
                  strokeWidth="0.8"
                />
                <circle
                  cx="200"
                  cy="200"
                  r="100"
                  stroke="white"
                  strokeWidth="0.6"
                />
              </svg>
            </div>
            <div className="absolute left-1/2 top-1/2 w-3 h-3 bg-violet-400 rounded-full blur-sm animate-pulse"></div>{" "}
            {/* ลดขนาด */}
            <div className="absolute left-1/4 top-1/3 w-2 h-2 bg-pink-400 rounded-full blur-sm animate-pulse delay-75"></div>
          </div>
        </div>

        {/* Products Section */}
        <div className="container mx-auto px-4 py-8">
          {" "}
          {/* ลด padding ด้านบนล่าง */}
          <div className="bg-white/70 backdrop-blur-md rounded-xl shadow-lg p-8 relative">
            <ProductGrid products={serializedProducts} />

            <div className="absolute -top-12 right-4">
              <div className="bg-white/80 backdrop-blur p-2 rounded-lg shadow-lg">
                <SortSelect defaultValue={searchParams.sort} />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  } catch (error) {
    console.error("Error loading products:", error);
    return (
      <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 py-12 max-w-7xl">
          <div className="bg-white rounded-xl shadow-sm p-12 text-center max-w-2xl mx-auto">
            <div className="mb-6">
              <svg
                className="w-16 h-16 text-red-500 mx-auto mb-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-red-600 mb-3">
              เกิดข้อผิดพลาดในการโหลดสินค้า
            </h2>
            <p className="text-gray-500">
              กรุณาลองใหม่อีกครั้ง หรือติดต่อผู้ดูแลระบบ
            </p>
          </div>
        </div>
      </main>
    );
  }
}

export const dynamic = "force-dynamic";
