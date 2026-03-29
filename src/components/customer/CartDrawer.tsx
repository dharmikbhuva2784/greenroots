import { useNavigate } from 'react-router-dom';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { 
  Plus, 
  Minus, 
  ShoppingBag, 
  Trash2, 
  ArrowRight,
  Leaf
} from 'lucide-react';

export default function CartDrawer() {
  const navigate = useNavigate();
  const { items, isOpen, closeCart, totalItems, totalPrice, updateQuantity, removeItem } = useCartStore();

  const handleCheckout = () => {
    closeCart();
    navigate('/checkout');
  };

  return (
    <Sheet open={isOpen} onOpenChange={closeCart}>
      <SheetContent className="w-full sm:max-w-lg flex flex-col bg-linen">
        <SheetHeader className="space-y-2.5 pb-4">
          <SheetTitle className="flex items-center gap-2 text-forest font-heading text-2xl">
            <ShoppingBag className="w-6 h-6" />
            Your Cart
            {totalItems() > 0 && (
              <span className="text-sm font-body font-normal text-warmbrown">
                ({totalItems()} items)
              </span>
            )}
          </SheetTitle>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <div className="w-24 h-24 bg-forest/10 rounded-full flex items-center justify-center mb-6">
              <Leaf className="w-12 h-12 text-forest/40" />
            </div>
            <h3 className="heading-sm text-forest mb-2">Your cart is empty</h3>
            <p className="text-warmbrown body-md mb-6 max-w-xs">
              Looks like you haven't added any plants to your cart yet. Explore our collection!
            </p>
            <Button onClick={() => { closeCart(); navigate('/shop'); }} className="btn-primary">
              Start Shopping
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar -mx-6 px-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <div 
                    key={item.product.$id}
                    className="bg-white rounded-xl p-4 shadow-sm border border-ivory-200"
                  >
                    <div className="flex gap-4">
                      {/* Product Image */}
                      <div className="w-20 h-20 bg-ivory-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        {item.product.images && item.product.images.length > 0 ? (
                          <img 
                            src={item.product.images[0]} 
                            alt={item.product.name}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <Leaf className="w-8 h-8 text-forest/30" />
                        )}
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <h4 className="font-medium text-forest truncate">{item.product.name}</h4>
                            {item.product.scientificName && (
                              <p className="text-xs text-warmbrown italic truncate">
                                {item.product.scientificName}
                              </p>
                            )}
                          </div>
                          <button
                            onClick={() => removeItem(item.product.$id)}
                            className="text-warmbrown/60 hover:text-red-500 transition-colors p-1"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="flex items-center justify-between mt-3">
                          {/* Quantity Controls */}
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(item.product.$id, item.quantity - 1)}
                              className="w-7 h-7 rounded-full bg-ivory-100 flex items-center justify-center hover:bg-forest hover:text-white transition-colors"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center font-medium">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.product.$id, item.quantity + 1)}
                              disabled={item.quantity >= item.product.stock}
                              className="w-7 h-7 rounded-full bg-ivory-100 flex items-center justify-center hover:bg-forest hover:text-white transition-colors disabled:opacity-50"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>

                          {/* Price */}
                          <p className="font-semibold text-forest">
                            ₹{(item.product.price * item.quantity).toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Cart Footer */}
            <div className="border-t border-ivory-200 pt-4 mt-4 space-y-4">
              {/* Price Breakdown */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-warmbrown">
                  <span>Subtotal</span>
                  <span>₹{totalPrice().toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between text-warmbrown">
                  <span>Shipping</span>
                  <span className="text-green-600">Free</span>
                </div>
                <Separator className="bg-ivory-200" />
                <div className="flex items-center justify-between">
                  <span className="font-heading text-lg font-semibold text-forest">Total</span>
                  <span className="font-heading text-xl font-bold text-forest">
                    ₹{totalPrice().toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-2">
                <Button onClick={handleCheckout} className="w-full btn-primary flex items-center justify-center gap-2">
                  Proceed to Checkout <ArrowRight className="w-4 h-4" />
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => { closeCart(); navigate('/shop'); }}
                  className="w-full border-forest text-forest hover:bg-forest hover:text-white"
                >
                  Continue Shopping
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
