# REPLY 1988 - Restaurant Order Management System

[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19.0-blue)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2-purple)](https://vitejs.dev/)

A modern, real-time restaurant order management system with multi-role support for guests, managers, kitchen staff, and baristas. Built with React, TypeScript, and Vite.

## 🌟 Features

### Multi-Role Dashboard
- **Guest View**: Table ordering with QR code support, real-time order tracking, bill requests
- **Manager View**: Order management, analytics dashboard, service alerts
- **Kitchen View**: Food preparation queue with status tracking
- **Bar View**: Beverage preparation queue with status tracking  
- **Admin View**: Menu management, pricing controls, inventory management

### Real-Time Synchronization
- Cross-tab communication using BroadcastChannel API
- State persistence with localStorage
- Instant updates across all connected terminals

### Internationalization
- English, Russian, and Vietnamese language support
- Dynamic language switching

### Demo Mode
- Automated order cycle demonstration
- 7-step simulation of complete order workflow

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd reply-1988

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

## 📁 Project Structure

```
src/
├── components/          # React components
│   ├── AdminMenuView.tsx    # Admin menu management
│   ├── AdminView.tsx        # Manager dashboard
│   ├── BarView.tsx          # Bar preparation queue
│   ├── DemoPanel.tsx        # Demo mode controls
│   ├── GuestView.tsx        # Customer ordering interface
│   ├── KitchenView.tsx      # Kitchen preparation queue
│   └── RoleSwitcher.tsx     # Role selection component
├── data/                # Static data
│   ├── menu.ts              # Menu items catalog
│   └── translations.ts      # i18n translations
├── state/               # State management
│   └── Store.ts             # Centralized state store
├── App.tsx              # Main application component
├── main.tsx             # Application entry point
└── types.ts             # TypeScript type definitions
```

## 🛠️ Tech Stack

- **Frontend Framework**: React 19 with hooks
- **Language**: TypeScript 5.8
- **Build Tool**: Vite 6.2
- **Styling**: Tailwind CSS 4.1
- **Icons**: Lucide React
- **State Management**: Custom store with BroadcastChannel
- **Animation**: Motion

## 🔧 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server (port 3000) |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run clean` | Remove dist folder and server.js |
| `npm run lint` | Run TypeScript type checking |

## 🎯 Usage Guide

### Dedicated Terminal Mode

Open specific roles in separate browser tabs:

```
# Guest view for Table 5
http://localhost:3000?role=guest&table=Table%205

# Manager dashboard
http://localhost:3000?role=manager

# Kitchen display
http://localhost:3000?role=kitchen

# Bar display
http://localhost:3000?role=bar

# Admin menu panel
http://localhost:3000?role=admin
```

### QR Code Integration

Use the built-in QR code generator to create table-specific codes for customers to scan and order directly from their devices.

## 🔒 Security Considerations

⚠️ **Important**: This is a demo/MVP application. For production use:

1. Implement proper authentication and authorization
2. Add input validation and sanitization
3. Secure API endpoints
4. Implement rate limiting
5. Add CSRF protection
6. Use HTTPS in production
7. Sanitize user-generated content (order notes)

## 🧪 Testing

```bash
# Run tests (when test suite is implemented)
npm test

# Run tests with coverage
npm run test:coverage
```

## 📊 Performance Optimizations

The application includes several performance optimizations:

- **Memoization**: React.memo for expensive component re-renders
- **Lazy Loading**: Code splitting for role-specific views
- **Efficient State Updates**: Immutable state patterns
- **Debounced Inputs**: Prevent excessive re-renders on form inputs
- **Virtual Scrolling**: For large order lists (recommended enhancement)

## 🐛 Known Limitations

1. No backend integration - all data stored in localStorage
2. No user authentication
3. Limited to single-device state sync via BroadcastChannel
4. No offline support beyond localStorage persistence

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Icons provided by [Lucide React](https://lucide.dev/)
- UI components styled with [Tailwind CSS](https://tailwindcss.com/)
- Build tooling by [Vite](https://vitejs.dev/)

## 📞 Support

For issues and feature requests, please open an issue on the GitHub repository.

---

**Built with ❤️ for modern restaurant management**
