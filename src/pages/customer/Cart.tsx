import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  Leaf, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  ShoppingBag,
  ArrowLeft
} from 'lucide-react';
import { toast } from 'sonner';

export default function Cart() {
  const navigate = useNavigate();
  const { items, totalItems, totalPrice, updateQuantity, removeItem, clearCart } = useCartStore();

  const handleCheckout = () => {
    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }
    navigate('/checkout');
  };

  if (items.length === 0) {
    return (
      <div className="bg-linen min-h-screen pt-24 pb-16">
        <div className="section-padding">
          <div className="max-w-2xl mx-auto text-center py-16">
            <div className="w-24 h-24 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
              <Leaf className="w-12 h-12 text-forest/40" />
            </div>
            <h1 className="heading-lg text-forest mb-4">Your Cart is Empty</h1>
            <p className="text-warmbrown body-lg mb-8">
              Looks like you haven't added any plants to your cart yet. 
              Explore our collection and find your perfect green companion!
            </p>
            <Button onClick={() => navigate('/shop')} className="btn-primary">
              Start Shopping <ArrowRight className="w-5 h-5 ml-2" />
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="heading-lg text-forest mb-2">Shopping Cart</h1>
              <p className="text-warmbrown">
                You have <span className="font-medium text-forest">{totalItems()}</span> items in your cart
              </p>
            </div>
            <button
              onClick={() => navigate('/shop')}
              className="flex items-center gap-2 text-warmbrown hover:text-forest transition-colors"
            >
              <ArrowLeft className="w-4 h-4" /> Continue Shopping
            </button>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div 
                  key={item.product.$id}
                  className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-ivory-200"
                >
                  <div className="flex gap-4 lg:gap-6">
                    {/* Product Image */}
                    <div 
                      className="w-24 h-24 lg:w-32 lg:h-32 bg-ivory-100 rounded-xl flex-shrink-0 cursor-pointer"
                      onClick={() => navigate(`/product/${item.product.$id}`)}
                    >
                      {item.product.images && item.product.images.length > 0 ? (
                        <img 
                          src={item.product.images[0]} 
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-xl"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-8 h-8 lg:w-12 lg:h-12 text-forest/30" />
                        </div>
                      )}
                    </div>

                    {/* Product Details */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 
                            className="font-heading text-lg lg:text-xl font-semibold text-forest cursor-pointer hover:text-terracotta transition-colors"
                            onClick={() => navigate(`/product/${item.product.$id}`)}
                          >
                            {item.product.name}
                          </h3>
                          {item.product.scientificName && (
                            <p className="text-sm text-warmbrown italic">
                              {item.product.scientificName}
                            </p>
                          )}
                          <p className="text-sm text-terracotta mt-1">{item.product.categoryName}</p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.$id)}
                          className="text-warmbrown/60 hover:text-red-500 transition-colors p-2"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <span className="text-sm text-warmbrown hidden sm:inline">Qty:</span>
                          <div className="flex items-center border border-warmbrown/30 rounded-lg">
                            <button
                              onClick={() => updateQuantity(item.product.$id, item.quantity - 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-ivory-100 transition-colors"
                            >
                              <Minus className="w-4 h-4" />
                            </button>
                            <span className="w-10 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.$id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-8 h-8 flex items-center justify-center hover:bg-ivory-100 transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <p className="text-lg lg:text-xl font-bold text-forest">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                          <p className="text-sm text-warmbrown">
                            ₹{item.product.price.toLocaleString('en-IN')} each
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Clear Cart Button */}
              <button
                onClick={clearCart}
                className="text-terracotta hover:underline text-sm"
              >
                Clear entire cart
              </button>
            </div>

            {/* Order Summary */}
            <div className="lg:sticky lg:top-24 h-fit">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200">
                <h2 className="heading-sm text-forest mb-6">Order Summary</h2>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between text-warmbrown">
                    <span>Subtotal ({totalItems()} items)</span>
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

                <div className="flex items-center justify-between mb-6">
                  <span className="font-heading text-xl font-semibold text-forest">Total</span>
                  <span className="font-heading text-2xl font-bold text-forest">
                    ₹{totalPrice().toLocaleString('en-IN')}
                  </span>
                </div>

                <Button 
                  onClick={handleCheckout}
                  className="w-full btn-primary flex items-center justify-center gap-2 py-4"
                >
                  Proceed to Checkout <ArrowRight className="w-5 h-5" />
                </Button>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-warmbrown">
                  <ShoppingBag className="w-4 h-4" />
                  <span>Secure checkout</span>
                </div>
              </div>

              {/* Promo Code */}
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200 mt-4">
                <h3 className="font-heading text-lg font-semibold text-forest mb-4">Have a promo code?</h3>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-4 py-2 rounded-lg border border-warmbrown/30 focus:outline-none focus:ring-2 focus:ring-forest/30"
                  />
                  <Button variant="outline" className="border-forest text-forest hover:bg-forest hover:text-white">
                    Apply
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
