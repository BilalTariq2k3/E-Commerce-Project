# Ecommerce Project

Full-stack ecommerce system built with Next.js, split into two apps:

- `User Panel`: customer-facing storefront (products, cart, checkout, orders, auth)
- `Admin-Panel`: admin dashboard (manage products, categories, users, orders)

Both apps use MongoDB and NextAuth credentials-based authentication.

## Tech Stack

- Next.js (App Router)
- React + Redux Toolkit
- MongoDB + Mongoose
- NextAuth
- Tailwind CSS + Bootstrap
- Stripe (checkout in User Panel)
- Nodemailer (email in User Panel)

## Project Structure

```text
Ecommerce-Project/
  Admin-Panel/
  User Panel/
```

## Prerequisites

- Node.js 18+ (recommended 20+)
- npm
- MongoDB running locally on:
  - `mongodb://127.0.0.1:27017/ecommercedb`

## Installation

Install dependencies for both apps:

```bash
cd "Admin-Panel"
npm install

cd "../User Panel"
npm install
```

## Environment Variables

Create `.env.local` files for each app.

### `User Panel/.env.local`

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

STRIPE_SECRET_KEY=your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key

EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_app_password
```

### `Admin-Panel/.env.local`

```env
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3001
```

## Running the Project

Run both apps in separate terminals.

### 1) Start User Panel (port 3000)

```bash
cd "User Panel"
npm run dev -- -p 3000
```

### 2) Start Admin Panel (port 3001)

```bash
cd "Admin-Panel"
npm run dev -- -p 3001
```

Then open:

- User app: `http://localhost:3000`
- Admin app: `http://localhost:3001`

## Available Scripts

In both `User Panel` and `Admin-Panel`:

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - start production server
- `npm run lint` - run ESLint

## Key Features

- User signup/login with credentials auth
- Product listing and product detail pages
- Cart and order flow
- Stripe-based checkout endpoint
- Email sending endpoint
- Admin CRUD operations for products, categories, users, and orders
- File upload helper with type and size validation

## Security Notes

- Do not commit real secrets in `.env.local`
- Rotate any exposed keys before deployment
- Use strong `NEXTAUTH_SECRET` values in production

## Deployment Notes

- Update `NEXTAUTH_URL` for each deployed app domain
- Configure production MongoDB connection
- Add production Stripe and email credentials

