# Design Editor - Collaborative Canvas-Based Design Tool

> A real-time collaborative design editor built with React, TypeScript, Konva.js, and Socket.io. Think Canva/Figma-lite.

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Quick Start](#quick-start)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)

---

## 🎯 Overview

**Design Editor** is a collaborative canvas-based design tool that allows multiple users to create designs with text, images, and shapes in real-time. Built as a technical assignment with a 48-hour time-box.

**Key Highlights**:
- ✅ **Real-time Collaboration**: Multiple users editing simultaneously via Socket.io
- ✅ **Canvas Rendering**: High-performance canvas with Konva.js
- ✅ **State Management**: Redux Toolkit with custom middleware
- ✅ **Type Safety**: Full TypeScript coverage
- ✅ **Persistence**: MongoDB via REST API
- ✅ **Comments System**: @mentions and real-time updates

---

## ✨ Features

### Core Features Implemented

#### 🎨 Canvas Editing
- Fixed & Custom Sizes (1080×1080 preset + custom dimensions)
- Background (Solid colors and linear gradients)
- Zoom (10% - 400% with auto-fit on load)
- Export to PNG (client-side)

#### 🔧 Elements
- **Text**: Font family, size, color, weight, style
- **Images**: URL input, Unsplash integration, filters (grayscale, sepia, blur, brightness)
- **Shapes**: Rectangle, Circle, Triangle, Star, Pentagon, Hexagon, Line, Arrow
- **Styling**: Fill, stroke, opacity, stroke style (solid/dashed/dotted)

#### 🎯 Transformations
- Move (drag), Resize (aspect ratio lock), Rotate (transformer handles)
- Selection handles and bounding boxes

#### 📚 Layer Management
- Layers panel with visual list
- Drag-and-drop reordering
- Rename and delete layers

#### ⏮️ Undo/Redo
- Last 10+ actions (configurable)
- Keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
- Synced across multiple users

#### 💾 Persistence
- Auto-save (debounced 2 seconds)
- Manual save with status indicator
- MongoDB storage via REST API

#### 👥 Real-time Collaboration
- Socket.io WebSocket-based sync
- Multi-user editing (unlimited concurrent editors)
- Active users count
- Last-Write-Wins conflict resolution
- 9 granular socket events

#### 💬 Comments
- Add comments with @mentions
- Autocomplete user search
- Real-time updates
- MongoDB persistence

#### 📁 Design Management
- Create, list, open, rename, delete designs

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Cmd/Ctrl + Z` | Undo |
| `Cmd/Ctrl + Shift + Z` | Redo |
| `Cmd/Ctrl + C` | Copy element |
| `Cmd/Ctrl + V` | Paste element |
| `Backspace/Delete` | Delete selected element |

---

## ⚡ Quick Start

### Prerequisites

- Node.js v18+
- npm v9+

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd design-editor-web

# Install dependencies
npm install

# Create environment file
touch .env
```

Add to `.env`:
```env
VITE_API_URL=https://design-editor-backend-production.up.railway.app/api
VITE_SOCKET_URL=https://design-editor-backend-production.up.railway.app
```

```bash
# Start development server
npm run dev
```

The app will open at `http://localhost:3002`

### Testing Multi-User Collaboration

1. Open a design in your browser
2. Copy the URL from address bar
3. Open the same URL in an incognito/private window
4. Make changes in one window → See updates in the other instantly!

---

## 📚 Documentation

See **[ARCHITECTURE.md](./ARCHITECTURE.md)** for:
- Complete architecture overview
- Tech stack decisions (React, Konva, Redux, etc.) with pros/cons
- What was implemented and why
- What was cut and why (due to 48-hour time constraint)
- Database schema and API design

---

## 🛠️ Tech Stack

### Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| **React** | 18.2.0 | UI Framework |
| **TypeScript** | 5.3.3 | Type Safety |
| **Redux Toolkit** | 2.2.1 | State Management |
| **Konva.js** | 9.3.6 | Canvas Rendering |
| **React-Konva** | 18.2.10 | React bindings for Konva |
| **Socket.io-client** | 4.8.1 | Real-time Sync |
| **Axios** | 1.6.7 | HTTP Client |
| **Tailwind CSS** | 3.4.1 | Styling |
| **Vite** | 5.1.4 | Build Tool |
| **Vitest** | 1.3.1 | Testing Framework |

### Backend

| Technology | Purpose |
|------------|---------|
| **Node.js + Express** | REST API server |
| **Socket.io** | WebSocket server |
| **MongoDB + Mongoose** | Database + ODM |
| **Zod** | Runtime validation |

**Note**: Backend is in a separate repository and deployed on Railway.

---

## 📁 Project Structure

```
design-editor-web/
├── public/
│   ├── favicon.svg
│   └── _redirects
├── src/
│   ├── atoms/                   # Smallest components (DraggableRect, DraggableCircle, etc.)
│   ├── molecules/               # Composite components (LayersPanel, StylesPanel, etc.)
│   ├── organisms/               # Complex components (TopToolbar, CanvasArea, etc.)
│   ├── pages/                   # Route components (LandingPage, EditorPage)
│   ├── store/                   # Redux slices and middleware
│   ├── middleware/              # Socket middleware
│   ├── services/                # API clients (designApi, commentsApi, socketService)
│   ├── types/                   # TypeScript definitions
│   ├── utils/                   # Helper functions
│   ├── hooks/                   # Custom React hooks
│   ├── context/                 # React Context
│   ├── data/                    # Static data/presets
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── ARCHITECTURE.md
├── README.md
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

---

## 🧪 Testing

**Status**: Vitest configured but no tests written (time constraints)

All features manually tested:
- ✅ Canvas operations (add, edit, delete, transform)
- ✅ Design management (create, save, load, rename, delete)
- ✅ Real-time collaboration (multi-window testing)
- ✅ Comments system (@mentions, persistence)
- ✅ Error handling

See **ARCHITECTURE.md** for what was cut and why.

---

## 🚢 Deployment

**Frontend**: Netlify/Vercel
- Build Command: `npm run build`
- Publish Directory: `dist`

**Backend**: Railway (separate repository)
- MongoDB Atlas for database

---

## 📝 Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
npm run lint:fix     # Auto-fix ESLint errors
npm run format       # Format code with Prettier
npm run type-check   # Check TypeScript types
```

---

**Built in 48 hours as a technical assignment**