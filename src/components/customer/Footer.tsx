import { Link } from 'react-router-dom';
import { Leaf, Mail, Phone, Facebook, Instagram, Twitter, Youtube, HelpCircle } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    shop: [
      { label: 'Outdoor Plants', path: '/shop?category=outdoor-plants' },
      { label: 'Indoor Plants', path: '/shop?category=indoor-plants' },
      { label: 'Fruit Plants', path: '/shop?category=outdoor-fruit-plants' },
      { label: 'Pots & Planters', path: '/shop?category=pots' },
      { label: 'Compost & Fertilizers', path: '/shop?category=organic-compost' },
    ],
    support: [
      { label: 'My Orders', path: '/profile?tab=orders' },
      { label: 'Shipping Info', path: '/about#shipping' },
      { label: 'Returns & Refunds', path: '/about#returns' },
      { label: 'Contact Us', path: '/about#contact' },
    ],
  };

  return (
    <footer className="bg-forest text-white">
      {/* Main Footer */}
      <div className="section-padding py-12 lg:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
            {/* Brand Column */}
            <div className="lg:col-span-2">
              <Link to="/" className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
                  <Leaf className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-heading text-2xl font-bold">GreenRoots</h3>
                  <p className="text-white/70 text-sm -mt-1">Rooted in Nature</p>
                </div>
              </Link>
              
              <p className="text-white/80 body-md mb-6 max-w-sm">
                Bringing nature closer to your home. We offer a wide range of organic plants, 
                gardening essentials, and expert care tips to help your green companions thrive.
              </p>

              {/* Contact Info */}
              <div className="space-y-3">
                <a 
                  href="mailto:hello@greenroots.in" 
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Mail className="w-5 h-5" />
                  hello@greenroots.in
                </a>
                <a 
                  href="tel:+919876543210" 
                  className="flex items-center gap-3 text-white/80 hover:text-white transition-colors"
                >
                  <Phone className="w-5 h-5" />
                  +91 98765 43210
                </a>
              </div>
            </div>

            {/* Shop Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Shop</h4>
              <ul className="space-y-3">
                {footerLinks.shop.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-white/70 hover:text-white transition-colors body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Support Links */}
            <div>
              <h4 className="font-heading text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-3">
                {footerLinks.support.map((link) => (
                  <li key={link.path}>
                    <Link 
                      to={link.path}
                      className="text-white/70 hover:text-white transition-colors body-sm"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link 
                    to="/faqs"
                    className="text-white/70 hover:text-white transition-colors body-sm flex items-center gap-2"
                  >
                    <HelpCircle className="w-4 h-4" /> FAQs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10">
        <div className="section-padding py-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-white/60 text-sm text-center sm:text-left">
              {currentYear} GreenRoots. All rights reserved.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://youtube.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-terracotta transition-colors"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>

            <div className="flex items-center gap-4 text-sm text-white/60">
              <Link to="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link to="/terms" className="hover:text-white transition-colors">Terms of Service</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
