# 🛍️ Shopping App

A modern, full-stack e-commerce application built with performance and scalability in mind. This platform provides a seamless shopping experience for users and a robust management dashboard for administrators.

## 📋 Project Summary
The **Shopping App** is a complete e-commerce solution that enables users to browse products, manage their shopping cart, place orders securely, and track their order history. It features a secure authentication system, including Google OAuth, and distinguishes between standard users and administrators.

**Key Features:**
-   **User Authentication:** Secure login/register with JWT and Google OAuth integration.
-   **Product Management:** Interactive product catalog with categories and search.
-   **Shopping Cart:** Real-time cart management and checkout process.
-   **Order System:** Order history and tracking.
-   **Admin Dashboard:** Comprehensive tools for managing products (CRUD operations, trash mode) and users.
-   **Responsive Design:** Fully responsive UI built with Bootstrap 5.

## 🛠️ Languages & Technologies

This project utilizes a modern tech stack to ensure high performance and developer experience.

### **Frontend**
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Framework:** [React 19](https://react.dev/)
-   **Build Tool:** [Vite](https://vitejs.dev/)
-   **Styling:** [Bootstrap 5.3](https://getbootstrap.com/)
-   **State Management:** [Zustand](https://zustand-demo.pmnd.rs/)
-   **Routing:** [React Router 7](https://reactrouter.com/)
-   **HTTP Client:** [Axios](https://axios-http.com/)
-   **Notifications:** [React Hot Toast](https://react-hot-toast.com/)

### **Backend**
-   **Framework:** [NestJS 11](https://nestjs.com/)
-   **Language:** [TypeScript](https://www.typescriptlang.org/)
-   **Database:** [PostgreSQL](https://www.postgresql.org/)
-   **ORM:** [TypeORM](https://typeorm.io/)
-   **Authentication:** [Passport.js](https://www.passportjs.org/) (JWT, Google Strategy)
-   **File Storage:** [Cloudinary](https://cloudinary.com/) (for product images)
-   **Validation:** Class Validator & Class Transformer

## 🚀 Getting Started

### Prerequisites
-   Node.js (v18+ recommended)
-   PostgreSQL
-   npm or pnpm

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/shopping-app.git
    cd shopping-app
    ```

2.  **Setup Backend:**
    ```bash
    cd backend
    npm install
    # Configure your .env file
    npm run start:dev
    ```

3.  **Setup Frontend:**
    ```bash
    cd frontend
    npm install
    npm run dev
    ```

---
Made with ❤️ by [Your Name]