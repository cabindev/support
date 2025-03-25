'use client'
import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSession, signOut } from "next-auth/react";
import { useRouter, usePathname } from 'next/navigation';
import { HiMenuAlt3 } from "react-icons/hi";
import { IoIosArrowDown } from "react-icons/io";
import { MdLanguage } from "react-icons/md";
import { useLanguage } from '@/app/contexts/LanguageContext';

// การแปลสำหรับ Navbar
const navTranslations = {
 home: {
   th: 'หน้าแรก',
   en: 'Home'
 },
 organization: {
   th: 'องค์กร',
   en: 'Organization'
 },
 mission: {
   th: 'ปณิธาน',
   en: 'Mission'
 },
 principles: {
   th: 'หลักการ',
   en: 'Principles'
 },
 orgChart: {
   th: 'โครงสร้างองค์กร',
   en: 'Organization Chart'
 },
 project2567: {
   th: 'โครงการปี 2567',
   en: 'Projects 2024'
 },
 contact: {
   th: 'ติดต่อ',
   en: 'Contact'
 },
 support: {
   th: 'Support',
   en: 'Support'
 },
 campaignMedia: {
   th: 'ขอสื่อรณรงค์',
   en: 'Campaign Media'
 },
 procurement: {
   th: 'จัดซื้อ',
   en: 'Procurement'
 },
 store: {
   th: 'ร้านค้า',
   en: 'Store'
 },
 allProducts: {
   th: 'สินค้าทั้งหมด',
   en: 'All Products'
 },
 manageProducts: {
   th: 'จัดการสินค้า',
   en: 'Manage Products'
 },
 dashboard: {
   th: 'แดชบอร์ด',
   en: 'Dashboard'
 },
 profile: {
   th: 'โปรไฟล์',
   en: 'Profile'
 },
 signOut: {
   th: 'ออกจากระบบ',
   en: 'Sign Out'
 },
 signIn: {
   th: 'เข้าสู่ระบบ',
   en: 'Sign In'
 },
 switchToThai: {
   th: 'TH',
   en: 'TH'
 },
 switchToEnglish: {
   th: 'EN',
   en: 'EN'
 },
};

