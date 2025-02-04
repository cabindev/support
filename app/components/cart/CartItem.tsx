// app/components/cart/CartItem.tsx
import Image from 'next/image';

type CartItemProps = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  size: string;
  image: string;
  onUpdateQuantity: (id: string, quantity: number) => void;
  onRemove: (id: string) => void;
}

export default function CartItem({
  id,
  name,
  price,
  quantity,
  size,
  image,
  onUpdateQuantity,
  onRemove
}: CartItemProps) {
  return (
    <tr>
      <td className="py-4">
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16">
            <Image 
              src={image || '/placeholder.jpg'} 
              alt={name}
              width={64}
              height={64}
              className="object-cover rounded-md"
            />
          </div>
          <div>
            <h3 className="font-medium">{name}</h3>
            <p className="text-sm text-gray-600">ไซส์: {size}</p>
          </div>
        </div>
      </td>
      <td className="text-right">฿{Number(price).toLocaleString()}</td>
      <td>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => onUpdateQuantity(id, quantity - 1)}
            disabled={quantity <= 1}
            className="w-8 h-8 rounded-full border hover:bg-gray-100 disabled:opacity-50"
          >
            -
          </button>
          <span className="w-8 text-center">{quantity}</span>
          <button
            onClick={() => onUpdateQuantity(id, quantity + 1)}
            className="w-8 h-8 rounded-full border hover:bg-gray-100"
          >
            +
          </button>
        </div>
      </td>
      <td className="text-right">฿{(Number(price) * quantity).toLocaleString()}</td>
      <td>
        <button 
          onClick={() => onRemove(id)}
          className="text-red-500 hover:text-red-700"
        >
          ลบ
        </button>
      </td>
    </tr>
  );
}