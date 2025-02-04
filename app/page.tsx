// app/page.tsx
import Link from "next/link";
import Image from "next/image";
import { FaNewspaper, FaFileInvoice, FaProjectDiagram } from "react-icons/fa";
import HomeProject2020 from "./project2020/page";
import StorePage from "./products/page";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <main>
        <StorePage searchParams={{}} />
      {/* Footer Section */}
      <div className="bg-white py-12 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <p className="text-base text-gray-600 max-w-xl mx-auto">
              สำนักงานเครือข่ายองค์กรงดเหล้า<br />
              110/287-288 ม.6 ซอยโพธิ์แก้ว แยก 4<br />
              ถ.โพธิ์แก้ว แขวงคลองกุ่ม เขตบึงกุ่ม กทม. 10240
            </p>
            <Link
              href="https://sdnthailand.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-orange-500 transition-colors duration-200"
            >
              SDN Thailand Website
            </Link>
          </div>
        </div>
      </div>
    </main>
  </div>
);
}