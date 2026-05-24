export interface Product {
  id: string;
  title: string;
  price: number;
  originalPrice: number;
  description: string;
  category: string;
  rating: number;
  ratingCount: number;
  sellerId: string;
  sellerName: string;
  image: string;
  specs: { [key: string]: string };
  stock: number;
  featured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  iconName: string;
  count: number;
}

export interface CartItem {
  id: string; // cart item id (product.id + option)
  product: Product;
  quantity: number;
  selectedSpec?: string;
}

export interface Order {
  id: string;
  date: string;
  items: {
    productId: string;
    title: string;
    quantity: number;
    price: number;
    image: string;
    sellerId: string;
  }[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    fullName: string;
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  trackingNumber?: string;
  paymentMethod: string;
}

export interface Seller {
  id: string;
  name: string;
  logo: string;
  rating: number;
  reviewCount: number;
  joinedDate: string;
  productsCount: number;
  balance: number;
  totalSales: number;
  commissionRate: number; // e.g. 0.10 for 10%
  isApproved: boolean;
  status: 'active' | 'pending' | 'suspended';
  email: string;
}

export interface Review {
  id: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  helpfulCount: number;
}

export interface HelpArticle {
  id: string;
  title: string;
  category: string;
  content: string;
  views: number;
}
