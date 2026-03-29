import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { 
  Leaf, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ArrowLeft, 
  Lock,
  Check,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

export default function Checkout() {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { items, totalPrice, clearCart } = useCartStore();
  const { placeOrder } = useOrderStore();

  const [step, setStep] = useState<'shipping' | 'payment'>('shipping');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'cod'>('cod');

  // Shipping form state
  const [shippingData, setShippingData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  // Payment form state
  const [upiId, setUpiId] = useState('');
  const [cardData, setCardData] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: '',
  });

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate
    if (!shippingData.name || !shippingData.email || !shippingData.phone || 
        !shippingData.street || !shippingData.city || !shippingData.state || !shippingData.pincode) {
      toast.error('Please fill in all fields');
      return;
    }
    
    if (shippingData.phone.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    
    if (shippingData.pincode.length !== 6) {
      toast.error('Please enter a valid 6-digit pincode');
      return;
    }
    
    setStep('payment');
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (paymentMethod === 'upi' && !upiId) {
      toast.error('Please enter your UPI ID');
      return;
    }
    
    if (paymentMethod === 'card') {
      if (!cardData.number || !cardData.expiry || !cardData.cvv || !cardData.name) {
        toast.error('Please fill in all card details');
        return;
      }
    }
    
    setIsProcessing(true);
    
    try {
      // Prepare order items
      const orderItems = items.map(item => ({
        productId: item.product.$id,
        productName: item.product.name,
        scientificName: item.product.scientificName,
        quantity: item.quantity,
        price: item.product.price,
        imageUrl: item.product.images?.[0],
      }));
      
      // Generate order number
      const orderNumber = `GR-${new Date().getFullYear()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
      
      // Create order
      const order = await placeOrder({
        orderNumber,
        userId: user?.$id || 'guest',
        customerName: shippingData.name,
        customerEmail: shippingData.email,
        customerPhone: shippingData.phone,
        shippingAddress: {
          street: shippingData.street,
          city: shippingData.city,
          state: shippingData.state,
          pincode: shippingData.pincode,
        },
        items: orderItems,
        subtotal: totalPrice(),
        taxAmount: 0,
        taxPercentage: 0,
        total: totalPrice(),
        paymentMethod,
      });
      
      if (order) {
        clearCart();
        navigate('/order-success', { state: { order } });
      } else {
        toast.error('Failed to place order. Please try again.');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    navigate('/cart');
    return null;
  }

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <button
            onClick={() => step === 'payment' ? setStep('shipping') : navigate('/cart')}
            className="flex items-center gap-2 text-warmbrown hover:text-forest transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> {step === 'payment' ? 'Back to Shipping' : 'Back to Cart'}
          </button>

          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center gap-4">
              <div className={`flex items-center gap-2 ${step === 'shipping' ? 'text-forest' : 'text-green-600'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'shipping' ? 'bg-forest text-white' : 'bg-green-100'}`}>
                  {step === 'payment' ? <Check className="w-5 h-5" /> : '1'}
                </div>
                <span className="font-medium hidden sm:inline">Shipping</span>
              </div>
              <div className="w-16 h-0.5 bg-warmbrown/30" />
              <div className={`flex items-center gap-2 ${step === 'payment' ? 'text-forest' : 'text-warmbrown'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step === 'payment' ? 'bg-forest text-white' : 'bg-ivory-200'}`}>
                  2
                </div>
                <span className="font-medium hidden sm:inline">Payment</span>
              </div>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2">
              {step === 'shipping' ? (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200">
                  <h2 className="heading-sm text-forest mb-6">Shipping Information</h2>
                  
                  <form onSubmit={handleShippingSubmit} className="space-y-6">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name" className="text-forest font-medium">Full Name *</Label>
                        <Input
                          id="name"
                          value={shippingData.name}
                          onChange={(e) => setShippingData({ ...shippingData, name: e.target.value })}
                          className="input-organic mt-1"
                          placeholder="John Doe"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email" className="text-forest font-medium">Email Address *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={shippingData.email}
                          onChange={(e) => setShippingData({ ...shippingData, email: e.target.value })}
                          className="input-organic mt-1"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="phone" className="text-forest font-medium">Phone Number *</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={shippingData.phone}
                        onChange={(e) => setShippingData({ ...shippingData, phone: e.target.value })}
                        className="input-organic mt-1"
                        placeholder="+91 98765 43210"
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="street" className="text-forest font-medium">Street Address *</Label>
                      <Input
                        id="street"
                        value={shippingData.street}
                        onChange={(e) => setShippingData({ ...shippingData, street: e.target.value })}
                        className="input-organic mt-1"
                        placeholder="123, Main Street, Apartment 4B"
                        required
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-forest font-medium">City *</Label>
                        <Input
                          id="city"
                          value={shippingData.city}
                          onChange={(e) => setShippingData({ ...shippingData, city: e.target.value })}
                          className="input-organic mt-1"
                          placeholder="Bangalore"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-forest font-medium">State *</Label>
                        <Input
                          id="state"
                          value={shippingData.state}
                          onChange={(e) => setShippingData({ ...shippingData, state: e.target.value })}
                          className="input-organic mt-1"
                          placeholder="Karnataka"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="pincode" className="text-forest font-medium">Pincode *</Label>
                        <Input
                          id="pincode"
                          value={shippingData.pincode}
                          onChange={(e) => setShippingData({ ...shippingData, pincode: e.target.value })}
                          className="input-organic mt-1"
                          placeholder="560001"
                          maxLength={6}
                          required
                        />
                      </div>
                    </div>

                    <Button type="submit" className="w-full btn-primary py-4">
                      Continue to Payment
                    </Button>
                  </form>
                </div>
              ) : (
                <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200">
                  <h2 className="heading-sm text-forest mb-6">Payment Method</h2>
                  
                  <form onSubmit={handlePaymentSubmit} className="space-y-6">
                    {/* Payment Options */}
                    <div className="space-y-3">
                      {/* UPI */}
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'upi' ? 'border-forest bg-forest/5' : 'border-ivory-200'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="upi"
                          checked={paymentMethod === 'upi'}
                          onChange={() => setPaymentMethod('upi')}
                          className="w-5 h-5 text-forest"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Smartphone className="w-5 h-5 text-blue-600" />
                          </div>
                          <div>
                            <p className="font-medium text-forest">UPI Payment</p>
                            <p className="text-sm text-warmbrown">Pay using UPI ID</p>
                          </div>
                        </div>
                      </label>

                      {paymentMethod === 'upi' && (
                        <div className="ml-14">
                          <Input
                            value={upiId}
                            onChange={(e) => setUpiId(e.target.value)}
                            className="input-organic"
                            placeholder="yourname@upi"
                          />
                          <p className="text-xs text-warmbrown mt-2">
                            Enter your UPI ID (e.g., name@okaxis, name@paytm)
                          </p>
                        </div>
                      )}

                      {/* Card */}
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'card' ? 'border-forest bg-forest/5' : 'border-ivory-200'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="w-5 h-5 text-forest"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                            <CreditCard className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-forest">Credit/Debit Card</p>
                            <p className="text-sm text-warmbrown">Pay securely with your card</p>
                          </div>
                        </div>
                      </label>

                      {paymentMethod === 'card' && (
                        <div className="ml-14 space-y-4">
                          <div>
                            <Label className="text-forest">Card Number</Label>
                            <Input
                              value={cardData.number}
                              onChange={(e) => setCardData({ ...cardData, number: e.target.value })}
                              className="input-organic mt-1"
                              placeholder="1234 5678 9012 3456"
                              maxLength={16}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <Label className="text-forest">Expiry Date</Label>
                              <Input
                                value={cardData.expiry}
                                onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                                className="input-organic mt-1"
                                placeholder="MM/YY"
                                maxLength={5}
                              />
                            </div>
                            <div>
                              <Label className="text-forest">CVV</Label>
                              <Input
                                value={cardData.cvv}
                                onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                                className="input-organic mt-1"
                                placeholder="123"
                                maxLength={3}
                                type="password"
                              />
                            </div>
                          </div>
                          <div>
                            <Label className="text-forest">Cardholder Name</Label>
                            <Input
                              value={cardData.name}
                              onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                              className="input-organic mt-1"
                              placeholder="Name on card"
                            />
                          </div>
                        </div>
                      )}

                      {/* COD */}
                      <label className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                        paymentMethod === 'cod' ? 'border-forest bg-forest/5' : 'border-ivory-200'
                      }`}>
                        <input
                          type="radio"
                          name="payment"
                          value="cod"
                          checked={paymentMethod === 'cod'}
                          onChange={() => setPaymentMethod('cod')}
                          className="w-5 h-5 text-forest"
                        />
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                            <Banknote className="w-5 h-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium text-forest">Cash on Delivery</p>
                            <p className="text-sm text-warmbrown">Pay when you receive</p>
                          </div>
                        </div>
                      </label>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-warmbrown">
                      <Lock className="w-4 h-4" />
                      <span>Your payment information is secure and encrypted</span>
                    </div>

                    <Button 
                      type="submit" 
                      className="w-full btn-primary py-4"
                      disabled={isProcessing}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="w-5 h-5 animate-spin mr-2" />
                          Processing...
                        </>
                      ) : (
                        `Pay ₹${totalPrice().toLocaleString('en-IN')}`
                      )}
                    </Button>
                  </form>
                </div>
              )}
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200">
                <h2 className="heading-sm text-forest mb-6">Order Summary</h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-64 overflow-y-auto custom-scrollbar">
                  {items.map((item) => (
                    <div key={item.product.$id} className="flex gap-3">
                      <div className="w-16 h-16 bg-ivory-100 rounded-lg flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Leaf className="w-6 h-6 text-forest/30" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-forest text-sm truncate">{item.product.name}</p>
                        <p className="text-xs text-warmbrown">Qty: {item.quantity}</p>
                        <p className="text-sm font-medium text-forest">
                          ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <Separator className="bg-ivory-200 mb-6" />

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Subtotal</span>
                    <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Shipping</span>
                    <span className="text-green-600">Free</span>
                  </div>
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Tax</span>
                    <span className="text-green-600">Included</span>
                  </div>
                </div>

                <Separator className="bg-ivory-200 mb-6" />

                <div className="flex items-center justify-between">
                  <span className="font-heading text-xl font-semibold text-forest">Total</span>
                  <span className="font-heading text-2xl font-bold text-forest">
                    ₹{totalPrice().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
