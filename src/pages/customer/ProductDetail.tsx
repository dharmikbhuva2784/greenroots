import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Leaf, 
  ShoppingCart, 
  ArrowLeft, 
  Check, 
  Droplets, 
  Sun, 
  Thermometer,
  Minus,
  Plus,
  Share2,
  Heart
} from 'lucide-react';
import { toast } from 'sonner';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, fetchProducts } = useProductStore();
  const { addItem } = useCartStore();

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const product = products.find(p => p.$id === id);

  // Get related products
  const relatedProducts = products
    .filter(p => p.categoryId === product?.categoryId && p.$id !== id)
    .slice(0, 4);

  const handleAddToCart = () => {
    if (product) {
      addItem(product, quantity);
      toast.success(`${quantity} x ${product.name} added to cart!`);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product?.name,
        text: `Check out ${product?.name} on GreenRoots!`,
        url: window.location.href,
      });
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
    }
  };

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linen">
        <div className="text-center">
          <Leaf className="w-16 h-16 text-forest/30 mx-auto mb-4" />
          <h2 className="heading-md text-forest mb-2">Product Not Found</h2>
          <p className="text-warmbrown mb-6">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/shop')} className="btn-primary">
            Back to Shop
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Breadcrumb */}
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-warmbrown hover:text-forest transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back
          </button>

          {/* Product Details */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mb-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-square bg-white rounded-2xl overflow-hidden shadow-sm border border-ivory-200">
                {product.images && product.images.length > 0 ? (
                  <img 
                    src={product.images[selectedImage]} 
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-ivory-100">
                    <Leaf className="w-32 h-32 text-forest/20" />
                  </div>
                )}
              </div>
              
              {/* Thumbnail Gallery */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                        selectedImage === index ? 'border-forest' : 'border-transparent'
                      }`}
                    >
                      <img 
                        src={image} 
                        alt={`${product.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="space-y-6">
              {/* Category & Actions */}
              <div className="flex items-center justify-between">
                <span className="badge-green">{product.categoryName}</span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setIsWishlisted(!isWishlisted)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                      isWishlisted ? 'bg-red-100 text-red-500' : 'bg-ivory-100 text-warmbrown hover:bg-ivory-200'
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-10 h-10 rounded-full bg-ivory-100 flex items-center justify-center text-warmbrown hover:bg-ivory-200 transition-colors"
                  >
                    <Share2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Title */}
              <div>
                <h1 className="heading-lg text-forest mb-2">{product.name}</h1>
                {product.scientificName && (
                  <p className="text-lg text-warmbrown italic">
                    {product.scientificName}
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="flex items-baseline gap-4">
                <p className="heading-lg text-forest">
                  ₹{product.price.toLocaleString('en-IN')}
                </p>
                {product.stock > 0 ? (
                  <span className="badge-green flex items-center gap-1">
                    <Check className="w-3 h-3" /> In Stock
                  </span>
                ) : (
                  <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Description */}
              <p className="body-md text-warmbrown">{product.description}</p>

              {/* Quantity & Add to Cart */}
              <div className="flex flex-wrap items-center gap-4">
                <div className="flex items-center gap-3">
                  <span className="text-warmbrown">Quantity:</span>
                  <div className="flex items-center border border-warmbrown/30 rounded-lg">
                    <button
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 flex items-center justify-center hover:bg-ivory-100 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-medium">{quantity}</span>
                    <button
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      disabled={quantity >= product.stock}
                      className="w-10 h-10 flex items-center justify-center hover:bg-ivory-100 transition-colors disabled:opacity-50"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <Button
                  onClick={handleAddToCart}
                  disabled={product.stock === 0}
                  className="btn-primary flex-1 min-w-[200px] flex items-center justify-center gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-ivory-200">
                <div className="text-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Droplets className="w-6 h-6 text-blue-600" />
                  </div>
                  <p className="text-sm text-warmbrown">Regular Watering</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Sun className="w-6 h-6 text-yellow-600" />
                  </div>
                  <p className="text-sm text-warmbrown">Bright Light</p>
                </div>
                <div className="text-center">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-2">
                    <Thermometer className="w-6 h-6 text-green-600" />
                  </div>
                  <p className="text-sm text-warmbrown">Room Temperature</p>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden mb-16">
            <Tabs defaultValue="description" className="w-full">
              <TabsList className="w-full justify-start rounded-none border-b border-ivory-200 bg-ivory-50 p-0">
                <TabsTrigger 
                  value="description" 
                  className="rounded-none px-6 py-4 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-forest"
                >
                  Description
                </TabsTrigger>
                <TabsTrigger 
                  value="care"
                  className="rounded-none px-6 py-4 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-forest"
                >
                  Care Tips
                </TabsTrigger>
                <TabsTrigger 
                  value="shipping"
                  className="rounded-none px-6 py-4 data-[state=active]:bg-white data-[state=active]:border-b-2 data-[state=active]:border-forest"
                >
                  Shipping Info
                </TabsTrigger>
              </TabsList>

              <TabsContent value="description" className="p-6 lg:p-8">
                <div className="max-w-3xl">
                  <h3 className="heading-sm text-forest mb-4">About {product.name}</h3>
                  <p className="body-md text-warmbrown">{product.description}</p>
                  
                  <div className="mt-6 space-y-4">
                    <h4 className="font-heading text-lg font-semibold text-forest">Key Features</h4>
                    <ul className="space-y-2">
                      <li className="flex items-center gap-2 text-warmbrown">
                        <Check className="w-5 h-5 text-green-600" />
                        Premium quality, nursery-grown plant
                      </li>
                      <li className="flex items-center gap-2 text-warmbrown">
                        <Check className="w-5 h-5 text-green-600" />
                        Comes in a suitable pot with well-draining soil
                      </li>
                      <li className="flex items-center gap-2 text-warmbrown">
                        <Check className="w-5 h-5 text-green-600" />
                        Care guide included with every purchase
                      </li>
                      <li className="flex items-center gap-2 text-warmbrown">
                        <Check className="w-5 h-5 text-green-600" />
                        7-day health guarantee
                      </li>
                    </ul>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="care" className="p-6 lg:p-8">
                <div className="max-w-3xl">
                  <h3 className="heading-sm text-forest mb-4">Care Instructions</h3>
                  <p className="body-md text-warmbrown mb-6">
                    {product.careTips || 'Follow these general care tips to keep your plant healthy and thriving.'}
                  </p>
                  
                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="bg-ivory-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Droplets className="w-6 h-6 text-blue-600" />
                        <h4 className="font-heading text-lg font-semibold text-forest">Watering</h4>
                      </div>
                      <p className="text-warmbrown body-sm">
                        Water when the top inch of soil feels dry. Avoid overwatering to prevent root rot.
                      </p>
                    </div>
                    
                    <div className="bg-ivory-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Sun className="w-6 h-6 text-yellow-600" />
                        <h4 className="font-heading text-lg font-semibold text-forest">Light</h4>
                      </div>
                      <p className="text-warmbrown body-sm">
                        Place in bright, indirect light. Avoid direct afternoon sun which can scorch leaves.
                      </p>
                    </div>
                    
                    <div className="bg-ivory-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Thermometer className="w-6 h-6 text-green-600" />
                        <h4 className="font-heading text-lg font-semibold text-forest">Temperature</h4>
                      </div>
                      <p className="text-warmbrown body-sm">
                        Ideal temperature range is 18-30°C. Protect from cold drafts and sudden temperature changes.
                      </p>
                    </div>
                    
                    <div className="bg-ivory-50 rounded-xl p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <Leaf className="w-6 h-6 text-forest" />
                        <h4 className="font-heading text-lg font-semibold text-forest">Fertilizer</h4>
                      </div>
                      <p className="text-warmbrown body-sm">
                        Feed with organic compost or liquid fertilizer every 2-4 weeks during growing season.
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="shipping" className="p-6 lg:p-8">
                <div className="max-w-3xl">
                  <h3 className="heading-sm text-forest mb-4">Shipping Information</h3>
                  
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-medium text-forest">Free Delivery</h4>
                        <p className="text-warmbrown body-sm">
                          Free shipping on all orders above ₹499. Orders below ₹499 have a flat shipping fee of ₹49.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-medium text-forest">Delivery Time</h4>
                        <p className="text-warmbrown body-sm">
                          We deliver within 3-7 business days across India. Metro cities usually receive orders within 3-4 days.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-medium text-forest">Safe Packaging</h4>
                        <p className="text-warmbrown body-sm">
                          All plants are carefully packaged in eco-friendly materials to ensure they reach you in perfect condition.
                        </p>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <Check className="w-5 h-5 text-forest" />
                      </div>
                      <div>
                        <h4 className="font-medium text-forest">Live Delivery Guarantee</h4>
                        <p className="text-warmbrown body-sm">
                          We guarantee live delivery of all plants. In the rare case of damage during transit, we offer free replacement.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Related Products */}
          {relatedProducts.length > 0 && (
            <div>
              <h2 className="heading-md text-forest mb-6">You May Also Like</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 lg:gap-6">
                {relatedProducts.map((related) => (
                  <div 
                    key={related.$id}
                    className="group bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden hover:shadow-lg transition-all cursor-pointer"
                    onClick={() => navigate(`/product/${related.$id}`)}
                  >
                    <div className="aspect-square bg-ivory-100">
                      {related.images && related.images.length > 0 ? (
                        <img 
                          src={related.images[0]} 
                          alt={related.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-12 h-12 text-forest/20" />
                        </div>
                      )}
                    </div>
                    <div className="p-4">
                      <h3 className="font-heading text-base font-semibold text-forest line-clamp-1">
                        {related.name}
                      </h3>
                      <p className="text-sm font-medium text-forest mt-1">
                        ₹{related.price.toLocaleString('en-IN')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
