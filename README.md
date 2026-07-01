# Gerona Library

The Gerona Library project is a comprehensive library management system designed for librarians, administrators, and library patrons. It modernizes library operations by providing tools to efficiently manage catalogs, track circulation, monitor visitor logs, and handle print services in a centralized platform.

---

## ✨ Features

- **Public Catalog & Print Station:** Allow patrons to browse the library catalog, register for cards, and upload documents for printing.
- **Kiosk Interface:** Features a dedicated kiosk view for smart scanning and tracking active visitor logs.
- **Circulation Management:** Seamlessly handle book checkouts, returns, and inventory tracking.
- **Patron & Donation Management:** Manage registered patrons, track library usage, and record book donations.
- **Admin Dashboard:** Access analytics, export reports (visitors, circulation, print services), and manage system users.

---

<h3>Languages & Tools (⌐■_■)</h3>

<p align="left">
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" width="35" title="Laravel"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" width="35" title="React"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" width="35" title="PHP"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg" width="35" title="TypeScript"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" width="35" title="Tailwind CSS"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/sqlite/sqlite-original.svg" width="35" title="SQLite"/>
  <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg" width="35" title="Vite"/>
</p>

---

## 🚀 Getting Started

### Prerequisites

- PHP >= 8.2
- Node.js & npm
- Composer

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd gerona-library
   ```

2. Install PHP dependencies:
   ```bash
   composer install
   ```

3. Install Node dependencies:
   ```bash
   npm install
   ```

4. Set up your environment file:
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

5. Run database migrations:
   ```bash
   php artisan migrate
   ```

### Environment Variables

Ensure the following variables are configured in your `.env` file:

```env
APP_NAME=
APP_ENV=
APP_KEY=
APP_URL=

DB_CONNECTION=
```

### Run

Start the Laravel development server and Vite simultaneously:

```bash
php artisan serve
```
```bash
npm run dev
```

---

## 📄 License

Copyright (c) 2026 ALLEN ICEE DEQUIROS

This project is shared for portfolio, educational, and learning purposes.

You are welcome to study the codebase and use it as inspiration for your own projects.

Copying substantial portions of this project, redistributing it, submitting it as your own work, or creating direct clones is not permitted without explicit permission.

If this project inspires your work, please build your own implementation rather than copying the source code.

All rights reserved.
