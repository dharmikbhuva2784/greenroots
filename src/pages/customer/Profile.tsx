import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { useOrderStore } from '@/store/orderStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Package, 
  MapPin, 
  LogOut, 
  Leaf, 
  Eye,
  Printer,
  CheckCircle,
  Clock,
  Truck,
  Home,
  Loader2
} from 'lucide-react';
import { toast } from 'sonner';

const orderStatusIcons: Record<string, React.ElementType> = {
  order_placed: Clock,
  confirmed: CheckCircle,
  packed: Package,
  shipped: Truck,
  out_for_delivery: Truck,
  delivered: Home,
  cancelled: Package,
};

const orderStatusColors: Record<string, string> = {
  order_placed: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  packed: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  out_for_delivery: 'bg-orange-100 text-orange-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

export default function Profile() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { user, logout, updateUserDocument } = useAuthStore();
  const { orders, fetchUserOrders, isLoading } = useOrderStore();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'profile');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    state: user?.address?.state || '',
    pincode: user?.address?.pincode || '',
  });

  useEffect(() => {
    if (user?.$id) {
      fetchUserOrders(user.$id);
    }
  }, [user, fetchUserOrders]);

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  const handleSaveProfile = async () => {
    if (!user?.$id) return;
    
    setIsSaving(true);
    try {
      await updateUserDocument(user.$id, {
        name: profileData.name,
        phone: profileData.phone,
        address: {
          street: profileData.street,
          city: profileData.city,
          state: profileData.state,
          pincode: profileData.pincode,
        },
      });
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const handlePrintInvoice = (order: any) => {
    // Create a new window for printing
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Invoice - ${order.orderNumber}</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 2px solid #2D5016; padding-bottom: 20px; margin-bottom: 30px; }
          .logo { font-size: 28px; font-weight: bold; color: #2D5016; }
          .tagline { color: #8B7355; }
          .invoice-title { font-size: 24px; color: #2D5016; margin: 20px 0; }
          .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 30px; }
          .info-box { background: #f5f5f5; padding: 15px; border-radius: 8px; }
          .info-label { font-weight: bold; color: #2D5016; margin-bottom: 5px; }
          table { width: 100%; border-collapse: collapse; margin: 20px 0; }
          th { background: #2D5016; color: white; padding: 12px; text-align: left; }
          td { padding: 12px; border-bottom: 1px solid #ddd; }
          .total-row { font-weight: bold; background: #f5f5f5; }
          .footer { margin-top: 40px; text-align: center; color: #8B7355; font-size: 14px; }
          @media print { body { padding: 20px; } }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="logo">GreenRoots</div>
          <div class="tagline">Rooted in Nature</div>
          <div class="invoice-title">TAX INVOICE</div>
        </div>
        
        <div class="info-grid">
          <div class="info-box">
            <div class="info-label">Order Details</div>
            <p><strong>Order Number:</strong> ${order.orderNumber}</p>
            <p><strong>Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN')}</p>
            <p><strong>Status:</strong> ${order.status}</p>
          </div>
          <div class="info-box">
            <div class="info-label">Shipping Address</div>
            <p>${order.customerName}</p>
            <p>${order.shippingAddress.street}</p>
            <p>${order.shippingAddress.city}, ${order.shippingAddress.state}</p>
            <p>Pincode: ${order.shippingAddress.pincode}</p>
          </div>
        </div>
        
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${order.items.map((item: any) => `
              <tr>
                <td>${item.productName}</td>
                <td>${item.quantity}</td>
                <td>₹${item.price.toLocaleString('en-IN')}</td>
                <td>₹${(item.price * item.quantity).toLocaleString('en-IN')}</td>
              </tr>
            `).join('')}
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Subtotal:</td>
              <td>₹${order.subtotal.toLocaleString('en-IN')}</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right;">Shipping:</td>
              <td>Free</td>
            </tr>
            <tr class="total-row">
              <td colspan="3" style="text-align: right; font-size: 18px;">Total:</td>
              <td style="font-size: 18px;">₹${order.total.toLocaleString('en-IN')}</td>
            </tr>
          </tbody>
        </table>
        
        <div class="footer">
          <p>Thank you for shopping with GreenRoots!</p>
          <p>For any queries, contact us at hello@greenroots.in</p>
        </div>
        
        <script>window.print();</script>
      </body>
      </html>
    `;

    printWindow.document.write(invoiceHTML);
    printWindow.document.close();
  };

  if (!user) {
    navigate('/login');
    return null;
  }

  return (
    <div className="bg-linen min-h-screen pt-24 pb-16">
      <div className="section-padding">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="heading-lg text-forest mb-2">My Account</h1>
              <p className="text-warmbrown">Manage your profile and orders</p>
            </div>
            <Button 
              onClick={handleLogout}
              variant="outline"
              className="border-red-300 text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4 mr-2" /> Logout
            </Button>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="w-full justify-start bg-white border border-ivory-200 p-1 mb-6">
              <TabsTrigger 
                value="profile"
                className="flex items-center gap-2 data-[state=active]:bg-forest data-[state=active]:text-white"
              >
                <User className="w-4 h-4" /> Profile
              </TabsTrigger>
              <TabsTrigger 
                value="orders"
                className="flex items-center gap-2 data-[state=active]:bg-forest data-[state=active]:text-white"
              >
                <Package className="w-4 h-4" /> My Orders
              </TabsTrigger>
              <TabsTrigger 
                value="address"
                className="flex items-center gap-2 data-[state=active]:bg-forest data-[state=active]:text-white"
              >
                <MapPin className="w-4 h-4" /> Addresses
              </TabsTrigger>
            </TabsList>

            {/* Profile Tab */}
            <TabsContent value="profile">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="heading-sm text-forest">Personal Information</h2>
                  {!isEditing && (
                    <Button 
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="border-forest text-forest hover:bg-forest hover:text-white"
                    >
                      Edit Profile
                    </Button>
                  )}
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-forest font-medium">Full Name</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        className="input-organic mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-warmbrown p-3 bg-ivory-50 rounded-lg">{user.name}</p>
                    )}
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Email Address</Label>
                    <p className="mt-1 text-warmbrown p-3 bg-ivory-50 rounded-lg">{user.email}</p>
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Phone Number</Label>
                    {isEditing ? (
                      <Input
                        value={profileData.phone}
                        onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                        className="input-organic mt-1"
                      />
                    ) : (
                      <p className="mt-1 text-warmbrown p-3 bg-ivory-50 rounded-lg">
                        {user.phone || 'Not provided'}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label className="text-forest font-medium">Member Since</Label>
                    <p className="mt-1 text-warmbrown p-3 bg-ivory-50 rounded-lg">
                      {new Date(user.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </p>
                  </div>
                </div>

                {isEditing && (
                  <div className="flex gap-4 mt-6">
                    <Button 
                      onClick={handleSaveProfile}
                      disabled={isSaving}
                      className="btn-primary"
                    >
                      {isSaving ? (
                        <><Loader2 className="w-4 h-4 animate-spin mr-2" /> Saving...</>
                      ) : (
                        'Save Changes'
                      )}
                    </Button>
                    <Button 
                      onClick={() => setIsEditing(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* Orders Tab */}
            <TabsContent value="orders">
              <div className="space-y-4">
                {isLoading ? (
                  <div className="bg-white rounded-2xl p-12 text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-forest mx-auto" />
                  </div>
                ) : orders.length === 0 ? (
                  <div className="bg-white rounded-2xl p-12 text-center shadow-sm border border-ivory-200">
                    <div className="w-20 h-20 bg-forest/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Package className="w-10 h-10 text-forest/40" />
                    </div>
                    <h3 className="heading-sm text-forest mb-2">No Orders Yet</h3>
                    <p className="text-warmbrown mb-6">Start shopping to see your orders here</p>
                    <Button onClick={() => navigate('/shop')} className="btn-primary">
                      Start Shopping
                    </Button>
                  </div>
                ) : (
                  orders.map((order) => {
                    const StatusIcon = orderStatusIcons[order.status] || Package;
                    return (
                      <div 
                        key={order.$id}
                        className="bg-white rounded-2xl p-6 shadow-sm border border-ivory-200"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
                          <div>
                            <p className="text-sm text-warmbrown">Order Number</p>
                            <p className="font-heading text-lg font-semibold text-forest">
                              {order.orderNumber}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-sm text-warmbrown">Order Date</p>
                            <p className="font-medium text-forest">
                              {new Date(order.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 mb-4">
                          <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${orderStatusColors[order.status]}`}>
                            <StatusIcon className="w-4 h-4" />
                            {order.status.replace(/_/g, ' ').toUpperCase()}
                          </span>
                        </div>

                        {/* Order Items */}
                        <div className="space-y-2 mb-4">
                          {order.items.slice(0, 2).map((item, idx) => (
                            <div key={idx} className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-ivory-100 rounded-lg flex items-center justify-center">
                                <Leaf className="w-5 h-5 text-forest/30" />
                              </div>
                              <div className="flex-1">
                                <p className="font-medium text-forest text-sm">{item.productName}</p>
                                <p className="text-xs text-warmbrown">Qty: {item.quantity}</p>
                              </div>
                              <p className="text-sm font-medium text-forest">
                                ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                              </p>
                            </div>
                          ))}
                          {order.items.length > 2 && (
                            <p className="text-sm text-warmbrown">
                              +{order.items.length - 2} more items
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-ivory-200">
                          <div>
                            <p className="text-sm text-warmbrown">Total Amount</p>
                            <p className="font-heading text-xl font-bold text-forest">
                              ₹{order.total.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => navigate(`/track-order?order=${order.orderNumber}`)}
                              className="border-forest text-forest hover:bg-forest hover:text-white"
                            >
                              <Eye className="w-4 h-4 mr-2" /> Track
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handlePrintInvoice(order)}
                              className="border-warmbrown text-warmbrown hover:bg-warmbrown hover:text-white"
                            >
                              <Printer className="w-4 h-4 mr-2" /> Invoice
                            </Button>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </TabsContent>

            {/* Address Tab */}
            <TabsContent value="address">
              <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-ivory-200">
                <h2 className="heading-sm text-forest mb-6">Default Address</h2>
                
                {user.address ? (
                  <div className="bg-ivory-50 rounded-xl p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 bg-forest/10 rounded-full flex items-center justify-center flex-shrink-0">
                        <MapPin className="w-6 h-6 text-forest" />
                      </div>
                      <div>
                        <p className="font-medium text-forest text-lg">{user.name}</p>
                        <p className="text-warmbrown mt-1">{user.address.street}</p>
                        <p className="text-warmbrown">
                          {user.address.city}, {user.address.state}
                        </p>
                        <p className="text-warmbrown">Pincode: {user.address.pincode}</p>
                        <p className="text-warmbrown mt-2">Phone: {user.phone || 'Not provided'}</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-warmbrown mb-4">No address saved yet</p>
                    <Button 
                      onClick={() => { setActiveTab('profile'); setIsEditing(true); }}
                      className="btn-primary"
                    >
                      Add Address
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
