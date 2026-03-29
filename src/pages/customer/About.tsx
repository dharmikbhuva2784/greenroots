import { useEffect } from 'react';
import { useProductStore } from '@/store/productStore';
import { useOrderStore } from '@/store/orderStore';
import { useReviewStore } from '@/store/reviewStore';
import { Leaf, Heart, Truck, Shield, Sprout, Recycle } from 'lucide-react';

export default function About() {
  const { products, fetchProducts } = useProductStore();
  const { fetchOrders, getOrderStats } = useOrderStore();
  const { reviews } = useReviewStore();

  useEffect(() => {
    fetchProducts();
    fetchOrders();
  }, [fetchProducts, fetchOrders]);

  const orderStats = getOrderStats();
  
  // Calculate average rating from reviews
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  // Dynamic stats based on real data
  const stats = [
    { value: `${products.length}+`, label: 'Plant Varieties' },
    { value: `${orderStats.totalOrders}+`, label: 'Orders Delivered' },
    { value: `${orderStats.completedOrders}+`, label: 'Happy Customers' },
    { value: averageRating, label: 'Average Rating' },
  ];

  const values = [
    {
      icon: Sprout,
      title: 'Sustainability First',
      description: 'We believe in growing plants sustainably, using organic methods that protect our environment for future generations.',
    },
    {
      icon: Heart,
      title: 'Passion for Plants',
      description: 'Every plant we sell is nurtured with care and love. We treat each one as if it were going to our own home.',
    },
    {
      icon: Shield,
      title: 'Quality Guaranteed',
      description: 'We stand behind every plant we sell. If your plant arrives unhealthy, we will replace it free of charge.',
    },
    {
      icon: Shield,
      title: 'Community Driven',
      description: 'We are building a community of plant lovers who share tips, stories, and their green journey together.',
    },
  ];

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="section-padding mb-16">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-forest/10 rounded-full mb-6">
            <Leaf className="w-4 h-4 text-forest" />
            <span className="text-sm font-medium text-forest">About GreenRoots</span>
          </div>
          <h1 className="heading-xl text-forest mb-6">
            Rooted in Nature,<br />
            <span className="text-terracotta">Growing with Love</span>
          </h1>
          <p className="body-lg text-warmbrown max-w-2xl mx-auto">
            GreenRoots is more than just a plant store. We are a community of nature enthusiasts 
            dedicated to bringing the joy of gardening to every home in India.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="section-padding mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=800&h=600&fit=crop"
                  alt="Our nursery"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 w-48 h-48 bg-terracotta/10 rounded-full blur-2xl" />
            </div>
            <div className="space-y-6">
              <h2 className="heading-lg text-forest">Our Story</h2>
              <p className="body-md text-warmbrown">
                GreenRoots began in 2020 with a simple mission: to make gardening accessible to everyone. 
                What started as a small backyard nursery has grown into a trusted name for organic plants 
                and gardening supplies across India.
              </p>
              <p className="body-md text-warmbrown">
                We work directly with local farmers and nurseries to bring you the healthiest plants, 
                grown using sustainable and organic practices. Every plant is carefully selected, 
                nurtured, and packaged with love before reaching your doorstep.
              </p>
              <p className="body-md text-warmbrown">
                Today, we have helped thousands of customers create their own green spaces, from 
                small apartment balconies to sprawling rooftop gardens. Our journey continues, 
                one plant at a time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section - Dynamic */}
      <section className="section-padding mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="bg-forest rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <p className="font-heading text-4xl lg:text-5xl font-bold text-white mb-2">
                    {stat.value}
                  </p>
                  <p className="text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="section-padding mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="heading-lg text-forest mb-4">Our Values</h2>
            <p className="body-lg text-warmbrown max-w-2xl mx-auto">
              The principles that guide everything we do at GreenRoots
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 lg:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200 hover:shadow-md transition-shadow"
              >
                <div className="w-14 h-14 bg-forest/10 rounded-xl flex items-center justify-center mb-4">
                  <value.icon className="w-7 h-7 text-forest" />
                </div>
                <h3 className="font-heading text-xl font-semibold text-forest mb-3">
                  {value.title}
                </h3>
                <p className="text-warmbrown body-md">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sustainability Section */}
      <section className="section-padding mb-16">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 space-y-6">
              <h2 className="heading-lg text-forest">Our Commitment to Sustainability</h2>
              <p className="body-md text-warmbrown">
                At GreenRoots, we believe that taking care of plants means taking care of the planet. 
                That is why sustainability is at the heart of everything we do.
              </p>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Recycle className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-forest">Eco-Friendly Packaging</p>
                    <p className="text-warmbrown body-sm">All our packaging materials are biodegradable and recyclable</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Leaf className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-forest">Organic Growing</p>
                    <p className="text-warmbrown body-sm">We use only organic fertilizers and pest control methods</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Truck className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium text-forest">Carbon-Neutral Delivery</p>
                    <p className="text-warmbrown body-sm">We offset the carbon footprint of every delivery</p>
                  </div>
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 relative">
              <div className="aspect-[4/3] rounded-2xl overflow-hidden">
                <img 
                  src="https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=800&h=600&fit=crop"
                  alt="Sustainability"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding">
        <div className="max-w-4xl mx-auto">
          <div className="bg-terracotta rounded-2xl p-8 lg:p-12 text-center text-white">
            <h2 className="heading-lg mb-4">Get in Touch</h2>
            <p className="body-lg text-white/80 mb-8 max-w-xl mx-auto">
              Have questions about plants, orders, or just want to say hello? 
              We would love to hear from you!
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a 
                href="mailto:hello@greenroots.in"
                className="bg-white text-terracotta px-6 py-3 rounded-lg font-medium hover:bg-ivory-100 transition-colors"
              >
                Email Us
              </a>
              <a 
                href="tel:+919876543210"
                className="border-2 border-white text-white px-6 py-3 rounded-lg font-medium hover:bg-white/10 transition-colors"
              >
                Call Us
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
