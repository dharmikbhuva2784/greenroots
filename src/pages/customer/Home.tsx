import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { useOrderStore } from '@/store/orderStore';
import { useReviewStore } from '@/store/reviewStore';
import { Button } from '@/components/ui/button';
import { 
  ArrowRight, 
  Leaf, 
  Truck, 
  Shield, 
  Headphones,
  Star,
  ShoppingCart,
  Check
} from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const navigate = useNavigate();
  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProductStore();
  const { fetchOrders, getOrderStats } = useOrderStore();
  const { reviews } = useReviewStore();
  const { addItem, openCart } = useCartStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
    fetchOrders();
  }, [fetchCategories, fetchProducts, fetchOrders]);

  const orderStats = getOrderStats();
  
  // Calculate average rating
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc: number, r: { rating: number }) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  // Get featured products (first 8)
  const featuredProducts = products.slice(0, 8);

  const features = [
    {
      icon: Truck,
      title: 'Free Delivery',
      description: 'Free shipping on orders above ₹499',
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: 'Healthy plants or money back',
    },
    {
      icon: Headphones,
      title: 'Expert Support',
      description: 'Gardening advice from our experts',
    },
    {
      icon: Leaf,
      title: '100% Organic',
      description: 'Naturally grown, chemical-free',
    },
  ];

  const testimonials = [
    {
      name: 'Priya Sharma',
      location: 'Bangalore',
      rating: 5,
      text: 'The plants arrived in perfect condition! The packaging was excellent and the plants are thriving in my balcony garden.',
    },
    {
      name: 'Rahul Kumar',
      location: 'Mumbai',
      rating: 5,
      text: 'Amazing quality and great customer service. They helped me choose the right plants for my apartment. Highly recommended!',
    },
    {
      name: 'Anita Patel',
      location: 'Delhi',
      rating: 5,
      text: 'Love the organic compost and vermicompost. My plants have never looked healthier. Fast delivery too!',
    },
  ];

  return (
    <div className="bg-linen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center pt-20">
        {/* Background Pattern */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-forest/5 to-transparent" />
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl" />
          <svg 
            className="absolute top-20 right-20 w-64 h-64 text-forest/10 animate-pulse"
            viewBox="0 0 100 100"
            fill="currentColor"
          >
            <path d="M50 10 Q30 30 20 50 Q30 70 50 90 Q70 70 80 50 Q70 30 50 10" />
          </svg>
        </div>

        <div className="relative section-padding w-full">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Hero Content */}
              <div className="space-y-6 lg:space-y-8">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 rounded-full">
                  <Leaf className="w-4 h-4 text-forest" />
                  <span className="text-sm font-medium text-forest">100% Organic & Natural</span>
                </div>

                <h1 className="heading-xl text-forest">
                  Bring Nature<br />
                  <span className="text-terracotta">Into Your Home</span>
                </h1>

                <p className="body-lg text-warmbrown max-w-lg">
                  Discover our curated collection of organic plants, gardening essentials, 
                  and expert care tips. Start your green journey today with GreenRoots.
                </p>

                <div className="flex flex-wrap gap-4">
                  <Button 
                    onClick={() => navigate('/shop')}
                    className="btn-primary flex items-center gap-2 text-lg px-8 py-4"
                  >
                    Shop Now <ArrowRight className="w-5 h-5" />
                  </Button>
                  <Button 
                    variant="outline"
                    onClick={() => navigate('/about')}
                    className="btn-outline text-lg px-8 py-4"
                  >
                    Learn More
                  </Button>
                </div>

                {/* Stats - Dynamic */}
                <div className="flex flex-wrap gap-8 pt-4">
                  <div>
                    <p className="heading-md text-forest">{products.length}+</p>
                    <p className="text-warmbrown body-sm">Plant Varieties</p>
                  </div>
                  <div>
                    <p className="heading-md text-forest">{orderStats.totalOrders}+</p>
                    <p className="text-warmbrown body-sm">Orders Delivered</p>
                  </div>
                  <div>
                    <p className="heading-md text-forest">{averageRating}</p>
                    <p className="text-warmbrown body-sm">Customer Rating</p>
                  </div>
                </div>
              </div>

              {/* Hero Image */}
              <div className="relative hidden lg:block">
                <div className="relative w-full aspect-square">
                  <div className="absolute inset-0 bg-gradient-to-br from-forest/20 to-terracotta/20 rounded-3xl" />
                  <img 
                    src="https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=800&h=800&fit=crop"
                    alt="Beautiful indoor plants"
                    className="w-full h-full object-cover rounded-3xl shadow-2xl"
                  />
                  
                  {/* Floating Cards */}
                  <div className="absolute -left-8 top-1/4 bg-white rounded-xl p-4 shadow-lg animate-bounce">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                        <Check className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-forest">Organic</p>
                        <p className="text-xs text-warmbrown">Certified</p>
                      </div>
                    </div>
                  </div>

                  <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl p-4 shadow-lg animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-terracotta/10 rounded-full flex items-center justify-center">
                        <Star className="w-5 h-5 text-terracotta fill-terracotta" />
                      </div>
                      <div>
                        <p className="font-medium text-forest">4.9 Rating</p>
                        <p className="text-xs text-warmbrown">2k+ Reviews</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {features.map((feature, index) => (
                <div 
                  key={index}
                  className="text-center p-6 rounded-2xl bg-ivory-50 hover:bg-forest/5 transition-colors"
                >
                  <div className="w-14 h-14 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <feature.icon className="w-7 h-7 text-forest" />
                  </div>
                  <h3 className="font-heading text-lg font-semibold text-forest mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-warmbrown body-sm">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-lg text-forest mb-4">Shop by Category</h2>
              <p className="body-lg text-warmbrown max-w-2xl mx-auto">
                Explore our wide range of organic plants and gardening essentials
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {categories.slice(0, 8).map((category) => (
                <button
                  key={category.$id}
                  onClick={() => navigate(`/shop?category=${category.slug}`)}
                  className="group relative overflow-hidden rounded-2xl aspect-[4/3] bg-white shadow-sm hover:shadow-lg transition-all"
                >
                  <div className="absolute inset-0 bg-gradient-to-t from-forest/80 to-forest/20 group-hover:from-forest/90 transition-colors" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Leaf className="w-12 h-12 text-white/30" />
                  </div>
                  <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                    <h3 className="font-heading text-lg font-semibold">{category.name}</h3>
                    <p className="text-sm text-white/80 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="heading-lg text-forest mb-2">Featured Products</h2>
                <p className="body-md text-warmbrown">Handpicked favorites from our collection</p>
              </div>
              <Button 
                variant="outline"
                onClick={() => navigate('/shop')}
                className="hidden sm:flex btn-outline"
              >
                View All <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="bg-ivory-100 rounded-xl h-80 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                {featuredProducts.map((product) => (
                  <div 
                    key={product.$id}
                    className="group bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden hover:shadow-lg transition-all"
                  >
                    {/* Product Image */}
                    <div 
                      className="relative aspect-square bg-ivory-100 cursor-pointer"
                      onClick={() => navigate(`/product/${product.$id}`)}
                    >
                      {product.images && product.images.length > 0 ? (
                        <img 
                          src={product.images[0]} 
                          alt={product.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Leaf className="w-16 h-16 text-forest/20" />
                        </div>
                      )}
                      
                      {/* Stock Badge */}
                      {product.stock < 10 && product.stock > 0 && (
                        <span className="absolute top-3 left-3 badge-terracotta">
                          Only {product.stock} left
                        </span>
                      )}
                      {product.stock === 0 && (
                        <span className="absolute top-3 left-3 bg-gray-500 text-white px-2 py-1 rounded-full text-xs">
                          Out of Stock
                        </span>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="p-4">
                      <p className="text-xs text-terracotta font-medium mb-1">{product.categoryName}</p>
                      <h3 
                        className="font-heading text-lg font-semibold text-forest mb-1 cursor-pointer hover:text-terracotta transition-colors"
                        onClick={() => navigate(`/product/${product.$id}`)}
                      >
                        {product.name}
                      </h3>
                      {product.scientificName && (
                        <p className="text-xs text-warmbrown italic mb-2 truncate">
                          {product.scientificName}
                        </p>
                      )}
                      
                      <div className="flex items-center justify-between">
                        <p className="text-lg font-bold text-forest">
                          ₹{product.price.toLocaleString('en-IN')}
                        </p>
                        <Button
                          size="sm"
                          onClick={() => handleAddToCart(product)}
                          disabled={product.stock === 0}
                          className="bg-forest hover:bg-forest-800 text-white"
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 text-center sm:hidden">
              <Button 
                variant="outline"
                onClick={() => navigate('/shop')}
                className="btn-outline"
              >
                View All Products <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 lg:py-24">
        <div className="section-padding">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="heading-lg text-forest mb-4">What Our Customers Say</h2>
              <p className="body-lg text-warmbrown">Real stories from our plant-loving community</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
              {testimonials.map((testimonial, index) => (
                <div 
                  key={index}
                  className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200"
                >
                  <div className="flex gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-terracotta fill-terracotta" />
                    ))}
                  </div>
                  <p className="text-forest body-md mb-6">"{testimonial.text}"</p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-forest/10 rounded-full flex items-center justify-center">
                      <span className="font-medium text-forest">{testimonial.name[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-forest">{testimonial.name}</p>
                      <p className="text-sm text-warmbrown">{testimonial.location}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-forest">
        <div className="section-padding">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="heading-lg text-white mb-4">
              Ready to Start Your Green Journey?
            </h2>
            <p className="body-lg text-white/80 mb-8 max-w-2xl mx-auto">
              Join thousands of plant lovers who have transformed their spaces with GreenRoots. 
              Get 10% off on your first order!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => navigate('/shop')}
                className="bg-white text-forest hover:bg-ivory-100 text-lg px-8 py-4"
              >
                Shop Now <ArrowRight className="w-5 h-5 ml-2" />
              </Button>
              <Button 
                variant="outline"
                onClick={() => navigate('/about')}
                className="border-white text-white hover:bg-white/10 text-lg px-8 py-4"
              >
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
