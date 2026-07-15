import { lazy, Suspense } from 'react';
import { createBrowserRouter, Navigate } from 'react-router';
import type { RouteObject } from 'react-router';

import CustomerLayout from '../layouts/CustomerLayout';
import StoreLayout from '../layouts/StoreLayout';
import AdminLayout from '../layouts/AdminLayout';

import CustomerHome from '../../pages/customer/CustomerHome';
import CustomerTrack from '../../pages/customer/CustomerTrack';
import CustomerLoyalty from '../../pages/customer/CustomerLoyalty';
import StoreDashboard from '../../pages/store/StoreDashboard';
import StoreOrders from '../../pages/store/StoreOrders';
import StoreOrdersNew from '../../pages/store/StoreOrdersNew';
import StoreOperations from '../../pages/store/StoreOperations';
import AdminDashboard from '../../pages/admin/AdminDashboard';
import AdminPartners from '../../pages/admin/AdminPartners';
import LoginPage from '../../pages/LoginPage';
import GenericPlaceholderPage from '../../pages/GenericPlaceholderPage';

// Lazy load DevUiPage so it's not bundled in production
const DevUiPage = lazy(() => import('../../pages/dev/DevUiPage'));

const routes: RouteObject[] = [
  {
    path: '/',
    element: <Navigate to="/login" replace />,
  },
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/customer',
    element: <CustomerLayout />,
    children: [
      { index: true, element: <CustomerHome /> },
      { path: 'orders', element: <GenericPlaceholderPage /> },
      { path: 'track', element: <CustomerTrack /> },
      { path: 'loyalty', element: <CustomerLoyalty /> },
      { path: 'profile', element: <GenericPlaceholderPage /> },
    ],
  },
  {
    path: '/store',
    element: <StoreLayout />,
    children: [
      { index: true, element: <Navigate to="/store/dashboard" replace /> },
      { path: 'dashboard', element: <StoreDashboard /> },
      { path: 'orders', element: <StoreOrders /> },
      { path: 'orders/new', element: <StoreOrdersNew /> },
      { path: 'operations', element: <StoreOperations /> },
      { path: 'customers', element: <GenericPlaceholderPage /> },
      { path: 'inventory', element: <GenericPlaceholderPage /> },
      { path: 'staff', element: <GenericPlaceholderPage /> },
      { path: 'reports', element: <GenericPlaceholderPage /> },
      { path: 'settings', element: <GenericPlaceholderPage /> },
    ],
  },
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      { index: true, element: <Navigate to="/admin/dashboard" replace /> },
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'partners', element: <AdminPartners /> },
      { path: 'users', element: <GenericPlaceholderPage /> },
      { path: 'reports', element: <GenericPlaceholderPage /> },
      { path: 'settings', element: <GenericPlaceholderPage /> },
    ],
  },
];

// Register development-only UI gallery
if (import.meta.env.DEV) {
  routes.push({
    path: '/dev/ui',
    element: (
      <Suspense fallback={<div className="p-8 text-xs font-semibold">Đang tải UI Gallery...</div>}>
        <DevUiPage />
      </Suspense>
    ),
  });
}

export const router = createBrowserRouter(routes);
export default router;
