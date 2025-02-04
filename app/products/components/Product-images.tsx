// app/products/components/product-images.tsx
'use client'

import { useState } from 'react';
import Image from 'next/image';

type ProductImagesProps = {
  images: string[];
  name: string;
}
const NO_IMAGE = '/images/no-image.jpg';

export default function ProductImages({ images, name }: ProductImagesProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const imageList = images.length > 0 ? images : [NO_IMAGE];


  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-lg overflow-hidden bg-white">
        <Image
          src={imageList[selectedImage]}
          alt={`${name} - View ${selectedImage + 1}`}
          fill
          className="object-contain"
          priority={selectedImage === 0}
        />
      </div>

      {imageList.length > 1 && (
        <div className="grid grid-cols-5 gap-2">
          {imageList.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedImage(index)}
              className={`relative aspect-square rounded-lg overflow-hidden bg-white transition-all ${
                selectedImage === index 
                  ? 'ring-2 ring-violet-500' 
                  : 'hover:ring-2 hover:ring-violet-300'
              }`}
            >
              <Image
                src={image}
                alt={`${name} thumbnail ${index + 1}`}
                fill
                className="object-contain"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}