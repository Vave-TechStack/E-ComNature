# EcomNature - Enterprise E-Commerce Platform

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (Next.js 15)                 │
│  React 19 · TypeScript · Tailwind CSS · Shadcn UI       │
│  Framer Motion · React Query · Redux Toolkit            │
└──────────────────────┬──────────────────────────────────┘
                       │ REST/WebSocket
┌──────────────────────▼──────────────────────────────────┐
│              API Gateway (NGINX)                         │
└──────────────────────┬──────────────────────────────────┘
                       │
┌──────────────────────▼──────────────────────────────────┐
│              Backend (Spring Boot 3.x)                   │
│                                                         │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌────────┐ │
│  │Controller│→ │ Service  │→ │Repository│→ │  DB    │ │
│  └──────────┘  └──────────┘  └──────────┘  └────────┘ │
│       │              │              │                   │
│  ┌────▼────┐   ┌────▼────┐   ┌────▼────┐              │
│  │  Auth   │   │  Cache  │   │  Queue  │              │
│  │  JWT    │   │  Redis  │   │RabbitMQ │              │
│  └─────────┘   └─────────┘   └─────────┘              │
└─────────────────────────────────────────────────────────┘
```

## Tech Stack

### Backend
- **Java 21** with **Spring Boot 3.4.1**
- **Spring Security** with JWT Authentication
- **Spring Data JPA** with PostgreSQL
- **Redis** for caching & OTP storage
- **Elasticsearch** for product search
- **RabbitMQ** for async messaging
- **WebSocket** for real-time order tracking
- **Razorpay, Stripe, PhonePe** for payments
- **AWS S3** for file storage
- **Firebase** for push notifications

### Frontend
- **Next.js 15** with React 19
- **TypeScript** for type safety
- **Tailwind CSS** + **Shadcn UI** for UI
- **Redux Toolkit** for state management
- **React Query** for server state
- **Framer Motion** for animations
- **NextAuth.js** for authentication
- **Socket.io** for real-time updates

## Project Structure

```
backend/
├── src/main/java/com/ecom/backend/
│   ├── config/          # App configuration
│   ├── security/        # JWT, Auth, Security
│   ├── entity/          # JPA entities
│   ├── dto/             # Request/Response DTOs
│   ├── repository/      # Data repositories
│   ├── service/         # Business logic
│   ├── controller/      # REST endpoints
│   ├── exception/       # Global exception handling
│   ├── util/            # Utilities
│   ├── mapper/          # Entity-DTO mappers
│   ├── scheduler/       # Scheduled tasks
│   ├── websocket/       # WebSocket configuration
│   ├── batch/           # Spring Batch jobs
│   └── audit/           # Audit logging
└── src/main/resources/
    ├── application.yml  # Main config
    ├── schema.sql       # Database schema
    └── templates/       # Email templates

frontend/
├── app/                 # Next.js App Router
├── components/          # React components
├── hooks/               # Custom hooks
├── lib/                 # Utilities
├── services/            # API services
├── store/               # Redux store
├── types/               # TypeScript types
└── utils/               # Helper functions
```

## API Endpoints

### Authentication
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/refresh` - Refresh token
- `POST /api/v1/auth/logout` - Logout
- `POST /api/v1/auth/otp/send` - Send OTP
- `POST /api/v1/auth/otp/verify` - Verify OTP
- `POST /api/v1/auth/forgot-password` - Forgot password
- `POST /api/v1/auth/reset-password` - Reset password

### Products
- `GET /api/v1/products` - List products (paginated, filterable)
- `GET /api/v1/products/{id}` - Product details
- `GET /api/v1/products/search` - Search products (Elasticsearch)
- `POST /api/v1/products` - Create product (Admin)
- `PUT /api/v1/products/{id}` - Update product (Admin)
- `DELETE /api/v1/products/{id}` - Delete product (Admin)

### Categories
- `GET /api/v1/categories` - List categories
- `GET /api/v1/categories/{slug}` - Category with products
- `POST /api/v1/categories` - Create category (Admin)
- `PUT /api/v1/categories/{id}` - Update category (Admin)

### Cart
- `GET /api/v1/cart` - Get user cart
- `POST /api/v1/cart/items` - Add to cart
- `PUT /api/v1/cart/items/{id}` - Update cart item
- `DELETE /api/v1/cart/items/{id}` - Remove from cart

### Orders
- `POST /api/v1/orders` - Create order
- `GET /api/v1/orders` - List user orders
- `GET /api/v1/orders/{orderNumber}` - Order details
- `PUT /api/v1/orders/{orderNumber}/cancel` - Cancel order
- `GET /api/v1/orders/{orderNumber}/track` - Track order

### Admin
- `GET /api/v1/admin/dashboard` - Dashboard stats
- `GET /api/v1/admin/orders` - All orders
- `GET /api/v1/admin/products` - All products
- `GET /api/v1/admin/users` - All users
- `GET /api/v1/admin/reports` - Reports

## Setup Instructions

### Prerequisites
- Java 21+
- Node.js 18+
- PostgreSQL 15+
- Redis
- Elasticsearch (optional for search)
- RabbitMQ (optional for queues)

### Backend Setup
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

### Environment Variables
Copy `.env.example` to `.env` and configure:
- Database credentials
- JWT secret
- Redis configuration
- Payment gateway keys
- AWS S3 credentials
- Email SMTP settings

## Docker Deployment
```bash
docker-compose up -d
```

## Security Features
- JWT with refresh token rotation
- OWASP Top 10 protection
- Role-based access control
- Rate limiting & brute force protection
- SQL injection prevention (JPA)
- XSS protection
- CSRF protection
- Secure headers
- Input validation & output encoding
- Audit logging
