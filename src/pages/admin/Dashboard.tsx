import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { 
  ShoppingCart, 
  Package, 
  IndianRupee, 
  TrendingUp,
  Clock,
  CheckCircle,
  Truck,
  Home,
  ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const statusIcons: Record<string, React.ElementType> = {
  order_placed: Clock,
  confirmed: CheckCircle,
  packed: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
};

const statusColors: Record<string, string> = {
  order_placed: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const { orders, fetchOrders, getOrderStats } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    lowStockProducts: 0,
  });

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  useEffect(() => {
    const orderStats = getOrderStats();
    const lowStock = products.filter(p => p.stock < 10).length;
    
    setStats({
      totalOrders: orderStats.totalOrders,
      pendingOrders: orderStats.pendingOrders,
      completedOrders: orderStats.completedOrders,
      totalRevenue: orderStats.totalRevenue,
      totalProducts: products.length,
      lowStockProducts: lowStock,
    });
  }, [orders, products, getOrderStats]);

  // Get recent orders
  const recentOrders = orders.slice(0, 5);

  const statCards = [
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
      trend: '+12%',
      link: '/admin/orders',
    },
    {
      title: 'Pending Orders',
      value: stats.pendingOrders,
      icon: Clock,
      color: 'bg-yellow-500',
      trend: null,
      link: '/admin/orders',
    },
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-green-500',
      trend: '+8%',
      link: '/admin/analytics',
    },
    {
      title: 'Products in Stock',
      value: stats.totalProducts,
      icon: Package,
      color: 'bg-purple-500',
      subtext: stats.lowStockProducts > 0 ? `${stats.lowStockProducts} low stock` : null,
      link: '/admin/products',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-forest">Dashboard</h1>
          <p className="text-warmbrown">Welcome back! Here's what's happening today.</p>
        </div>
        <div className="flex gap-2">
          <Button 
            onClick={() => navigate('/admin/products')}
            className="btn-primary"
          >
            <Package className="w-4 h-4 mr-2" /> Manage Products
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index}
            onClick={() => navigate(card.link)}
            className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200 cursor-pointer hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center`}>
                <card.icon className="w-6 h-6 text-white" />
              </div>
              {card.trend && (
                <span className="flex items-center gap-1 text-green-600 text-sm font-medium">
                  <TrendingUp className="w-4 h-4" /> {card.trend}
                </span>
              )}
            </div>
            <p className="text-warmbrown text-sm">{card.title}</p>
            <p className="font-heading text-2xl font-bold text-forest">{card.value}</p>
            {card.subtext && (
              <p className="text-terracotta text-sm mt-1">{card.subtext}</p>
            )}
          </div>
        ))}
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        <div className="p-6 border-b border-ivory-200 flex items-center justify-between">
          <h2 className="heading-sm text-forest">Recent Orders</h2>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/admin/orders')}
            className="text-forest hover:bg-forest/10"
          >
            View All <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>

        {recentOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingCart className="w-8 h-8 text-forest/40" />
            </div>
            <p className="text-warmbrown">No orders yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Order ID</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Customer</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Items</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Total</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Status</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {recentOrders.map((order) => {
                  const StatusIcon = statusIcons[order.status] || Clock;
                  return (
                    <tr 
                      key={order.$id} 
                      className="hover:bg-ivory-50 cursor-pointer"
                      onClick={() => navigate('/admin/orders')}
                    >
                      <td className="px-6 py-4 font-medium text-forest">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-forest">{order.customerName}</p>
                          <p className="text-sm text-warmbrown">{order.customerEmail}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-warmbrown">{order.items.length} items</td>
                      <td className="px-6 py-4 font-medium text-forest">
                        ₹{order.total.toLocaleString('en-IN')}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                          <StatusIcon className="w-3 h-3" />
                          {order.status.replace(/_/g, ' ')}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-warmbrown">
                        {new Date(order.createdAt).toLocaleDateString('en-IN')}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 lg:gap-6">
        <div 
          onClick={() => navigate('/admin/products')}
          className="bg-forest rounded-2xl p-6 text-white cursor-pointer hover:bg-forest-800 transition-colors"
        >
          <Package className="w-8 h-8 mb-4" />
          <h3 className="font-heading text-xl font-semibold mb-2">Manage Products</h3>
          <p className="text-white/70 text-sm">Add, edit, or remove products from your catalog</p>
        </div>

        <div 
          onClick={() => navigate('/admin/orders')}
          className="bg-terracotta rounded-2xl p-6 text-white cursor-pointer hover:bg-terracotta-600 transition-colors"
        >
          <ShoppingCart className="w-8 h-8 mb-4" />
          <h3 className="font-heading text-xl font-semibold mb-2">Process Orders</h3>
          <p className="text-white/70 text-sm">Update order statuses and manage deliveries</p>
        </div>

        <div 
          onClick={() => navigate('/admin/analytics')}
          className="bg-warmbrown rounded-2xl p-6 text-white cursor-pointer hover:bg-warmbrown-600 transition-colors"
        >
          <TrendingUp className="w-8 h-8 mb-4" />
          <h3 className="font-heading text-xl font-semibold mb-2">View Analytics</h3>
          <p className="text-white/70 text-sm">Track sales, revenue, and business growth</p>
        </div>
      </div>
    </div>
  );
}
