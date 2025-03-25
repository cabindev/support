'use client'

import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();
  const excludePaths = ['/auth/signin', '/auth/form_signup', '/404', '/500'];
  
  // ไม่แสดงเมื่อเป็นหน้า dashboard หรืออยู่ในรายการที่ยกเว้น
  const showNavbar = !pathname?.startsWith('/dashboard') && 
                     !excludePaths.some(path => pathname?.startsWith(path));

  if (!showNavbar) return null;
  return <Navbar />;
}