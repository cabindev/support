// components/CustomFlipBook.tsx
'use client'
import React, { forwardRef } from 'react'
import dynamic from 'next/dynamic'

const HTMLFlipBook = dynamic(() => import('react-pageflip'), {
  ssr: false,
  loading: () => <p>Loading...</p>,
})

interface Props {
  pages: string[]
  width?: number
  height?: number
  onFlip?: (e: any) => void
}

interface PageProps {
  number: number
  image: string 
  children?: React.ReactNode
}

const Page = forwardRef<HTMLDivElement, PageProps>(({ number, image, children }, ref) => {
  return (
    <div className="demoPage" ref={ref}>
      <div className="page-content">
        <div className="page-image">
          <img 
            src={image}
            alt={`Page ${number}`}
            className="w-full h-full object-contain"
          />
          {children}
        </div>
        <div className="page-footer">{number}</div>
      </div>
    </div>
  )
})

Page.displayName = 'Page'

export default function CustomFlipBook({ pages, width = 800, height = 600, onFlip }: Props) {
 return (
   <div className="book-container">
     <HTMLFlipBook
       width={width}
       height={height}
       size="stretch"
       minWidth={315}  
       maxWidth={1000}
       minHeight={400}
       maxHeight={1533}
       maxShadowOpacity={0.5}
       showCover={true}
       mobileScrollSupport={true}
       className="demo-book"
       onFlip={onFlip}
     >
       {pages.map((pageUrl, index) => (
         <Page
           key={index}
           number={index + 1}
           image={pageUrl}
         />
       ))}
     </HTMLFlipBook>

     <style jsx global>{`
       .book-container {
         display: flex;
         justify-content: center;
         align-items: center;
         margin: 20px 0;
       }

       .demoPage {
         background-color: white;
         border-radius: 8px;
         box-shadow: 0 4px 8px rgba(0,0,0,0.1);
         overflow: hidden;
       }

       .page-content {
         width: 100%;
         height: 100%;
         display: flex;
         flex-direction: column;
         justify-content: space-between;
       }

       .page-image {
         width: 100%;
         height: calc(100% - 40px);
         position: relative;
       }

       .page-footer {
         height: 40px;
         display: flex;
         align-items: center;
         justify-content: center;
         background: #f3f4f6;
         color: #666;
         font-size: 14px;
       }

       .demo-book {
         border-radius: 8px;
         overflow: hidden;
       }
     `}</style>
   </div>
 )
}