const Navbar: React.FC = () => {
 const { data: session } = useSession();
 const router = useRouter();
 const pathname = usePathname();
 const { language, setLanguage } = useLanguage();
 const [isMenuOpen, setIsMenuOpen] = useState(false);
 const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
 const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
 const [visible, setVisible] = useState(true);
 const [prevScrollPos, setPrevScrollPos] = useState(0);
 const menuRef = useRef<HTMLDivElement>(null);

 // Handle scroll behavior
 useEffect(() => {
   const handleScroll = () => {
     const currentScrollPos = window.scrollY;
     const isScrollingDown = prevScrollPos < currentScrollPos;
     
     setVisible(
       !isScrollingDown || 
       currentScrollPos < 10 || 
       isMobileMenuOpen
     );
     
     setPrevScrollPos(currentScrollPos);
   };

   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, [prevScrollPos, isMobileMenuOpen]);

 // Close mobile menu on scroll
 useEffect(() => {
   if (isMobileMenuOpen && prevScrollPos > 0) {
     setIsMobileMenuOpen(false);
   }
 }, [prevScrollPos]);

 const handleSignOut = async () => {
   await signOut({ redirect: false });
   router.push('/');
 };

 const toggleLanguage = () => {
   setLanguage(language === 'th' ? 'en' : 'th');
 };

 const isAdmin = session?.user?.role === 'ADMIN';

 const navItems = [
   { 
     href: 'https://sdnthailand.com/', 
     label: navTranslations.home[language as keyof typeof navTranslations.home] 
   },
   { 
     href: '/about', 
     label: navTranslations.organization[language as keyof typeof navTranslations.organization],
     subItems: [
       { href: '/about/mission', label: navTranslations.mission[language as keyof typeof navTranslations.mission] },
       { href: '/about/principle', label: navTranslations.principles[language as keyof typeof navTranslations.principles] },
       { href: '/about/chart', label: navTranslations.orgChart[language as keyof typeof navTranslations.orgChart] },
       { href: '/about/project2567', label: navTranslations.project2567[language as keyof typeof navTranslations.project2567] },
     ]
   },
   { 
     href: '/about/contact', 
     label: navTranslations.contact[language as keyof typeof navTranslations.contact] 
   },
   { 
     href: '/support', 
     label: navTranslations.support[language as keyof typeof navTranslations.support],
     subItems: [
       { href: '/support', label: navTranslations.campaignMedia[language as keyof typeof navTranslations.campaignMedia] },
       { href: '/procurement', label: navTranslations.procurement[language as keyof typeof navTranslations.procurement] },
       { href: '/products', label: navTranslations.store[language as keyof typeof navTranslations.store] },
     ]
   },
   { 
     href: '/products', 
     label: navTranslations.store[language as keyof typeof navTranslations.store],
     subItems: [
       { href: '/products', label: navTranslations.allProducts[language as keyof typeof navTranslations.allProducts] },
       ...(isAdmin ? [{ href: '/dashboard/products', label: navTranslations.manageProducts[language as keyof typeof navTranslations.manageProducts] }] : []),
     ]
   },
   ...(isAdmin ? [{ href: '/dashboard', label: navTranslations.dashboard[language as keyof typeof navTranslations.dashboard] }] : []),
 ];

 useEffect(() => {
   const handleClickOutside = (event: MouseEvent) => {
     if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
       setIsMenuOpen(false);
     }
   };

   document.addEventListener('mousedown', handleClickOutside);
   return () => document.removeEventListener('mousedown', handleClickOutside);
 }, []);

 const toggleSubmenu = (href: string) => {
   setOpenSubmenu(openSubmenu === href ? null : href);
 };

 const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

 return (
   <nav 
     className={`
       fixed w-full z-50 transition-all duration-300
       ${visible ? 'translate-y-0' : '-translate-y-full'}
       ${prevScrollPos > 0 ? 'bg-white/80 shadow-sm backdrop-blur-md' : 'bg-transparent'}
     `}
   >
     <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
       <div className="flex justify-between h-16">
         {/* Logo and SDN THAILAND */}
         <div className="flex-shrink-0 flex items-center space-x-3">
           <Link href="/">
             <Image src="/logo.png" alt="Logo" width={50} height={50} priority />
           </Link>
           
           <Link 
             href="https://sdnthailand.com" 
             target="_blank"
             rel="noopener noreferrer"
             className="hidden sm:block text-center leading-tight hover:text-orange-500 transition-colors"
           >
             <span className={`block text-base font-medium ${
               prevScrollPos > 0 ? "text-gray-900" : "text-gray-600"
             }`}>
               SDN THAILAND
             </span>
           </Link>
         </div>

         {/* Center Desktop Navigation */}
         <div className="hidden md:flex items-center justify-center flex-1">
           <div className="flex space-x-8">
             {navItems.map((item) => (
               <div key={item.href} className="relative">
                 {item.subItems ? (
                   <div className="relative">
                     <button
                       onClick={() => toggleSubmenu(item.href)}
                       className={`${
                         pathname?.startsWith(item.href)
                           ? "text-orange-500"
                           : prevScrollPos > 0 
                             ? "text-gray-500 hover:text-gray-900"
                             : "text-gray-600 hover:text-orange-500"
                       } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200`}
                     >
                       {item.label}
                       <IoIosArrowDown 
                         className={`ml-1 w-4 h-4 transition-transform duration-200 ${
                           openSubmenu === item.href ? 'rotate-180' : ''
                         }`} 
                       />
                     </button>
                     
                     {openSubmenu === item.href && (
                       <div className="absolute left-0 mt-1 w-56 bg-white rounded-md shadow-lg py-1 z-50 border">
                         {item.subItems.map((subItem) => (
                           <Link
                             key={subItem.href}
                             href={subItem.href}
                             className={`block px-4 py-2 text-sm ${
                               pathname === subItem.href
                                 ? "text-orange-500 bg-gray-50"
                                 : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                             }`}
                             onClick={() => setOpenSubmenu(null)}
                           >
                             {subItem.label}
                           </Link>
                         ))}
                       </div>
                     )}
                   </div>
                 ) : (
                   <Link
                     href={item.href}
                     className={`${
                       pathname === item.href
                         ? "text-orange-500"
                         : prevScrollPos > 0 
                           ? "text-gray-500 hover:text-gray-900"
                           : "text-gray-600 hover:text-orange-500"
                     } inline-flex items-center px-1 pt-1 text-sm font-medium transition-colors duration-200`}
                   >
                     {item.label}
                   </Link>
                 )}
               </div>
             ))}
           </div>
         </div>

         {/* Profile, Language Switch and Mobile Menu Button */}
         <div className="flex items-center space-x-3">
           {/* Language Toggle Button */}
           <button
             onClick={toggleLanguage}
             className={`flex items-center space-x-1 px-3 py-1 rounded-full border ${
               prevScrollPos > 0 
                 ? "text-gray-700 border-gray-300 hover:text-orange-500 hover:border-orange-300"
                 : "text-gray-600 border-gray-200 hover:text-orange-500 hover:border-orange-300"
             }`}
           >
             <MdLanguage className="w-4 h-4" />
             <span className="text-sm font-medium">
               {language === 'th' ? navTranslations.switchToEnglish.th : navTranslations.switchToThai.en}
             </span>
           </button>

           {session ? (
             <div className="relative ml-3 hidden md:block" ref={menuRef}>
               <button
                 onClick={() => setIsMenuOpen(!isMenuOpen)}
                 className="flex items-center space-x-2 text-sm focus:outline-none"
               >
                 <img
                   className="h-8 w-8 rounded-full object-cover border border-gray-200"
                   src={session.user?.image || "/images/default-avatar.png"}
                   alt="Profile"
                 />
                 <span className={`text-gray-700`}>{session.user?.firstName}</span>
                 <IoIosArrowDown className={`w-4 h-4 ${
                   prevScrollPos > 0 ? "text-gray-700" : "text-gray-600"
                 }`} />
               </button>

               {isMenuOpen && (
                 <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border">
                   <Link
                     href="/profile"
                     className="block px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                     onClick={() => setIsMenuOpen(false)}
                   >
                     {navTranslations.profile[language as keyof typeof navTranslations.profile]}
                   </Link>
                   <button
                     onClick={handleSignOut}
                     className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                   >
                     {navTranslations.signOut[language as keyof typeof navTranslations.signOut]}
                   </button>
                 </div>
               )}
             </div>
           ) : (
             <div className="hidden md:flex items-center">
               <Link
                 href="/auth/signin"
                 className={`text-sm font-medium ${
                   prevScrollPos > 0 
                     ? "text-gray-700 hover:text-orange-500"
                     : "text-gray-600 hover:text-orange-500"
                 }`}
               >
                 {navTranslations.signIn[language as keyof typeof navTranslations.signIn]}
               </Link>
             </div>
           )}

           {/* Mobile Menu Button */}
           <button
             onClick={toggleMobileMenu}
             className={`md:hidden p-2 rounded-md ${
               prevScrollPos > 0 
                 ? "text-gray-400 hover:text-orange-500"
                 : "text-gray-600 hover:text-orange-500"
             }`}
           >
             <HiMenuAlt3 className="h-6 w-6" />
           </button>
         </div>
       </div>
     </div>

     {/* Mobile Menu */}
     {isMobileMenuOpen && (
       <div className="md:hidden border-t bg-white">
         <div className="pt-2 pb-3 space-y-1">
           {navItems.map((item) => (
             <div key={item.href}>
               {item.subItems ? (
                 <div>
                   <button
                     onClick={() => toggleSubmenu(item.href)}
                     className="w-full flex items-center justify-between px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                   >
                     <span>{item.label}</span>
                     <IoIosArrowDown 
                       className={`w-4 h-4 transition-transform duration-200 ${
                         openSubmenu === item.href ? 'rotate-180' : ''
                       }`} 
                     />
                   </button>
                   
                   {openSubmenu === item.href && (
                     <div className="bg-gray-50 py-1">
                       {item.subItems.map((subItem) => (
                         <Link
                           key={subItem.href}
                           href={subItem.href}
                           className={`block pl-8 pr-4 py-2 text-sm ${
                             pathname === subItem.href
                               ? "text-orange-500 bg-orange-50"
                               : "text-gray-600 hover:bg-orange-50 hover:text-orange-500"
                           }`}
                           onClick={() => {
                             setOpenSubmenu(null);
                             setIsMobileMenuOpen(false);
                           }}
                         >
                           {subItem.label}
                         </Link>
                       ))}
                     </div>
                   )}
                 </div>
               ) : (
                 <Link
                   href={item.href}
                   className={`block px-4 py-2 text-base font-medium ${
                     pathname === item.href
                       ? "text-orange-500 bg-orange-50"
                       : "text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                   }`}
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {item.label}
                 </Link>
               )}
             </div>
           ))}

           {/* Mobile Profile Section */}
           <div className="border-t border-gray-200 pt-4">
             {session ? (
               <>
                 <div className="px-4 py-2 flex items-center">
                   <img
                     className="h-8 w-8 rounded-full object-cover border border-gray-200"
                     src={session.user?.image || "/images/default-avatar.png"}
                     alt="Profile"
                   />
                   <span className="ml-3 text-base font-medium text-gray-700">
                     {session.user?.firstName}
                   </span>
                 </div>
                 <Link
                   href="/profile"
                   className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                   onClick={() => setIsMobileMenuOpen(false)}
                 >
                   {navTranslations.profile[language as keyof typeof navTranslations.profile]}
                 </Link>
                 <button
                   onClick={() => {
                     handleSignOut();
                     setIsMobileMenuOpen(false);
                   }}
                   className="w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                 >
                   {navTranslations.signOut[language as keyof typeof navTranslations.signOut]}
                 </button>
               </>
             ) : (
               <Link
                 href="/auth/signin"
                 className="block px-4 py-2 text-base font-medium text-gray-700 hover:bg-orange-50 hover:text-orange-500"
                 onClick={() => setIsMobileMenuOpen(false)}
               >
                 {navTranslations.signIn[language as keyof typeof navTranslations.signIn]}
               </Link>
             )}
           </div>
         </div>
       </div>
     )}
   </nav>
 );
};

export default Navbar;