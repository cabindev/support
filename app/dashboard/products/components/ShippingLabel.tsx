// app/admin/products/components/ShippingLabel.tsx
'use client';

import React from 'react';

interface ShippingInfo {
 name: string;
 phone: string;
 address: string; 
 district: string;
 amphoe: string;
 province: string;
 zipcode: string;
}

interface ShippingLabelProps {
 orderId: string;
 shippingInfo: ShippingInfo;
}

export default function ShippingLabel({ orderId, shippingInfo }: ShippingLabelProps) {
 const handlePrint = () => {
   const printContent = document.getElementById('shipping-label');
   const windowPrint = window.open('', '', 'width=600,height=600');

   if (windowPrint && printContent) {
     windowPrint.document.write(`
       <html>
         <head>
           <title>พิมพ์ที่อยู่จัดส่ง #${orderId}</title>
           <style>
             @page {
               size: 100mm 150mm;
               margin: 0;
             }
             body {
               margin: 0;
               padding: 8mm;
               font-family: 'Sarabun', sans-serif;
             }
             .label-container {
               width: 84mm;
               height: 134mm;
               position: relative;
             }
             .content {
               height: 100%;
               display: flex;
               flex-direction: column;
               justify-content: space-between;
             }
             .main-info {
               margin-top: 5mm;
             }
             .name {
               font-size: 24px;
               font-weight: bold;
               margin-bottom: 3mm;
             }
             .phone {
               font-size: 20px;
               margin-bottom: 5mm;
             }
             .address {
               font-size: 18px;
               line-height: 1.4;
             }
             .footer {
               margin-top: auto;
               font-size: 14px;
               color: #666;
             }
           </style>
         </head>
         <body>
           <div class="label-container">
             <div class="content">
               <div class="main-info">
                 <div class="name">ผู้รับ: ${shippingInfo.name}</div>
                 <div class="phone">โทร: ${shippingInfo.phone}</div>
                 <div class="address">
                   ที่อยู่: ${shippingInfo.address}<br/>
                   ${shippingInfo.district} ${shippingInfo.amphoe}<br/>
                   ${shippingInfo.province} ${shippingInfo.zipcode}
                 </div>
               </div>
               <div class="footer">
                 เลขที่: #${orderId}
               </div>
             </div>
           </div>
         </body>
       </html>
     `);
     
     windowPrint.document.close();
     windowPrint.focus();
     setTimeout(() => {
       windowPrint.print();
       windowPrint.close();
     }, 250);
   }
 };

 return (
   <>
     <button
       onClick={handlePrint}
       className="inline-flex items-center px-4 py-2 border border-gray-300 
         rounded-md shadow-sm text-sm font-medium text-gray-700 
         bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 
         focus:ring-offset-2 focus:ring-violet-500"
     >
       <svg 
         className="-ml-1 mr-2 h-5 w-5 text-gray-500" 
         fill="none" 
         stroke="currentColor" 
         viewBox="0 0 24 24"
       >
         <path 
           strokeLinecap="round" 
           strokeLinejoin="round" 
           strokeWidth={2} 
           d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" 
         />
       </svg>
       พิมพ์ที่อยู่จัดส่ง
     </button>

     {/* Hidden element for reference */}
     <div id="shipping-label" className="hidden">
       <div className="content">
         <div className="main-info">
           <div className="name">ผู้รับ: {shippingInfo.name}</div>
           <div className="phone">โทร: {shippingInfo.phone}</div>
           <div className="address">
             ที่อยู่: {shippingInfo.address}<br/>
             {shippingInfo.district} {shippingInfo.amphoe}<br/>
             {shippingInfo.province} {shippingInfo.zipcode}
           </div>
         </div>
         <div className="footer">
           เลขที่: #{orderId}
         </div>
       </div>
     </div>
   </>
 );
}