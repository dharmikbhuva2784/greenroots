import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { 
  Package, 
  CheckCircle, 
  Truck, 
  Home,
  Clock,
  Box,
  ClipboardCheck,
  Leaf,
  Loader2,
  ArrowRight
} from 'lucide-react';

const orderStatuses = [
  { key: 'order_placed', label: 'Order Placed', icon: ClipboardCheck },
  { key: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { key: 'packed', label: 'Packed', icon: Box },
  { key: 'shipped', label: 'Shipped', icon: Truck },
  { key: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { key: 'delivered', label: 'Delivered', icon: Home },
];

const statusColors: Record<string, string> = {
  order_placed: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function OrderTracking() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuthStore();
  const { orders, fetchUserOrders, isLoading } = useOrderStore();

  useEffect(() => {
    if (user?.$id) {
      fetchUserOrders(user.$id);
    }
  }, [user, fetchUserOrders]);

  const getStatusIndex = (status: string) => {
    return orderStatuses.findIndex(s => s.key === status);
  };

  // Sort orders: most recent first
  const sortedOrders = [...orders].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  // Most recent order (for detailed view)
  const recentOrder = sortedOrders[0];

  if (!isAuthenticated) {
    return (
      <div className="bg-linen min-h-screen pt-24 pb-16">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-forest/40" />
            </div>
            <h1 className="heading-lg text-forest mb-4">My Orders</h1>
            <p className="body-lg text-warmbrown mb-8">
              Please sign in to view your orders
            </p>
            <Button onClick={() => navigate('/login')} className="btn-primary">
              Sign In
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-lg text-forest mb-2">My Orders</h1>
            <p className="body-md text-warmbrown">
              Track your orders and view order history
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-forest" />
            </div>
          ) : sortedOrders.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-ivory-200">
              <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Package className="w-10 h-10 text-forest/40" />
              </div>
              <h2 className="heading-sm text-forest mb-2">No Orders Yet</h2>
              <p className="text-warmbrown mb-6">Start shopping to see your orders here</p>
              <Button onClick={() => navigate('/shop')} className="btn-primary">
                Start Shopping <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Recent Order Status */}
              {recentOrder && (
                <div className="bg-white rounded-2xl shadow-lg border border-ivory-200 overflow-hidden">
                  <div className="bg-forest p-6 text-white">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                      <div>
                        <p className="text-white/70 text-sm">Most Recent Order</p>
                        <p className="font-heading text-2xl font-bold">{recentOrder.orderNumber}</p>
                      </div>
                      <div className="text-left sm:text-right">
                        <p className="text-white/70 text-sm">Order Date</p>
                        <p className="font-medium">
                          {new Date(recentOrder.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 lg:p-8">
                    {/* Current Status */}
                    <div className="flex items-center gap-4 p-4 bg-ivory-50 rounded-xl mb-8">
                      <div className="w-14 h-14 bg-terracotta/10 rounded-full flex items-center justify-center">
                        <Package className="w-7 h-7 text-terracotta" />
                      </div>
                      <div>
                        <p className="text-warmbrown text-sm">Current Status</p>
                        <p className="font-heading text-xl font-semibold text-forest">
                          {orderStatuses.find(s => s.key === recentOrder.status)?.label || recentOrder.status}
                        </p>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div className="mb-8">
                      <h3 className="font-heading text-lg font-semibold text-forest mb-6">Order Progress</h3>
                      
                      <div className="relative">
                        {/* Progress Bar */}
                        <div className="absolute top-6 left-0 right-0 h-1 bg-ivory-200 rounded-full">
                          <div 
                            className="h-full bg-forest rounded-full transition-all duration-500"
                            style={{ 
                              width: `${(getStatusIndex(recentOrder.status) / (orderStatuses.length - 1)) * 100}%` 
                            }}
                          />
                        </div>

                        {/* Status Steps */}
                        <div className="relative flex justify-between">
                          {orderStatuses.map((status) => {
                            const statusIdx = getStatusIndex(status.key);
                            const currentIdx = getStatusIndex(recentOrder.status);
                            const isCompleted = statusIdx < currentIdx;
                            const isCurrent = statusIdx === currentIdx;
                            
                            return (
                              <div key={status.key} className="flex flex-col items-center">
                                <div 
                                  className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-all duration-300 ${
                                    isCompleted 
                                      ? 'bg-forest border-forest text-white' 
                                      : isCurrent
                                      ? 'bg-white border-forest text-forest'
                                      : 'bg-white border-ivory-200 text-warmbrown'
                                  }`}
                                >
                                  <status.icon className="w-5 h-5" />
                                </div>
                                <p className={`mt-3 text-xs text-center max-w-[80px] ${
                                  isCompleted || isCurrent
                                    ? 'text-forest font-medium'
                                    : 'text-warmbrown'
                                }`}>
                                  {status.label}
                                </p>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Order Items Summary */}
                    <div className="border-t border-ivory-200 pt-6">
                      <h3 className="font-heading text-lg font-semibold text-forest mb-4">Order Items</h3>
                      <div className="space-y-3">
                        {recentOrder.items.map((item: any, index: number) => (
                          <div key={index} className="flex items-center justify-between py-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-ivory-100 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-forest/30" />
                              </div>
                              <div>
                                <p className="font-medium text-forest text-sm">{item.productName}</p>
                                <p className="text-xs text-warmbrown">Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="text-sm font-medium text-forest">
                              ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t border-ivory-200 mt-4">
                        <span className="font-heading text-lg font-semibold text-forest">Total</span>
                        <span className="font-heading text-xl font-bold text-forest">
                          ₹{recentOrder.total.toLocaleString('en-IN')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* All Orders List */}
              <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
                <div className="p-6 border-b border-ivory-200">
                  <h2 className="heading-sm text-forest">All Orders</h2>
                </div>

                <div className="divide-y divide-ivory-200">
                  {sortedOrders.map((order) => {
                    const StatusIcon = orderStatuses.find(s => s.key === order.status)?.icon || Clock;
                    return (
                      <div key={order.$id} className="p-6 hover:bg-ivory-50 transition-colors">
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <p className="font-heading text-lg font-semibold text-forest">{order.orderNumber}</p>
                            <p className="text-sm text-warmbrown">
                              {new Date(order.createdAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'long',
                                year: 'numeric',
                              })}
                            </p>
                            <p className="text-sm text-warmbrown mt-1">{order.items.length} items</p>
                          </div>
                          <div className="text-right">
                            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${statusColors[order.status]}`}>
                              <StatusIcon className="w-3 h-3" />
                              {order.status.replace(/_/g, ' ')}
                            </span>
                            <p className="font-medium text-forest mt-2">
                              ₹{order.total.toLocaleString('en-IN')}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
