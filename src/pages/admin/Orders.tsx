import { useState, useEffect } from 'react';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { 
  Search, 
  Eye, 
  Truck,
  CheckCircle,
  Package,
  Clock,
  Home,
  Loader2,
  Leaf,
  ArrowRight
} from 'lucide-react';
import { toast } from 'sonner';
import type { OrderStatus } from '@/types';

const orderStatuses: { value: OrderStatus; label: string; icon: React.ElementType }[] = [
  { value: 'order_placed', label: 'Order Placed', icon: Clock },
  { value: 'confirmed', label: 'Confirmed', icon: CheckCircle },
  { value: 'packed', label: 'Packed', icon: Package },
  { value: 'shipped', label: 'Shipped', icon: Truck },
  { value: 'out_for_delivery', label: 'Out for Delivery', icon: Truck },
  { value: 'delivered', label: 'Delivered', icon: Home },
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

export default function AdminOrders() {
  const { orders, fetchOrders, updateStatus, isLoading } = useOrderStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [newStatus, setNewStatus] = useState<OrderStatus>('order_placed');
  const [statusNote, setStatusNote] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customerEmail.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = !statusFilter || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setIsDetailModalOpen(true);
  };

  const handleUpdateStatus = (order: any) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setStatusNote('');
    setIsStatusModalOpen(true);
  };

  const handleStatusSubmit = async () => {
    if (!selectedOrder) return;

    setIsUpdating(true);
    try {
      await updateStatus(selectedOrder.$id, newStatus, statusNote);
      toast.success(`Order status updated to ${newStatus.replace(/_/g, ' ')}`);
      setIsStatusModalOpen(false);
      setSelectedOrder(null);
    } catch (error) {
      toast.error('Failed to update status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getNextStatus = (currentStatus: OrderStatus): OrderStatus | null => {
    const currentIndex = orderStatuses.findIndex(s => s.value === currentStatus);
    if (currentIndex < orderStatuses.length - 1) {
      return orderStatuses[currentIndex + 1].value;
    }
    return null;
  };

  const handleQuickUpdate = async (order: any) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) {
      toast.info('Order is already delivered');
      return;
    }

    try {
      await updateStatus(order.$id, nextStatus);
      toast.success(`Order status updated to ${nextStatus.replace(/_/g, ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="heading-lg text-forest">Orders</h1>
          <p className="text-warmbrown">Manage and track customer orders</p>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-ivory-200">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
            <Input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 input-organic"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map((status) => (
              <option key={status.value} value={status.value}>
                {status.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden">
        {isLoading ? (
          <div className="p-12 text-center">
            <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-12 text-center">
            <div className="w-16 h-16 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <Package className="w-8 h-8 text-forest/40" />
            </div>
            <p className="text-warmbrown">No orders found</p>
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
                  <th className="text-left px-6 py-4 text-sm font-medium text-forest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-ivory-200">
                {filteredOrders.map((order) => {
                  const StatusIcon = orderStatuses.find(s => s.value === order.status)?.icon || Clock;
                  const nextStatus = getNextStatus(order.status);
                  
                  return (
                    <tr key={order.$id} className="hover:bg-ivory-50">
                      <td className="px-6 py-4 font-medium text-forest">{order.orderNumber}</td>
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-medium text-forest">{order.customerName}</p>
                          <p className="text-sm text-warmbrown">{order.customerPhone}</p>
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
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetails(order)}
                            className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 hover:bg-blue-200 transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          {nextStatus && (
                            <button
                              onClick={() => handleQuickUpdate(order)}
                              className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center text-green-600 hover:bg-green-200 transition-colors"
                              title={`Mark as ${nextStatus.replace(/_/g, ' ')}`}
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => handleUpdateStatus(order)}
                            className="px-3 py-1 bg-forest text-white text-xs rounded-lg hover:bg-forest-800 transition-colors"
                          >
                            Update
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="heading-sm text-forest">
              Order Details - {selectedOrder?.orderNumber}
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="space-y-6 mt-4">
              {/* Customer Info */}
              <div className="bg-ivory-50 rounded-xl p-4">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">Customer Information</h3>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-warmbrown">Name</p>
                    <p className="font-medium text-forest">{selectedOrder.customerName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warmbrown">Email</p>
                    <p className="font-medium text-forest">{selectedOrder.customerEmail}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warmbrown">Phone</p>
                    <p className="font-medium text-forest">{selectedOrder.customerPhone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-warmbrown">Order Date</p>
                    <p className="font-medium text-forest">
                      {new Date(selectedOrder.createdAt).toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="bg-ivory-50 rounded-xl p-4">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">Shipping Address</h3>
                <p className="text-forest">{selectedOrder.shippingAddress.street}</p>
                <p className="text-forest">
                  {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}
                </p>
                <p className="text-forest">Pincode: {selectedOrder.shippingAddress.pincode}</p>
              </div>

              {/* Order Items */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">Order Items</h3>
                <div className="space-y-3">
                  {selectedOrder.items.map((item: any, idx: number) => (
                    <div key={idx} className="flex items-center justify-between py-3 border-b border-ivory-200">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-ivory-100 rounded-lg flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-forest/30" />
                        </div>
                        <div>
                          <p className="font-medium text-forest">{item.productName}</p>
                          <p className="text-sm text-warmbrown">Qty: {item.quantity}</p>
                        </div>
                      </div>
                      <p className="font-medium text-forest">
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between pt-4">
                  <span className="font-heading text-xl font-semibold text-forest">Total</span>
                  <span className="font-heading text-2xl font-bold text-forest">
                    ₹{selectedOrder.total.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Status History */}
              {selectedOrder.statusHistory && selectedOrder.statusHistory.length > 0 && (
                <div>
                  <h3 className="font-heading text-lg font-semibold text-forest mb-3">Status History</h3>
                  <div className="space-y-2">
                    {selectedOrder.statusHistory.map((update: any, idx: number) => (
                      <div key={idx} className="flex items-center gap-3 text-sm">
                        <div className="w-2 h-2 bg-forest rounded-full" />
                        <span className="text-warmbrown">
                          {new Date(update.timestamp).toLocaleString('en-IN')}
                        </span>
                        <span className="font-medium text-forest">
                          {update.status.replace(/_/g, ' ')}
                        </span>
                        {update.note && (
                          <span className="text-warmbrown">- {update.note}</span>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Status Modal */}
      <Dialog open={isStatusModalOpen} onOpenChange={setIsStatusModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="heading-sm text-forest">Update Order Status</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label className="text-forest font-medium">New Status</Label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as OrderStatus)}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30"
              >
                {orderStatuses.map((status) => (
                  <option key={status.value} value={status.value}>
                    {status.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label className="text-forest font-medium">Note (Optional)</Label>
              <textarea
                value={statusNote}
                onChange={(e) => setStatusNote(e.target.value)}
                className="w-full mt-1 px-4 py-3 rounded-lg border border-warmbrown/30 bg-white focus:outline-none focus:ring-2 focus:ring-forest/30 resize-none"
                rows={3}
                placeholder="Add a note about this status update..."
              />
            </div>
          </div>

          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setIsStatusModalOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleStatusSubmit}
              className="btn-primary"
              disabled={isUpdating}
            >
              {isUpdating ? (
                <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Updating...</>
              ) : (
                'Update Status'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
