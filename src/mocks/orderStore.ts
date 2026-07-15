import { useState, useEffect } from 'react';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  customerPoints: number;
  serviceName: string;
  quantity: number;
  unit: string;
  amount: number;
  paymentStatus: 'PAID' | 'UNPAID' | 'PARTIAL';
  paymentMethod: 'CASH' | 'BANK_TRANSFER' | 'UNPAID';
  status: 'RECEIVED' | 'WASHING' | 'DRYING_IRONING' | 'READY' | 'RETURNED' | 'CANCELLED';
  createdAt: string;
  notes?: string;
}

export interface Customer {
  name: string;
  phone: string;
  points: number;
}

export interface Service {
  id: string;
  name: string;
  price: number;
  unit: string;
}

export const mockCustomers: Customer[] = [
  { name: 'Nguyễn Văn An', phone: '0901234567', points: 120 },
  { name: 'Trần Thị Bình', phone: '0912345678', points: 80 }
];

export const mockServices: Service[] = [
  { id: 's1', name: 'Giặt sấy theo kg', price: 15000, unit: 'kg' },
  { id: 's2', name: 'Giặt hấp áo vest', price: 80000, unit: 'cái' },
  { id: 's3', name: 'Vệ sinh giày', price: 60000, unit: 'đôi' }
];

// Initial mock orders in-memory
let orders: Order[] = [
  {
    id: 'DL-001',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    customerPoints: 120,
    serviceName: 'Giặt sấy theo kg',
    quantity: 5,
    unit: 'kg',
    amount: 75000,
    paymentStatus: 'PAID',
    paymentMethod: 'CASH',
    status: 'RECEIVED',
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    notes: 'Giặt riêng áo trắng'
  },
  {
    id: 'DL-002',
    customerName: 'Trần Thị Bình',
    customerPhone: '0912345678',
    customerPoints: 80,
    serviceName: 'Giặt hấp áo vest',
    quantity: 2,
    unit: 'cái',
    amount: 160000,
    paymentStatus: 'PAID',
    paymentMethod: 'BANK_TRANSFER',
    status: 'WASHING',
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString()
  },
  {
    id: 'DL-003',
    customerName: 'Nguyễn Văn An',
    customerPhone: '0901234567',
    customerPoints: 120,
    serviceName: 'Vệ sinh giày',
    quantity: 1,
    unit: 'đôi',
    amount: 60000,
    paymentStatus: 'UNPAID',
    paymentMethod: 'UNPAID',
    status: 'READY',
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    notes: 'Vệ sinh kỹ gót giày'
  }
];

const listeners = new Set<() => void>();

export const orderStore = {
  getOrders() {
    return orders;
  },
  addOrder(order: Order) {
    orders = [order, ...orders];
    listeners.forEach((l) => l());
  },
  updateOrderStatus(id: string, status: Order['status']) {
    orders = orders.map((o) => (o.id === id ? { ...o, status } : o));
    listeners.forEach((l) => l());
  },
  updateOrderPayment(id: string, paymentStatus: Order['paymentStatus'], paymentMethod: Order['paymentMethod']) {
    orders = orders.map((o) => (o.id === id ? { ...o, paymentStatus, paymentMethod } : o));
    listeners.forEach((l) => l());
  },
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  }
};

export function useOrderStore() {
  const [currentOrders, setCurrentOrders] = useState(orderStore.getOrders());

  useEffect(() => {
    return orderStore.subscribe(() => {
      setCurrentOrders(orderStore.getOrders());
    });
  }, []);

  return {
    orders: currentOrders,
    addOrder: orderStore.addOrder,
    updateOrderStatus: orderStore.updateOrderStatus,
    updateOrderPayment: orderStore.updateOrderPayment
  };
}
