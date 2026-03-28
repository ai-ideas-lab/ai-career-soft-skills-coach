# AI Career Soft Skills Coach - Frontend

A modern React-based frontend for the AI-powered career soft skills training platform, built with Vite for optimal development experience.

## 🚀 Features

- **Modern React Architecture**: Using React with TypeScript for type-safe development
- **Responsive Design**: Mobile-friendly interface with CSS Grid and Flexbox
- **Component-Based Structure**: Modular components for maintainability
- **Custom Styling**: Clean, professional CSS with utility classes
- **Interactive UI**: Engaging user interface for scenario training
- **Real-time Communication**: AI-powered conversation simulation
- **Progress Tracking**: Dashboard with detailed skill progress monitoring
- **Profile Management**: User profile with preferences and achievements

## 🛠️ Tech Stack

### Frontend
- **React 18**: UI library for building user interfaces
- **TypeScript**: Type-safe JavaScript development
- **Vite**: Fast build tool and development server
- **React Router**: Client-side routing
- **CSS3**: Modern styling with custom properties

### Development Tools
- **ESLint**: Code linting and style enforcement
- **TypeScript**: Type checking and compilation
- **npm**: Package management

## 📁 Project Structure

```
frontend/
├── public/
│   └── index.html                 # Main HTML template
├── src/
│   ├── components/
│   │   └── Header.tsx            # Navigation header component
│   ├── pages/
│   │   ├── Home.tsx              # Landing page
│   │   ├── Scenarios.tsx         # Scenario browsing and filtering
│   │   ├── Dashboard.tsx         # User dashboard with progress tracking
│   │   ├── Session.tsx           # Interactive training session
│   │   └── Profile.tsx          # User profile management
│   ├── services/
│   │   └── api.ts                # API service layer
│   ├── styles/
│   │   └── main.css             # Global styles and utilities
│   ├── utils/
│   │   └── helpers.ts           # Utility functions
│   ├── App.tsx                   # Main application component
│   └── main.tsx                  # Application entry point
└── vite.config.ts               # Vite configuration
```

## 🎯 Page Components

### Home (`/`)
- Welcome section with call-to-action buttons
- Key features showcase
- Training scenarios overview
- Responsive grid layout

### Scenarios (`/scenarios`)
- Comprehensive scenario browsing
- Advanced filtering by category, level, and search
- Scenario cards with difficulty ratings
- Skills practiced indicators
- Interactive scenario selection

### Dashboard (`/dashboard`)
- Training statistics overview
- Skill progress tracking with visual progress bars
- Recent activity timeline
- Performance metrics
- Achievement display

### Session (`/session/:id`)
- Interactive training interface
- Real-time AI conversation simulation
- Question-answering system
- Immediate feedback and scoring
- Session completion tracking

### Profile (`/profile`)
- User account information
- Level and experience tracking
- Skill progression visualization
- Preference management
- Achievement badges

## 🚀 Development

### Prerequisites
- Node.js 18+ installed
- npm package manager

### Installation
```bash
# Install dependencies
npm install

# Install frontend-specific dependencies
npm install react react-dom @types/react @types/react-dom

# Install development dependencies
npm install vite @vitejs/plugin-react --save-dev
```

### Development Servers

**Start both backend and frontend:**
```bash
./dev.sh
```

**Start frontend only:**
```bash
npm run dev:frontend
```
Frontend will be available at: http://localhost:3000

**Start backend only:**
```bash
npm run dev
```
Backend API will be available at: http://localhost:8000

### Building for Production
```bash
npm run build:frontend
```
Built files will be in the `dist/frontend/` directory.

### Code Quality
```bash
# Lint code
npm run lint

# Type check
npm run type-check
```

## 🔧 Configuration

### Vite Configuration (`vite.config.ts`)
- React plugin configuration
- Path aliases for cleaner imports
- Development server proxy for API calls
- Build output configuration

### Proxy Configuration
The frontend is configured to proxy API requests to the backend server:
```typescript
server: {
  port: 3000,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      secure: false
    }
  }
}
```

## 🎨 Styling

### Design System
- **Color Palette**: Primary blue (#1976d2), accent colors for different states
- **Typography**: Roboto font family with clear hierarchy
- **Spacing**: Consistent spacing using CSS custom properties
- **Components**: Reusable card, button, form components

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox for layouts
- Breakpoints for different screen sizes
- Touch-friendly interface elements

## 📱 Features Overview

### Interactive Training
- **AI Conversation Simulation**: Realistic workplace dialogues
- **Question-Answer System**: Multiple choice questions with feedback
- **Progressive Difficulty**: Adaptive difficulty based on performance
- **Real-time Scoring**: Immediate performance feedback

### User Experience
- **Intuitive Navigation**: Clear menu structure and breadcrumbs
- **Loading States**: Smooth loading animations
- **Error Handling**: Graceful error messages
- **Accessibility**: Keyboard navigation and screen reader support

### Progress Tracking
- **Skill Metrics**: Detailed skill progress visualization
- **Achievement System**: Level progression and badges
- **Session History**: Complete training session tracking
- **Performance Analytics**: Comprehensive score breakdown

## 🔗 API Integration

The frontend integrates with the backend API through:
- RESTful API endpoints for data retrieval
- WebSocket support for real-time communication
- Error handling for network failures
- Authentication state management

## 🚧 Future Enhancements

### Planned Features
- **Dark Mode Theme**: Dark/light mode toggle
- **Internationalization**: Multi-language support
- **PWA Support**: Progressive Web App capabilities
- **Offline Mode**: Offline training capabilities
- **Advanced Analytics**: Detailed performance analytics

### Technical Improvements
- **State Management**: Integration with Redux or Zustand
- **Testing**: Jest and React Testing Library
- **Performance**: Code splitting and lazy loading
- **Accessibility**: Enhanced WCAG compliance

## 📄 License

This frontend is part of the AI Career Soft Skills Coach project and is licensed under the MIT License.

---

*Built with ❤️ using React, TypeScript, and Vite*