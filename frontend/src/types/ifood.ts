// Tipos para integração com API do iFood

export interface IFoodOrder {
  id: string;
  shortId: string;
  displayId: string;
  orderType: 'DELIVERY' | 'TAKEOUT';
  status: 'PLACED' | 'CONFIRMED' | 'INTEGRATED' | 'DISPATCHED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  confirmedAt?: string;
  deliveredAt?: string;
  customer: IFoodCustomer;
  delivery: IFoodDelivery;
  items: IFoodOrderItem[];
  total: IFoodOrderTotal;
  payments: IFoodPayment[];
  observations?: string;
}

export interface IFoodCustomer {
  id: string;
  name: string;
  phoneNumber: string;
  email?: string;
  document?: string;
}

export interface IFoodDelivery {
  address: IFoodAddress;
  estimatedTime?: string;
  deliveryFee: number;
  deliveryMethod: 'DELIVERY' | 'TAKEOUT';
}

export interface IFoodAddress {
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zipCode: string;
  reference?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface IFoodOrderItem {
  id: string;
  name: string;
  description?: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  category: string;
  externalCode?: string;
  observations?: string;
}

export interface IFoodOrderTotal {
  itemsTotal: number;
  deliveryFee: number;
  benefits: number;
  orderTotal: number;
  additionalFees: number;
}

export interface IFoodPayment {
  id: string;
  method: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PIX' | 'CASH' | 'FOOD_VOUCHER';
  type: 'ONLINE' | 'OFFLINE';
  value: number;
  status: 'PENDING' | 'PAID' | 'FAILED';
}

export interface IFoodWebhookEvent {
  eventType: 'ORDER_PLACED' | 'ORDER_CONFIRMED' | 'ORDER_DISPATCHED' | 'ORDER_DELIVERED' | 'ORDER_CANCELLED';
  orderId: string;
  merchantId: string;
  timestamp: string;
  data: IFoodOrder;
}

export interface IFoodIntegrationConfig {
  merchantId: string;
  clientId: string;
  clientSecret: string;
  webhookUrl: string;
  isActive: boolean;
}

export interface IFoodOrderSummary {
  totalOrders: number;
  totalRevenue: number;
  averageOrderValue: number;
  topProducts: Array<{
    name: string;
    quantity: number;
    revenue: number;
  }>;
  ordersByStatus: Record<string, number>;
}
