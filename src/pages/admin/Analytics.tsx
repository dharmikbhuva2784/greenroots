import { useState, useEffect, useMemo } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { useProductStore } from '@/store/productStore';
import { 
  IndianRupee, 
  ShoppingCart, 
  Package, 
  TrendingUp,
  Download
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AdminAnalytics() {
  const { orders, fetchOrders } = useOrderStore();
  const { products, fetchProducts } = useProductStore();
  
  const [dateRange, setDateRange] = useState<'7days' | '30days' | '90days' | 'all'>('30days');

  useEffect(() => {
    fetchOrders();
    fetchProducts();
  }, [fetchOrders, fetchProducts]);

  // Filter orders by date range
  const filteredOrders = useMemo(() => {
    if (dateRange === 'all') return orders;
    
    const now = new Date();
    const days = dateRange === '7days' ? 7 : dateRange === '30days' ? 30 : 90;
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    
    return orders.filter(order => new Date(order.createdAt) >= cutoffDate);
  }, [orders, dateRange]);

  // Calculate statistics
  const stats = useMemo(() => {
    const totalRevenue = filteredOrders
      .filter(o => o.status !== 'cancelled')
      .reduce((sum, o) => sum + o.total, 0);
    
    const totalOrders = filteredOrders.length;
    const completedOrders = filteredOrders.filter(o => o.status === 'delivered').length;
    const pendingOrders = filteredOrders.filter(o => 
      !['delivered', 'cancelled'].includes(o.status)
    ).length;
    
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Product sales
    const productSales: Record<string, { name: string; quantity: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = {
            name: item.productName,
            quantity: 0,
            revenue: 0,
          };
        }
        productSales[item.productId].quantity += item.quantity;
        productSales[item.productId].revenue += item.price * item.quantity;
      });
    });

    const topProducts = Object.entries(productSales)
      .sort((a, b) => b[1].revenue - a[1].revenue)
      .slice(0, 10);

    // Daily sales for chart
    const dailySales: Record<string, { orders: number; revenue: number }> = {};
    filteredOrders.forEach(order => {
      const date = new Date(order.createdAt).toISOString().split('T')[0];
      if (!dailySales[date]) {
        dailySales[date] = { orders: 0, revenue: 0 };
      }
      dailySales[date].orders += 1;
      if (order.status !== 'cancelled') {
        dailySales[date].revenue += order.total;
      }
    });

    return {
      totalRevenue,
      totalOrders,
      completedOrders,
      pendingOrders,
      averageOrderValue,
      topProducts,
      dailySales,
    };
  }, [filteredOrders]);

  const handleExport = () => {
    // Create CSV content
    const csvContent = [
      ['Order Number', 'Date', 'Customer', 'Status', 'Total'].join(','),
      ...filteredOrders.map(order => [
        order.orderNumber,
        new Date(order.createdAt).toLocaleDateString('en-IN'),
        order.customerName,
        order.status,
        order.total,
      ].join(',')),
    ].join('\n');

    // Download CSV
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `orders-${dateRange}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const statCards = [
    {
      title: 'Total Revenue',
      value: `₹${stats.totalRevenue.toLocaleString('en-IN')}`,
      icon: IndianRupee,
      color: 'bg-green-500',
    },
    {
      title: 'Total Orders',
      value: stats.totalOrders,
      icon: ShoppingCart,
      color: 'bg-blue-500',
    },
    {
      title: 'Completed Orders',
      value: stats.completedOrders,
      icon: Package,
      color: 'bg-purple-500',
    },
    {
      title: 'Average Order Value',
      value: `₹${Math.round(stats.averageOrderValue).toLocaleString('en-IN')}`,
      icon: TrendingUp,
      color: 'bg-terracotta',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-forest">Analytics</h1>
          <p className="text-warmbrown">Track your business performance</p>
        </div>
        <div className="flex gap-2">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as any)}
            className="px-4 py-2 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
          >
            <option value="7days">Last 7 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
            <option value="all">All Time</option>
          </select>
          <Button onClick={handleExport} variant="outline" className="border-forest text-forest">
            <Download className="w-4 h-4 mr-2" /> Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
        {statCards.map((card, index) => (
          <div 
            key={index}
            className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200"
          >
            <div className={`w-12 h-12 ${card.color} rounded-xl flex items-center justify-center mb-4`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
            <p className="text-warmbrown text-sm">{card.title}</p>
            <p className="font-heading text-2xl font-bold text-forest">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Order Status Breakdown */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200">
        <h2 className="heading-sm text-forest mb-6">Order Status Breakdown</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { label: 'Order Placed', key: 'order_placed', color: 'bg-yellow-500' },
            { label: 'Confirmed', key: 'confirmed', color: 'bg-blue-500' },
            { label: 'Packed', key: 'packed', color: 'bg-purple-500' },
            { label: 'Shipped', key: 'shipped', color: 'bg-indigo-500' },
            { label: 'Out for Delivery', key: 'out_for_delivery', color: 'bg-orange-500' },
            { label: 'Delivered', key: 'delivered', color: 'bg-green-500' },
          ].map((status) => {
            const count = filteredOrders.filter(o => o.status === status.key).length;
            const percentage = stats.totalOrders > 0 ? (count / stats.totalOrders) * 100 : 0;
            
            return (
              <div key={status.key} className="text-center p-4 bg-ivory-50 rounded-xl">
                <div className={`w-3 h-3 ${status.color} rounded-full mx-auto mb-2`} />
                <p className="font-heading text-2xl font-bold text-forest">{count}</p>
                <p className="text-sm text-warmbrown">{status.label}</p>
                <p className="text-xs text-warmbrown/60">{percentage.toFixed(1)}%</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        <div className="p-6 border-b border-ivory-200">
          <h2 className="heading-sm text-forest">Top Selling Products</h2>
        </div>
        
        {stats.topProducts.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-warmbrown">No sales data available for this period</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Rank</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Product Name</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Quantity Sold</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {stats.topProducts.map(([productId, data], index) => (
                  <tr key={productId} className="hover:bg-ivory-50">
                    <td className="px-6 py-4">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center font-medium ${
                        index < 3 ? 'bg-terracotta text-white' : 'bg-ivory-200 text-warmbrown'
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium text-forest">{data.name}</td>
                    <td className="px-6 py-4 text-warmbrown">{data.quantity} units</td>
                    <td className="px-6 py-4 font-medium text-forest">
                      ₹{data.revenue.toLocaleString('en-IN')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Daily Sales Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200">
        <h2 className="heading-sm text-forest mb-6">Daily Sales</h2>
        
        {Object.keys(stats.dailySales).length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-warmbrown">No sales data available for this period</p>
          </div>
        ) : (
          <div className="space-y-4">
            {Object.entries(stats.dailySales)
              .sort((a, b) => b[0].localeCompare(a[0]))
              .slice(0, 14)
              .map(([date, data]) => (
                <div key={date} className="flex items-center gap-4">
                  <div className="w-24 text-sm text-warmbrown">
                    {new Date(date).toLocaleDateString('en-IN', { 
                      day: 'numeric', 
                      month: 'short' 
                    })}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 bg-ivory-100 rounded-full h-4 overflow-hidden">
                        <div 
                          className="bg-forest h-full rounded-full transition-all"
                          style={{ 
                            width: `${Math.min(100, (data.revenue / (stats.totalRevenue / Object.keys(stats.dailySales).length)) * 100)}%` 
                          }}
                        />
                      </div>
                      <div className="w-32 text-right">
                        <p className="font-medium text-forest text-sm">
                          ₹{data.revenue.toLocaleString('en-IN')}
                        </p>
                        <p className="text-xs text-warmbrown">{data.orders} orders</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Low Stock Alert */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        <div className="p-6 border-b border-ivory-200">
          <h2 className="heading-sm text-forest">Low Stock Alert</h2>
        </div>
        
        {products.filter(p => p.stock < 10).length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-warmbrown">All products have sufficient stock</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-ivory-50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Product</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Category</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Current Stock</th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {products
                  .filter(p => p.stock < 10)
                  .sort((a, b) => a.stock - b.stock)
                  .map((product) => (
                    <tr key={product.$id} className="hover:bg-ivory-50">
                      <td className="px-6 py-4 font-medium text-forest">{product.name}</td>
                      <td className="px-6 py-4 text-warmbrown">{product.categoryName}</td>
                      <td className="px-6 py-4">
                        <span className={`font-medium ${
                          product.stock === 0 ? 'text-red-600' : 
                          product.stock < 5 ? 'text-orange-600' : 'text-yellow-600'
                        }`}>
                          {product.stock} units
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                          product.stock === 0 ? 'bg-red-100 text-red-800' : 
                          product.stock < 5 ? 'bg-orange-100 text-orange-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {product.stock === 0 ? 'Out of Stock' : 'Low Stock'}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
