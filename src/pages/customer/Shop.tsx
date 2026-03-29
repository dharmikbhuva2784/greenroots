import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useProductStore } from '@/store/productStore';
import { useCartStore } from '@/store/cartStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Leaf, 
  ShoppingCart, 
  Search, 
  Filter,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export default function Shop() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, categories, fetchProducts, fetchCategories, isLoading } = useProductStore();
  const { addItem, openCart } = useCartStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    searchParams.get('category') || null
  );
  const [priceRange] = useState<[number, number]>([0, 5000]);
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  const handleAddToCart = (product: any) => {
    addItem(product, 1);
    toast.success(`${product.name} added to cart!`);
    openCart();
  };

  const handleCategoryChange = (categorySlug: string | null) => {
    setSelectedCategory(categorySlug);
    if (categorySlug) {
      setSearchParams({ category: categorySlug });
    } else {
      setSearchParams({});
    }
  };

  // Filter and sort products
  const filteredProducts = products
    .filter((product) => {
      // Category filter
      if (selectedCategory) {
        const category = categories.find(c => c.slug === selectedCategory);
        if (category && product.categoryId !== category.$id) return false;
      }
      
      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const matchesName = product.name.toLowerCase().includes(query);
        const matchesScientific = product.scientificName?.toLowerCase().includes(query);
        const matchesCategory = product.categoryName.toLowerCase().includes(query);
        if (!matchesName && !matchesScientific && !matchesCategory) return false;
      }
      
      // Price filter
      if (product.price < priceRange[0] || product.price > priceRange[1]) return false;
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="heading-lg text-forest mb-2">Our Shop</h1>
            <p className="body-md text-warmbrown">
              Discover our collection of {products.length}+ organic plants and gardening essentials
            </p>
          </div>

          {/* Search and Filters Bar */}
          <div className="bg-white rounded-xl p-4 mb-6 shadow-sm border border-ivory-200">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                <Input
                  type="text"
                  placeholder="Search plants, products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 input-organic"
                />
              </div>

              {/* Category Pills (Desktop) */}
              <div className="hidden lg:flex items-center gap-2 overflow-x-auto">
                <Button
                  variant={selectedCategory === null ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => handleCategoryChange(null)}
                  className={selectedCategory === null ? 'bg-forest text-white' : 'border-warmbrown/30'}
                >
                  All
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.$id}
                    variant={selectedCategory === category.slug ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(category.slug)}
                    className={selectedCategory === category.slug ? 'bg-forest text-white' : 'border-warmbrown/30'}
                  >
                    {category.name}
                  </Button>
                ))}
              </div>

              {/* Sort and Filter Buttons */}
              <div className="flex items-center gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 rounded-lg border border-warmbrown/30 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-forest/30"
                >
                  <option value="newest">Newest First</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="name">Name: A-Z</option>
                </select>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setShowFilters(!showFilters)}
                  className={`lg:hidden ${showFilters ? 'bg-forest text-white' : ''}`}
                >
                  <Filter className="w-5 h-5" />
                </Button>
              </div>
            </div>

            {/* Mobile Filters */}
            {showFilters && (
              <div className="lg:hidden mt-4 pt-4 border-t border-ivory-200">
                <p className="font-medium text-forest mb-3">Categories</p>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedCategory === null ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => handleCategoryChange(null)}
                    className={selectedCategory === null ? 'bg-forest text-white' : 'border-warmbrown/30'}
                  >
                    All Products
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.$id}
                      variant={selectedCategory === category.slug ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => handleCategoryChange(category.slug)}
                      className={selectedCategory === category.slug ? 'bg-forest text-white' : 'border-warmbrown/30'}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Results Count */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-warmbrown">
              Showing <span className="font-medium text-forest">{filteredProducts.length}</span> products
            </p>
            {selectedCategory && (
              <button
                onClick={() => handleCategoryChange(null)}
                className="flex items-center gap-1 text-sm text-terracotta hover:underline"
              >
                <X className="w-4 h-4" /> Clear filter
              </button>
            )}
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-ivory-100 rounded-xl h-80 animate-pulse" />
              ))}
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16">
              <div className="w-24 h-24 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-12 h-12 text-forest/30" />
              </div>
              <h3 className="heading-sm text-forest mb-2">No products found</h3>
              <p className="text-warmbrown body-md">
                Try adjusting your search or filter criteria
              </p>
              <Button 
                onClick={() => {
                  setSearchQuery('');
                  handleCategoryChange(null);
                }}
                className="btn-primary mt-6"
              >
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
              {filteredProducts.map((product) => (
                <div 
                  key={product.$id}
                  className="group bg-white rounded-2xl shadow-sm border border-ivory-200 overflow-hidden hover:shadow-lg transition-all"
                >
                  {/* Product Image */}
                  <div 
                    className="relative aspect-square bg-ivory-100 cursor-pointer overflow-hidden"
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

                    {/* Quick Add Overlay */}
                    <div className="absolute inset-0 bg-forest/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(product);
                        }}
                        disabled={product.stock === 0}
                        className="bg-white text-forest hover:bg-ivory-100"
                      >
                        <ShoppingCart className="w-4 h-4 mr-2" />
                        Add to Cart
                      </Button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <p className="text-xs text-terracotta font-medium mb-1">{product.categoryName}</p>
                    <h3 
                      className="font-heading text-lg font-semibold text-forest mb-1 cursor-pointer hover:text-terracotta transition-colors line-clamp-1"
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
        </div>
      </div>
    </div>
  );
}
