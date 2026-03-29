import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, 
  Package, 
  Home,
  FileText,
  Leaf
} from 'lucide-react';

export default function OrderSuccess() {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order;

  useEffect(() => {
    if (!order) {
      navigate('/');
    }
  }, [order, navigate]);

  if (!order) return null;

  const handlePrintInvoice = () => {
    window.print();
  };

  const estimatedDelivery = new Date();
  estimatedDelivery.setDate(estimatedDelivery.getDate() + 5);

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-3xl mx-auto">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>
            <h1 className="heading-lg text-forest mb-2">Order Placed Successfully!</h1>
            <p className="body-lg text-warmbrown">
              Thank you for shopping with GreenRoots. Your order has been confirmed.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-2xl shadow-lg border border-ivory-200 overflow-hidden mb-6 print:shadow-none">
            <div className="bg-forest p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white/70 text-sm">Order Number</p>
                  <p className="font-heading text-2xl font-bold">{order.orderNumber}</p>
                </div>
                <div className="text-right">
                  <p className="text-white/70 text-sm">Order Date</p>
                  <p className="font-medium">
                    {new Date(order.createdAt).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center gap-4 p-4 bg-ivory-50 rounded-xl">
                <div className="w-12 h-12 bg-terracotta/10 rounded-full flex items-center justify-center">
                  <Package className="w-6 h-6 text-terracotta" />
                </div>
                <div>
                  <p className="font-medium text-forest">Order Status</p>
                  <p className="text-warmbrown">Order Placed - Awaiting Confirmation</p>
                </div>
              </div>

              {/* Estimated Delivery */}
              <div className="flex items-center gap-4 p-4 bg-green-50 rounded-xl">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="font-medium text-forest">Estimated Delivery</p>
                  <p className="text-warmbrown">
                    {estimatedDelivery.toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-heading text-lg font-semibold text-forest mb-4">Order Items</h3>
                <div className="space-y-3">
                  {order.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-ivory-200 last:border-0">
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
              </div>

              {/* Price Breakdown */}
              <div className="border-t border-ivory-200 pt-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Subtotal</span>
                    <span>₹{order.subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Tax</span>
                    <span className="text-green-600">Included</span>
                  </div>
                  <div className="flex items-center justify-between pt-2 border-t border-ivory-200">
                    <span className="font-heading text-xl font-semibold text-forest">Total</span>
                    <span className="font-heading text-2xl font-bold text-forest">
                      ₹{order.total.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Shipping Address */}
              <div className="border-t border-ivory-200 pt-4">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">Shipping Address</h3>
                <div className="text-warmbrown">
                  <p className="font-medium text-forest">{order.customerName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
                  <p>Pincode: {order.shippingAddress.pincode}</p>
                  <p className="mt-2">Phone: {order.customerPhone}</p>
                </div>
              </div>

              {/* Payment Method */}
              <div className="border-t border-ivory-200 pt-4">
                <h3 className="font-heading text-lg font-semibold text-forest mb-3">Payment Method</h3>
                <p className="text-warmbrown capitalize">
                  {order.paymentMethod === 'cod' && 'Cash on Delivery'}
                  {order.paymentMethod === 'upi' && 'UPI Payment'}
                  {order.paymentMethod === 'card' && 'Credit/Debit Card'}
                </p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-wrap gap-4 justify-center no-print">
            <Button 
              onClick={() => navigate('/shop')}
              className="btn-primary flex items-center gap-2"
            >
              <Home className="w-5 h-5" /> Continue Shopping
            </Button>
            <Button 
              onClick={() => navigate('/profile?tab=orders')}
              variant="outline"
              className="btn-outline flex items-center gap-2"
            >
              <Package className="w-5 h-5" /> View My Orders
            </Button>
            <Button 
              onClick={handlePrintInvoice}
              variant="outline"
              className="border-forest text-forest hover:bg-forest hover:text-white flex items-center gap-2"
            >
              <FileText className="w-5 h-5" /> Print Invoice
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
