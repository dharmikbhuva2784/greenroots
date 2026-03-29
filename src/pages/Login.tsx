import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '@/store/authStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Leaf, Mail, Lock, Phone, User, ArrowRight, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const { login, register, googleLogin, isAuthenticated, user, isLoading, error, clearError } = useAuthStore();
  
  const [activeTab, setActiveTab] = useState('login');
  
  // Login form state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [autoCreateAccount, setAutoCreateAccount] = useState(false);
  
  // Register form state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPhone, setRegisterPhone] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  // Phone login state
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [showOtp, setShowOtp] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  useEffect(() => {
    if (error) {
      toast.error(error);
      clearError();
    }
  }, [error, clearError]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail || !loginPassword) {
      toast.error('Please fill in all fields');
      return;
    }
    try {
      const result = await login(loginEmail, loginPassword, autoCreateAccount);
      if (result.created) {
        toast.success('Account created and logged in successfully!');
      } else {
        toast.success('Login successful!');
      }
    } catch (error) {
      // Error handled by store
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      toast.error('Please fill in all required fields');
      return;
    }
    if (registerPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (registerPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      await register(registerEmail, registerPassword, registerName, registerPhone);
      toast.success('Account created successfully!');
    } catch (error) {
      // Error handled by store
    }
  };

  const handleGoogleLogin = () => {
    googleLogin();
  };

  const handleGoogleRegister = () => {
    // Google OAuth handles both login and registration
    googleLogin();
  };

  const handlePhoneLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || phoneNumber.length < 10) {
      toast.error('Please enter a valid phone number');
      return;
    }
    // Mock OTP sending - in production, integrate with Appwrite or Twilio
    setShowOtp(true);
    toast.success('OTP sent to your phone number');
  };

  const handleOtpVerify = (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp || otp.length < 4) {
      toast.error('Please enter valid OTP');
      return;
    }
    // Mock OTP verification
    toast.success('Phone login successful!');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-linen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-12 h-12 bg-forest rounded-full flex items-center justify-center">
              <Leaf className="w-6 h-6 text-white" />
            </div>
          </div>
          <h2 className="heading-lg text-forest">GreenRoots</h2>
          <p className="mt-2 text-warmbrown body-md">Rooted in Nature</p>
        </div>

        {/* Auth Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-ivory-200 p-6 sm:p-8">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-ivory-100">
              <TabsTrigger value="login" className="data-[state=active]:bg-forest data-[state=active]:text-white">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="data-[state=active]:bg-forest data-[state=active]:text-white">
                Register
              </TabsTrigger>
              <TabsTrigger value="phone" className="data-[state=active]:bg-forest data-[state=active]:text-white">
                Phone
              </TabsTrigger>
            </TabsList>

            {/* Email Login */}
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="login-email" className="text-forest font-medium">Email Address</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="you@example.com"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="login-password" className="text-forest font-medium">Password</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input type="checkbox" className="rounded border-warmbrown/30 text-forest focus:ring-forest" />
                    <span className="ml-2 text-sm text-warmbrown">Remember me</span>
                  </label>
                  <Link to="/forgot-password" className="text-sm text-terracotta hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Auto-create account option */}
                <div className="flex items-center p-3 bg-ivory-50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="auto-create"
                    checked={autoCreateAccount}
                    onChange={(e) => setAutoCreateAccount(e.target.checked)}
                    className="rounded border-warmbrown/30 text-forest focus:ring-forest"
                  />
                  <label htmlFor="auto-create" className="ml-2 text-sm text-warmbrown">
                    Create account if I do not have one
                  </label>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Sign In <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-warmbrown">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleLogin}
                  className="w-full mt-4 border-warmbrown/30 hover:bg-ivory-100"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </TabsContent>

            {/* Register */}
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="register-name" className="text-forest font-medium">Full Name *</Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="register-name"
                      type="text"
                      placeholder="John Doe"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-email" className="text-forest font-medium">Email Address *</Label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="register-email"
                      type="email"
                      placeholder="you@example.com"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-phone" className="text-forest font-medium">Phone Number</Label>
                  <div className="relative mt-1">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="register-phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={registerPhone}
                      onChange={(e) => setRegisterPhone(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="register-password" className="text-forest font-medium">Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="register-password"
                      type="password"
                      placeholder="••••••••"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                  <p className="text-xs text-warmbrown mt-1">Minimum 8 characters</p>
                </div>

                <div>
                  <Label htmlFor="confirm-password" className="text-forest font-medium">Confirm Password *</Label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                    <Input
                      id="confirm-password"
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10 input-organic"
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full btn-primary flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create Account <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <Separator className="w-full" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-warmbrown">Or register with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  onClick={handleGoogleRegister}
                  className="w-full mt-4 border-warmbrown/30 hover:bg-ivory-100"
                >
                  <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Register with Google
                </Button>
              </div>
            </TabsContent>

            {/* Phone Login */}
            <TabsContent value="phone">
              {!showOtp ? (
                <form onSubmit={handlePhoneLogin} className="space-y-4 mt-4">
                  <div>
                    <Label htmlFor="phone-number" className="text-forest font-medium">Phone Number</Label>
                    <div className="relative mt-1">
                      <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-warmbrown/60" />
                      <Input
                        id="phone-number"
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        className="pl-10 input-organic"
                      />
                    </div>
                    <p className="text-xs text-warmbrown mt-1">We'll send an OTP to verify your number</p>
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Send OTP <ArrowRight className="w-4 h-4" />
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleOtpVerify} className="space-y-4 mt-4">
                  <div className="text-center mb-4">
                    <p className="text-warmbrown">Enter the OTP sent to {phoneNumber}</p>
                  </div>
                  <div>
                    <Label htmlFor="otp" className="text-forest font-medium">OTP Code</Label>
                    <Input
                      id="otp"
                      type="text"
                      placeholder="1234"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      className="input-organic text-center text-2xl tracking-widest"
                      maxLength={6}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full btn-primary flex items-center justify-center gap-2"
                  >
                    Verify & Login <ArrowRight className="w-4 h-4" />
                  </Button>

                  <button
                    type="button"
                    onClick={() => setShowOtp(false)}
                    className="w-full text-center text-sm text-terracotta hover:underline"
                  >
                    Change phone number
                  </button>
                </form>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Back to Home */}
        <div className="text-center">
          <Link to="/" className="text-warmbrown hover:text-forest transition-colors body-sm">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
