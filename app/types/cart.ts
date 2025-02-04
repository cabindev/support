// app/types/cart.ts
export interface CartProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    size: {
      id: string;
      name: string;
    };
  }
  
  export interface CartItem {
    id: string;
    quantity: number;
    product: CartProduct;
  }
  
  export interface CartSummary {
    subtotal: number;
    total: number;
  }
  
  export interface CartDrawerProps {
    isOpen: boolean;
    onClose: () => void;
    items?: CartItem[];
    onUpdateQuantity?: (itemId: string, quantity: number) => void;
    onRemoveItem?: (itemId: string) => void;
  }