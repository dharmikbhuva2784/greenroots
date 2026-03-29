# GreenRoots - Organic Agri-Products E-Commerce Platform

A full-stack e-commerce application for organic agri-products built with React, TypeScript, Tailwind CSS, and Appwrite.

![GreenRoots](https://img.shields.io/badge/GreenRoots-Organic%20Agri--Products-brightgreen)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.4-blue)
![Appwrite](https://img.shields.io/badge/Appwrite-Cloud-pink)

## Features

### Customer Features
- **User Authentication**: Email/password login, Google OAuth, Phone OTP
- **Product Catalog**: Browse products by categories with filtering and search
- **Shopping Cart**: Add/remove items, quantity controls, persistent cart
- **Checkout Flow**: Multiple payment options (UPI, Card, COD)
- **Order Tracking**: View all orders with real-time status timeline
- **User Profile**: Manage profile, view order history, download invoices
- **Product Reviews**: Leave feedback on purchased products
- **Responsive Design**: Mobile-first approach for all devices

### Admin Features
- **Dashboard**: Overview with key metrics and recent orders
- **Product Management**: CRUD operations for products with images
- **Category Management**: Add, edit, delete product categories
- **Order Management**: Update order statuses, view order details
- **Analytics**: Sales reports, top products, revenue tracking
- **Export Data**: Download orders as CSV

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, shadcn/ui components
- **State Management**: Zustand
- **Backend/Database**: Appwrite (Authentication, Database, Storage)
- **Payment Gateway**: Razorpay (configurable)
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Appwrite Cloud account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd greenroots
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   Edit `.env` and add your Appwrite credentials.

4. **Start development server**
   ```bash
   npm run dev
   ```

## Appwrite Setup Guide

### 1. Create Appwrite Project

1. Go to [Appwrite Cloud](https://cloud.appwrite.io)
2. Create a new project named "GreenRoots"
3. Note down the Project ID

### 2. Enable Authentication Methods

1. Go to **Auth** > **Settings**
2. Enable the following methods:
   - Email/Password
   - Google OAuth (see OAuth setup below)

### 3. Create Database

1. Go to **Databases**
2. Create a new database named "greenroots_db"
3. Note down the Database ID

### 4. Create Collections

Create the following collections with these attributes:

#### Collection: `users`
| Attribute | Type | Required |
|-----------|------|----------|
| email | string | Yes |
| name | string | Yes |
| phone | string | No |
| role | enum (customer, admin) | Yes |
| address | object | No |
| createdAt | datetime | Yes |

#### Collection: `categories`
| Attribute | Type | Required |
|-----------|------|----------|
| name | string | Yes |
| slug | string | Yes |
| description | string | No |
| imageUrl | string | No |
| order | integer | Yes |
| isActive | boolean | Yes |
| createdAt | datetime | Yes |

#### Collection: `products`
| Attribute | Type | Required |
|-----------|------|----------|
| name | string | Yes |
| scientificName | string | No |
| description | string | Yes |
| price | double | Yes |
| stock | integer | Yes |
| categoryId | string | Yes |
| categoryName | string | Yes |
| images | string[] | No |
| careTips | string | No |
| isActive | boolean | Yes |
| createdAt | datetime | Yes |
| updatedAt | datetime | Yes |

#### Collection: `orders`
| Attribute | Type | Required |
|-----------|------|----------|
| orderNumber | string | Yes |
| userId | string | Yes |
| customerName | string | Yes |
| customerEmail | string | Yes |
| customerPhone | string | Yes |
| shippingAddress | object | Yes |
| items | object[] | Yes |
| subtotal | double | Yes |
| taxAmount | double | Yes |
| taxPercentage | double | Yes |
| total | double | Yes |
| paymentMethod | enum (upi, card, cod) | Yes |
| paymentStatus | enum (pending, completed, failed) | Yes |
| status | enum (order_placed, confirmed, packed, shipped, out_for_delivery, delivered, cancelled) | Yes |
| statusHistory | object[] | Yes |
| estimatedDelivery | datetime | No |
| notes | string | No |
| createdAt | datetime | Yes |
| updatedAt | datetime | Yes |

#### Collection: `reviews`
| Attribute | Type | Required |
|-----------|------|----------|
| productId | string | Yes |
| userId | string | Yes |
| userName | string | Yes |
| orderId | string | Yes |
| rating | integer | Yes |
| comment | string | Yes |
| createdAt | datetime | Yes |

#### Collection: `settings`
| Attribute | Type | Required |
|-----------|------|----------|
| taxEnabled | boolean | Yes |
| taxPercentage | double | Yes |
| currency | string | Yes |
| currencySymbol | string | Yes |

### 5. Create Storage Buckets

1. Go to **Storage**
2. Create two buckets:
   - `product-images` - For product images
   - `category-images` - For category images
3. Set appropriate permissions for file upload/view

### 6. Set Permissions

For each collection, set the following permissions:
- **Users**: Read (Users), Create (Users), Update (Users), Delete (Admin)
- **Categories**: Read (Any), Create (Admin), Update (Admin), Delete (Admin)
- **Products**: Read (Any), Create (Admin), Update (Admin), Delete (Admin)
- **Orders**: Read (Users), Create (Users), Update (Admin), Delete (Admin)
- **Reviews**: Read (Any), Create (Users), Update (Users), Delete (Admin)

## Admin Access Setup

### Method 1: Default Admin Login (Quick Setup)

Use the pre-configured admin credentials:
- **Email**: `admin@greenroots.in`
- **Password**: `admin123`

**Note**: Change these credentials in production by updating the authStore.ts file.

### Method 2: Grant Admin Access to Existing User (Recommended)

1. **Login to Appwrite Console**
   - Go to [cloud.appwrite.io](https://cloud.appwrite.io)
   - Select your GreenRoots project

2. **Find the User**
   - Go to **Auth** > **Users**
   - Find the user you want to make admin
   - Copy their User ID

3. **Update User Document**
   - Go to **Databases** > **greenroots_db** > **users** collection
   - Find the document with the user's ID
   - Click **Edit**
   - Change the `role` field from `customer` to `admin`
   - Click **Update**

4. **User Must Logout and Login Again**
   - The user needs to logout and login again for changes to take effect

### Method 3: Create Admin User Directly

1. **Create User in Appwrite**
   - Go to **Auth** > **Users**
   - Click **Create User**
   - Fill in email and password
   - Click **Create**

2. **Create User Document**
   - Go to **Databases** > **greenroots_db** > **users** collection
   - Click **Create Document**
   - Set Document ID to match the Auth User ID
   - Fill in:
     - email: admin email
     - name: Admin Name
     - role: `admin`
     - createdAt: current datetime
   - Click **Create**

## Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create a new project or select existing
3. Go to **APIs & Services** > **Credentials**
4. Click **Create Credentials** > **OAuth client ID**
5. Configure consent screen:
   - User Type: External
   - App name: GreenRoots
   - User support email: your-email
   - Developer contact: your-email
6. Add scopes: email, profile
7. Create OAuth client ID:
   - Application type: Web application
   - Name: GreenRoots Web
   - Authorized redirect URIs: `https://cloud.appwrite.io/v1/account/sessions/oauth2/callback/google/YOUR_PROJECT_ID`
8. Copy Client ID and Client Secret
9. In Appwrite Console:
   - Go to **Auth** > **Settings** > **Google OAuth**
   - Enable and paste Client ID and Secret

## Razorpay Payment Integration

1. Create a Razorpay account at [razorpay.com](https://razorpay.com)
2. Get your API keys from Dashboard > Settings > API Keys
3. Add the key ID to your `.env` file
4. For production, also set up webhook for payment verification

## Deployment Guide

### Build for Production

```bash
npm run build
```

The build output will be in the `dist/` directory.

### Deploy to Netlify

1. **Connect Repository**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your GitHub/GitLab repository

2. **Configure Build Settings**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Click "Deploy site"

3. **Add Environment Variables**
   - Go to Site settings > Environment variables
   - Add all variables from your `.env` file
   - Redeploy if needed

### Deploy to Vercel

1. **Import Project**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New Project"
   - Import your GitHub repository

2. **Configure Project**
   - Framework Preset: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`

3. **Add Environment Variables**
   - Add all variables from your `.env` file
   - Click "Deploy"

### Deploy to Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login
firebase login

# Initialize
firebase init hosting
# Select: Configure as single-page app: Yes
# Select: Set up automatic builds: No (for now)

# Build
npm run build

# Deploy
firebase deploy
```

### Deploy to GitHub Pages

```bash
# Install gh-pages
npm install -D gh-pages

# Add to package.json scripts:
# "predeploy": "npm run build",
# "deploy": "gh-pages -d dist"

# Deploy
npm run deploy
```

## Database Schema

### Entity Relationship

```
Users (1) ----< (*) Orders
              
Categories (1) ----< (*) Products

Orders (*) ----< (*) OrderItems

Products (1) ----< (*) Reviews
```

### Order Status Flow

```
order_placed → confirmed → packed → shipped → out_for_delivery → delivered
```

## Project Structure

```
src/
├── components/
│   ├── customer/       # Customer-facing components
│   │   ├── Navbar.tsx
│   │   ├── Footer.tsx
│   │   └── CartDrawer.tsx
│   └── admin/          # Admin components
│       └── AdminLayout.tsx
├── pages/
│   ├── customer/       # Customer pages
│   │   ├── Home.tsx
│   │   ├── Shop.tsx
│   │   ├── ProductDetail.tsx
│   │   ├── Cart.tsx
│   │   ├── Checkout.tsx
│   │   ├── OrderSuccess.tsx
│   │   ├── OrderTracking.tsx
│   │   ├── Profile.tsx
│   │   ├── About.tsx
│   │   └── FAQs.tsx
│   └── admin/          # Admin pages
│       ├── Dashboard.tsx
│       ├── Products.tsx
│       ├── Orders.tsx
│       ├── Categories.tsx
│       └── Analytics.tsx
├── store/              # Zustand stores
│   ├── authStore.ts
│   ├── cartStore.ts
│   ├── productStore.ts
│   ├── orderStore.ts
│   └── reviewStore.ts
├── lib/                # Utilities
│   └── appwrite.ts
├── types/              # TypeScript types
│   └── index.ts
├── data/               # Sample data
│   └── sampleData.ts
└── App.tsx
```

## Customization

### Colors

Edit `tailwind.config.js` and `src/index.css` to customize the color palette:

- `--forest`: Primary green (#2D5016)
- `--terracotta`: Accent color (#C4622D)
- `--ivory`: Background (#FAF6EF)
- `--warmbrown`: Secondary text (#8B7355)

### Fonts

- Headings: Cormorant Garamond (serif)
- Body: DM Sans (sans-serif)

Edit in `src/index.css` and `tailwind.config.js` to change fonts.

## Tax Configuration

To enable tax calculation:

1. Go to Admin > Settings (or edit directly in Appwrite)
2. Set `taxEnabled` to `true`
3. Set `taxPercentage` to desired value (e.g., 18 for 18% GST)

The tax will be automatically calculated in the checkout.

## Image Storage

### Option 1: Appwrite Storage (Recommended)
- Upload images to Appwrite Storage buckets
- Use the file ID to reference images in products

### Option 2: External CDN
- Use services like Cloudinary, AWS S3, or Imgur
- Store the direct image URL in the product's images array

### Option 3: Base64 (Not recommended for production)
- Convert images to base64
- Store directly in the database (limited to small images)

## Troubleshooting

### Common Issues

1. **Appwrite connection failed**
   - Check your endpoint URL and project ID
   - Ensure CORS is configured in Appwrite

2. **Images not loading**
   - Check storage bucket permissions
   - Verify image URLs are correct

3. **Payment not working**
   - Verify Razorpay keys are correct
   - Check if Razorpay is in test mode

4. **Google login not working**
   - Verify OAuth credentials
   - Check redirect URI configuration

5. **Admin access not working**
   - Verify user's role is set to "admin" in the users collection
   - User must logout and login again after role change

## Support

For support, email hello@greenroots.in or create an issue in the repository.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Acknowledgments

- [Appwrite](https://appwrite.io) for the backend infrastructure
- [shadcn/ui](https://ui.shadcn.com) for UI components
- [Tailwind CSS](https://tailwindcss.com) for styling
- [Lucide](https://lucide.dev) for icons
