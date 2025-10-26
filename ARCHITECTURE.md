# Design Editor - Architecture & Technical Documentation

## Table of Contents
1. [Overview](#overview)
2. [Architecture Overview](#architecture-overview)
3. [Technology Stack & Decisions](#technology-stack--decisions)
4. [Frontend Architecture](#frontend-architecture)
5. [State Management](#state-management)
6. [Real-time Collaboration](#real-time-collaboration)
7. [API Integration](#api-integration)
8. [Database Schema](#database-schema)
9. [Features Implemented](#features-implemented)
10. [What Was Cut & Why](#what-was-cut--why)
11. [Performance Optimizations](#performance-optimizations)
12. [Testing Strategy](#testing-strategy)

---

## Overview

**Design Editor** is a collaborative canvas-based design tool (Canva/Figma-lite) built with React, TypeScript, and Konva.js. It enables multiple users to create designs with text, images, and shapes, collaborate in real-time, and add comments with @mentions.

**Time-boxed Development**: 48 hours
**Deployment**: Frontend on Netlify/Vercel, Backend on Railway

---

## Architecture Overview

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      Frontend (React)                        │
│  ┌────────────┐  ┌──────────────┐  ┌──────────────────┐    │
│  │   Pages    │  │  Organisms   │  │   Molecules      │    │
│  │ Landing    │  │  TopToolbar  │  │  LayersPanel     │    │
│  │ Editor     │  │  CanvasArea  │  │  StylesPanel     │    │
│  └────────────┘  │  LeftSidebar │  │  CommentsPanel   │    │
│                  └──────────────┘  └──────────────────┘    │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Redux Store (State Management)              │  │
│  │  • canvasSlice    • designSlice   • commentsSlice    │  │
│  │  • historySlice   • uploadSlice                      │  │
│  └──────────────────────────────────────────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │                   Middleware                          │  │
│  │  • historyMiddleware (Undo/Redo)                     │  │
│  │  • socketMiddleware (Real-time sync)                 │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                            ↕
                    ┌───────────────┐
                    │  Socket.io    │
                    │  (WebSocket)  │
                    └───────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│              Backend (Node.js + Express)                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────┐  │
│  │   REST API   │  │  Socket.io   │  │   Validation     │  │
│  │   Routes     │  │   Server     │  │   (Zod)          │  │
│  └──────────────┘  └──────────────┘  └──────────────────┘  │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐  │
│  │              MongoDB (Mongoose ODM)                   │  │
│  │  • Designs Collection  • Comments Collection         │  │
│  │  • Users Collection                                  │  │
│  └──────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

---

## Technology Stack & Decisions

### Frontend Stack

| Technology | Version | Why Chosen | Pros | Cons |
|------------|---------|------------|------|------|
| **React** | 18.2.0 | Required by assignment | Component reusability, large ecosystem, hooks | Can be verbose for simple UIs |
| **TypeScript** | 5.3.3 | Required by assignment | Type safety, better IDE support, fewer runtime errors | Steeper learning curve, more boilerplate |
| **Redux Toolkit** | 2.2.1 | Required for state management | Simplified Redux, built-in DevTools, middleware support | Overkill for small apps, learning curve |
| **Konva.js** | 9.3.6 | Canvas rendering library | High performance, rich API, transformer support | Larger bundle size than raw canvas |
| **React-Konva** | 18.2.10 | React bindings for Konva | Declarative canvas rendering, React integration | Abstraction overhead |
| **Socket.io-client** | 4.8.1 | Real-time communication | Auto-reconnection, fallback support, room support | Larger than native WebSocket |
| **Axios** | 1.6.7 | HTTP client | Interceptors, better error handling, timeout support | Larger than fetch API |
| **Tailwind CSS** | 3.4.1 | Utility-first CSS | Fast development, consistent design, small bundle | HTML can get verbose |
| **Lucide React** | 0.344.0 | Icon library | Tree-shakeable, consistent design, TypeScript support | Limited icon set vs Font Awesome |
| **React Router** | 7.9.4 | Client-side routing | Standard for React SPAs, nested routes | Overkill for 2-page app |
| **React Hot Toast** | 2.4.1 | Toast notifications | Simple API, customizable, accessible | Limited animation options |
| **Vite** | 5.1.4 | Build tool | Fast HMR, modern ESM, optimized builds | Newer, less mature than Webpack |
| **Vitest** | 1.3.1 | Testing framework | Vite-native, fast, Jest-compatible API | Smaller ecosystem than Jest |

### Why Konva.js over Fabric.js or Raw Canvas?

**Decision**: Konva.js

**Reasoning**:
1. **Performance**: Konva uses a layered canvas approach, optimizing re-renders
2. **Transformer API**: Built-in selection handles, rotation, and resize out-of-the-box
3. **React Integration**: `react-konva` provides declarative canvas rendering
4. **Event Handling**: Robust mouse/touch event system
5. **Export**: Simple `stage.toDataURL()` and `stage.toCanvas()` methods

**Alternatives Considered**:
- **Fabric.js**: More features but heavier, less React-friendly
- **Raw Canvas**: Maximum control but requires building transformer logic from scratch

---

## Frontend Architecture

### Component Structure (Atomic Design Pattern)

```
src/
├── atoms/              # Smallest reusable components
│   ├── DraggableRect.tsx
│   ├── DraggableCircle.tsx
│   ├── DraggableText.tsx
│   ├── DraggableImage.tsx
│   ├── DraggableStar.tsx
│   ├── DraggablePolygon.tsx
│   ├── DraggableLine.tsx
│   ├── DraggableArrow.tsx
│   ├── LayerItem.tsx
│   ├── CommentItem.tsx
│   └── MentionDropdown.tsx
│
├── molecules/          # Combinations of atoms
│   ├── LayersPanel.tsx
│   ├── StylesPanel.tsx
│   ├── ElementsPanel.tsx
│   ├── PhotosPanel.tsx
│   ├── BackgroundPanel.tsx
│   ├── ResizePanel.tsx
│   ├── CommentsPanel.tsx
│   ├── CommentInput.tsx
│   ├── ZoomControls.tsx
│   ├── DesignCard.tsx
│   ├── DeleteConfirmModal.tsx
│   └── RenameDesignModal.tsx
│
├── organisms/          # Complex components
│   ├── TopToolbar.tsx
│   ├── LeftSidebar.tsx
│   ├── SidePanel.tsx
│   ├── CanvasArea.tsx
│   └── DesignCanvas.tsx
│
├── pages/              # Route-level components
│   ├── LandingPage.tsx
│   └── EditorPage.tsx
│
├── store/              # Redux state management
│   ├── index.ts
│   ├── canvasSlice.ts
│   ├── designSlice.ts
│   ├── historySlice.ts
│   ├── commentsSlice.ts
│   ├── uploadSlice.ts
│   ├── historyMiddleware.ts
│   └── remoteUpdateFlag.ts
│
├── middleware/         # Custom middleware
│   └── socketMiddleware.ts
│
├── services/           # API clients
│   ├── api.ts
│   ├── designApi.ts
│   ├── commentsApi.ts
│   ├── usersApi.ts
│   └── socketService.ts
│
├── types/              # TypeScript definitions
│   ├── canvas.ts
│   ├── comments.ts
│   └── shapeProps.ts
│
├── utils/              # Helper functions
│   ├── exportCanvas.ts
│   └── shapeFactory.tsx
│
├── hooks/              # Custom React hooks
│   └── useUndoRedo.ts
│
├── context/            # React Context
│   └── CanvasContext.tsx
│
└── data/               # Static data/presets
    ├── shapePresets.ts
    ├── backgroundPresets.ts
    ├── resizePresets.ts
    └── unsplashPhotos.ts
```

### Design Patterns Used

1. **Atomic Design**: Components organized by complexity (atoms → molecules → organisms → pages)
2. **Container/Presentational**: Smart components (connected to Redux) vs dumb components (props only)
3. **Custom Hooks**: Encapsulate reusable logic (e.g., `useUndoRedo`, `useCanvasContext`)
4. **Middleware Pattern**: Redux middleware for cross-cutting concerns (history, sockets)
5. **Factory Pattern**: `shapeFactory.tsx` creates canvas elements based on type
6. **Observer Pattern**: Socket.io event listeners for real-time updates

---

## State Management

### Redux Store Structure

```typescript
{
  canvas: {
    elements: CanvasElement[],      // All shapes/text/images on canvas
    selectedElementId: string | null,
    activeTool: string | null,
    canvasWidth: number,
    canvasHeight: number,
    zoom: number,
    canvasBackground: string
  },
  
  history: {
    past: CanvasSnapshot[],         // For undo
    present: CanvasSnapshot,        // Current state
    future: CanvasSnapshot[]        // For redo
  },
  
  design: {
    currentDesign: Design | null,   // Currently open design
    designs: Design[],              // List of all designs
    loading: boolean,
    error: string | null,
    saveStatus: 'idle' | 'saving' | 'saved' | 'error',
    hasUnsavedChanges: boolean,
    clientId: string | null,        // Unique ID for this browser tab
    activeUsers: number,            // Number of users editing
    isSocketConnected: boolean
  },
  
  comments: {
    comments: Comment[],
    users: User[],                  // For @mentions
    loading: boolean,
    error: string | null
  },
  
  upload: {
    uploadedImages: string[]        // URLs of uploaded images
  }
}
```

### Middleware Architecture

#### 1. History Middleware
**Purpose**: Automatically record canvas state for undo/redo

```typescript
// Triggers history recording on these actions:
- canvas/addElement
- canvas/updateElement
- canvas/deleteElement
- canvas/reorderElements
- canvas/setCanvasBackground
- canvas/setCanvasDimensions

// Skips history for:
- canvas/restoreElements (used during undo/redo)
- Remote updates (prevents recording other users' changes)
```

#### 2. Socket Middleware
**Purpose**: Sync local changes to other users via Socket.io

```typescript
// Emits socket events when:
- Element added → design:element-add
- Element updated → design:element-update
- Element deleted → design:element-delete
- Elements reordered → design:reorder
- Background changed → design:background-change
- Canvas resized → design:resize
- Design renamed → design:name-change
- Undo/Redo → design:update (full state)

// Listens for socket events:
- design:user-joined → Update active users count
- design:user-left → Update active users count
- design:update → Merge remote changes
- design:element-add → Add element from remote
- design:element-update → Update element from remote
- design:element-delete → Delete element from remote
- design:reorder → Reorder elements from remote
- design:background-change → Update background from remote
- design:resize → Update canvas size from remote
- design:name-change → Update design name from remote
```

---

## Real-time Collaboration

### Socket.io Event Architecture

**Connection Flow**:
1. User opens design → Connect to Socket.io server
2. Emit `design:join` with `designId` and `clientId`
3. Server adds user to room and broadcasts `design:user-joined`
4. User makes change → Emit specific event (e.g., `design:element-add`)
5. Server broadcasts to all users in room except sender
6. Other users receive event → Update Redux state
7. User closes design → Emit `design:leave`

### Conflict Resolution Strategy

**Last-Write-Wins (LWW)** with timestamp-based ordering:

```typescript
// Each update includes:
{
  designId: string,
  clientId: string,      // Identifies sender
  timestamp: number,     // Date.now()
  changes: {...}
}

// Receiver logic:
if (update.clientId === myClientId) {
  return; // Ignore own updates
}

// Apply update immediately (optimistic)
// Server is source of truth for persistence
```

**Why LWW?**
- Simple to implement in 48 hours
- Works well for design tools (users typically work on different elements)
- No complex CRDT or OT algorithms needed

**Limitations**:
- Simultaneous edits to same element → last one wins
- No automatic merge of conflicting changes
- Better suited for operational transformation (future enhancement)

### Remote Update Handling

**Problem**: Prevent infinite loops when receiving remote updates

**Solution**: `remoteUpdateFlag.ts`

```typescript
let isProcessingRemoteUpdate = false;

export const setIsProcessingRemoteUpdate = (value: boolean) => {
  isProcessingRemoteUpdate = value;
};

export const getIsProcessingRemoteUpdate = () => isProcessingRemoteUpdate;

// Usage in socketMiddleware:
setIsProcessingRemoteUpdate(true);
dispatch(updateElement({ id, changes }));
setIsProcessingRemoteUpdate(false);

// historyMiddleware checks this flag:
if (getIsProcessingRemoteUpdate()) {
  return; // Don't record history for remote updates
}
```

---

## API Integration

### REST API Endpoints

**Base URL**: `https://design-editor-backend-production.up.railway.app/api`

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/designs` | Get all designs | - | `{ success, data: Design[] }` |
| GET | `/designs/:id` | Get design by ID | - | `{ success, data: Design }` |
| POST | `/designs/create` | Create new design | `{ name, width?, height?, canvasBackground?, elements? }` | `{ success, data: Design }` |
| PUT | `/designs/:id` | Update design | `{ name?, width?, height?, canvasBackground?, elements? }` | `{ success, data: Design }` |
| DELETE | `/designs/:id` | Delete design | - | `{ success, data: { id, name } }` |
| GET | `/comments?designId=:id` | Get comments for design | - | `{ success, data: Comment[], count, total, page, totalPages }` |
| POST | `/comments` | Create comment | `{ designId, authorId, text, mentions[] }` | `{ success, data: Comment }` |
| DELETE | `/comments/:id` | Delete comment | - | `{ success }` |
| GET | `/users/search?q=:query` | Search users for @mentions | - | `{ success, data: User[], count }` |

### Error Response Format

```json
{
  "success": false,
  "code": "VALIDATION_ERROR",
  "message": "Invalid design data",
  "details": "Width must be a positive number"
}
```

### API Client Configuration

```typescript
// src/services/api.ts
const apiClient = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
});

// Request interceptor (for future auth)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor (error handling)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    }
    return Promise.reject(error);
  }
);
```

---

## Database Schema

### Designs Collection

```typescript
{
  _id: ObjectId,
  name: string,                    // "My Design"
  description?: string,
  width: number,                   // 1080
  height: number,                  // 1080
  canvasBackground: string,        // "#ffffff" or gradient CSS
  elements: [
    {
      id: string,                  // UUID
      type: 'rectangle' | 'circle' | 'text' | 'image' | ...,
      name?: string,               // "Rectangle-1"
      x: number,
      y: number,
      rotation: number,
      fill: string,
      stroke?: string,
      strokeWidth?: number,
      opacity?: number,
      
      // Shape-specific
      width?: number,
      height?: number,
      radius?: number,
      radiusX?: number,
      radiusY?: number,
      sides?: number,
      points?: number[],
      innerRadius?: number,
      outerRadius?: number,
      scaleX?: number,
      scaleY?: number,
      
      // Text-specific
      text?: string,
      fontSize?: number,
      fontFamily?: string,
      fontStyle?: string,
      fontWeight?: number,
      
      // Image-specific
      imageUrl?: string,
      photographer?: string,
      
      // Styling
      strokeDasharray?: string,
      imageFilter?: string,
      imageFilterIntensity?: number
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Comments Collection

```typescript
{
  _id: ObjectId,
  designId: ObjectId,              // Reference to Design
  author: {
    _id: ObjectId,
    name: string,
    email?: string,
    avatar?: string
  },
  text: string,                    // "Great design @john!"
  mentions: [                      // Populated User objects
    {
      _id: ObjectId,
      name: string,
      email?: string,
      avatar?: string
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

### Users Collection

```typescript
{
  _id: ObjectId,
  name: string,
  email: string,
  avatar?: string,                 // URL to avatar image
  createdAt: Date,
  updatedAt: Date
}
```

---

## Features Implemented

### ✅ Core Requirements (All Implemented)

#### 1. Canvas
- ✅ Fixed size preset (1080×1080 px)
- ✅ Custom canvas sizes via Resize panel
- ✅ Background color and gradient support
- ✅ Zoom controls (10% - 400%)
- ✅ Auto-fit zoom on load

#### 2. Add & Edit Elements
- ✅ **Text**: Font family, size, color, weight, style
- ✅ **Images**: URL input, Unsplash integration, filters (grayscale, sepia, blur, brightness)
- ✅ **Shapes**: Rectangle, Circle, Triangle, Star, Pentagon, Hexagon, Line, Arrow
- ✅ **Styling**: Fill color, stroke color, stroke width, opacity, stroke style (solid/dashed/dotted)

#### 3. Transformations
- ✅ Move (drag)
- ✅ Resize (with aspect ratio lock for images and shapes)
- ✅ Rotate (via transformer handles)
- ✅ Selection handles and bounding boxes
- ✅ Multi-select support (Konva Transformer)

#### 4. Layer Order (Z-Index)
- ✅ Layers panel showing all elements
- ✅ Drag-and-drop reordering
- ✅ Rename layers
- ✅ Delete layers
- ✅ Visual indication of selected layer

#### 5. Undo/Redo
- ✅ Last 10+ actions (configurable)
- ✅ Keyboard shortcuts (Cmd/Ctrl+Z, Cmd/Ctrl+Shift+Z)
- ✅ Works with all canvas operations
- ✅ Syncs across users via Socket.io

#### 6. Export
- ✅ Export to PNG (client-side)
- ✅ Includes background (solid colors and gradients)
- ✅ Full resolution export (no quality loss)
- ✅ Custom filename based on design name

#### 7. Persistence
- ✅ Save design to MongoDB via REST API
- ✅ Auto-save on changes (debounced 2 seconds)
- ✅ Manual save button
- ✅ Save status indicator (saving/saved/error)
- ✅ Reload design from database

#### 8. Real-time Multi-User Editing
- ✅ Socket.io integration
- ✅ Multiple users can edit simultaneously
- ✅ Live cursor updates (via element changes)
- ✅ Active users count display
- ✅ Granular event system (9 socket events)
- ✅ Conflict resolution (Last-Write-Wins)
- ✅ Auto-reconnection on disconnect

#### 9. Comments
- ✅ Add comments to design
- ✅ View past comments
- ✅ @mention support with autocomplete
- ✅ User search API
- ✅ Delete comments
- ✅ Persist comments in MongoDB
- ✅ Real-time comment updates

#### 10. Design Management
- ✅ Create new designs
- ✅ List all designs (name, updated time)
- ✅ Open existing designs
- ✅ Edit existing designs
- ✅ Delete designs
- ✅ Rename designs
- ✅ Design cards with metadata

### ✅ Nice-to-Haves Implemented

- ✅ **Autosave**: Debounced 2-second auto-save
- ✅ **Keyboard Shortcuts**:
  - Delete (Backspace/Delete)
  - Undo (Cmd/Ctrl+Z)
  - Redo (Cmd/Ctrl+Shift+Z)
  - Copy/Paste (Cmd/Ctrl+C, Cmd/Ctrl+V)
- ✅ **Simple Auth Placeholder**: Token interceptor in API client (ready for JWT)
- ✅ **CI/CD**: Deployed to Railway (backend) and Netlify/Vercel (frontend)
- ✅ **Linting**: ESLint + Prettier configured
- ✅ **Type Safety**: Full TypeScript coverage

---

## What Was Cut & Why

### ❌ Not Implemented (Due to Time Constraints)

#### 1. Rulers and Guides / Snapping
**Why Cut**:
- Low priority for MVP
- Complex implementation (requires custom Konva layer)
- Would take 4-6 hours to implement properly
- Can be added post-MVP

**Impact**: Users must manually align elements

#### 2. E2E Tests (Playwright)
**Why Cut**:
- Unit tests provide better ROI in 48 hours
- E2E tests require stable backend deployment first
- Playwright setup + writing tests = 6-8 hours
- Manual testing covered critical paths

**Impact**: No automated browser testing (manual QA performed)

#### 3. Unit Tests
**Why Cut**:
- Prioritized feature completeness over test coverage
- Vitest configured but no tests written
- Would need 8-10 hours for comprehensive coverage
- Time better spent on real-time features

**Impact**: No automated test coverage (manual testing performed)

#### 4. Thumbnail Generation Endpoint
**Why Cut**:
- Backend complexity (requires headless browser or canvas library)
- Not critical for core functionality
- Would take 3-4 hours to implement
- Can use placeholder images for now

**Impact**: Design cards show placeholder instead of thumbnails

#### 5. Advanced Keyboard Shortcuts
**Why Cut**:
- Arrow keys for nudging elements
- Cmd/Ctrl+D for duplicate
- Cmd/Ctrl+G for grouping
- Would take 2-3 hours to implement all shortcuts

**Impact**: Limited keyboard navigation (only Delete, Undo, Redo, Copy, Paste work)

#### 6. User Authentication (Full Implementation)
**Why Cut**:
- JWT token system prepared but not enforced
- No login/signup UI
- No user sessions
- Would take 4-5 hours for full auth flow

**Impact**: All users share same designs (no user isolation)

**Workaround**: API client has auth interceptor ready for future JWT integration

#### 7. Image Upload to Server
**Why Cut**:
- Currently uses URL input only
- File upload requires backend storage (S3/Cloudinary)
- Would take 3-4 hours to implement

**Impact**: Users must provide image URLs (Unsplash integration helps)

#### 8. Advanced Text Editing
**Why Cut**:
- No rich text formatting (bold, italic, underline in same text)
- No text alignment (left/center/right)
- No line height control
- Would take 4-5 hours to implement

**Impact**: Basic text styling only (font, size, color, weight, style)

#### 9. Grouping/Ungrouping Elements
**Why Cut**:
- Complex Konva implementation
- Requires nested group structure
- Would take 4-5 hours to implement properly

**Impact**: Users can't group elements together

#### 10. Canvas Grid/Background Pattern
**Why Cut**:
- Low priority visual enhancement
- Would take 1-2 hours to implement

**Impact**: Plain background only (solid colors or gradients)

#### 11. Export to Other Formats (SVG, PDF)
**Why Cut**:
- PNG export covers primary use case
- SVG export requires custom serialization
- PDF requires external library (jsPDF)
- Would take 3-4 hours for both formats

**Impact**: PNG export only

#### 12. Version History
**Why Cut**:
- Complex feature requiring design snapshots
- Database schema changes needed
- Would take 6-8 hours to implement

**Impact**: No design version history (only undo/redo in current session)

#### 13. Collaborative Cursors
**Why Cut**:
- Requires tracking mouse position for all users
- High socket traffic
- Would take 3-4 hours to implement

**Impact**: Can't see other users' cursors (can see their edits in real-time)

#### 14. Presence Indicators (User Avatars)
**Why Cut**:
- Requires user authentication first
- Would take 2-3 hours to implement

**Impact**: Only active user count shown (no names/avatars)

---

## Performance Optimizations

### 1. Redux Optimizations
- **Selectors**: Use `useAppSelector` with specific state slices (avoid full state)
- **Memoization**: Components use `React.memo` where appropriate
- **Normalized State**: Elements stored as array (simple structure)

### 2. Canvas Optimizations
- **Konva Layers**: Separate layer for transformer (reduces re-renders)
- **Event Delegation**: Single event listener per shape type
- **Lazy Loading**: Images loaded on-demand
- **Debounced Updates**: Auto-save debounced to 2 seconds

### 3. Socket.io Optimizations
- **Granular Events**: 9 specific events instead of full state sync
- **Client ID Filtering**: Ignore own updates to prevent loops
- **Reconnection Strategy**: Auto-reconnect with exponential backoff
- **Room-based Broadcasting**: Only users in same design receive updates

### 4. API Optimizations
- **Axios Interceptors**: Centralized error handling
- **Request Timeout**: 10-second timeout prevents hanging requests
- **Debounced Saves**: Prevent API spam on rapid changes

### 5. Bundle Optimizations
- **Vite**: Fast HMR and optimized production builds
- **Tree Shaking**: Lucide icons are tree-shakeable
- **Code Splitting**: React Router lazy loading (not implemented due to small app size)

---

## Testing Strategy

### Manual Testing Performed

#### 1. Canvas Operations
- ✅ Add all element types (text, image, 8 shapes)
- ✅ Move, resize, rotate elements
- ✅ Delete elements
- ✅ Reorder layers via drag-and-drop
- ✅ Rename layers
- ✅ Change styling (fill, stroke, opacity)
- ✅ Undo/redo operations
- ✅ Export to PNG

#### 2. Design Management
- ✅ Create new design
- ✅ Save design
- ✅ Load existing design
- ✅ Rename design
- ✅ Delete design
- ✅ Navigate between designs

#### 3. Real-time Collaboration
- ✅ Open same design in two browser windows
- ✅ Add element in window 1 → appears in window 2
- ✅ Update element in window 2 → updates in window 1
- ✅ Delete element in window 1 → deletes in window 2
- ✅ Undo in window 1 → syncs to window 2
- ✅ Active users count updates correctly

#### 4. Comments
- ✅ Add comment
- ✅ View comments
- ✅ @mention user (autocomplete works)
- ✅ Delete comment
- ✅ Comments persist after reload

#### 5. Error Handling
- ✅ Invalid API responses show toast errors
- ✅ Network errors handled gracefully
- ✅ Socket disconnection shows status
- ✅ Invalid design ID shows error page

### Automated Testing (Not Implemented)

**Unit Tests** (Vitest configured but no tests written):
- Redux reducers
- Utility functions (exportCanvas, shapeFactory)
- Custom hooks (useUndoRedo)
- API clients

**E2E Tests** (Playwright removed):
- Full user flow (create → edit → save → reload)
- Multi-user collaboration
- Comment system

**Why Not Implemented**: Time prioritized for feature completeness over test coverage

---

## AI/Codegen Assistance

### Tools Used
- **GitHub Copilot**: Code completion for repetitive components (DraggableRect, DraggableCircle, etc.)
- **ChatGPT**: Architecture planning, Socket.io event design, conflict resolution strategy
- **Claude**: Documentation writing, TypeScript type definitions

### Percentage of AI-Generated Code
- **~30%**: Boilerplate components (atoms, molecules)
- **~20%**: TypeScript type definitions
- **~10%**: Redux slice setup
- **~5%**: Socket.io event handlers
- **~35%**: Documentation (this file)

**Total AI Assistance**: ~40% of codebase (primarily boilerplate and documentation)

**Human-Written Core Logic**:
- Real-time sync architecture
- Conflict resolution strategy
- History middleware
- Socket middleware
- Canvas export logic
- State management design

---

## Deployment

### Frontend
- **Platform**: Netlify / Vercel
- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_URL`: Backend API URL
  - `VITE_SOCKET_URL`: Socket.io server URL

### Backend
- **Platform**: Railway
- **Database**: MongoDB Atlas
- **Environment Variables**:
  - `MONGODB_URI`: MongoDB connection string
  - `PORT`: Server port (default 5000)
  - `CORS_ORIGIN`: Frontend URL

---

## Future Enhancements

### High Priority
1. **User Authentication**: JWT-based auth with login/signup
2. **Image Upload**: S3/Cloudinary integration for file uploads
3. **Thumbnail Generation**: Server-side canvas rendering for design previews
4. **E2E Tests**: Playwright tests for critical user flows
5. **Unit Tests**: Vitest tests for reducers, utils, hooks

### Medium Priority
6. **Rulers & Guides**: Visual alignment aids
7. **Snapping**: Snap to grid/guides/other elements
8. **Grouping**: Group/ungroup elements
9. **Advanced Text**: Rich text formatting, alignment
10. **Collaborative Cursors**: See other users' mouse positions

### Low Priority
11. **Version History**: Design snapshots and rollback
12. **Export Formats**: SVG, PDF export
13. **Keyboard Shortcuts**: Arrow keys, duplicate, group
14. **Canvas Grid**: Background grid pattern
15. **Presence Indicators**: User avatars and names

---

## Conclusion

This design editor successfully implements all core requirements within the 48-hour time-box:
- ✅ Canvas-based editing with Konva.js
- ✅ Text, images, and 8 shape types
- ✅ Move, resize, rotate transformations
- ✅ Layer management with drag-and-drop
- ✅ Undo/redo (10+ actions)
- ✅ PNG export
- ✅ MongoDB persistence via REST API
- ✅ Real-time multi-user editing with Socket.io
- ✅ Comments with @mentions
- ✅ Design management (create, list, edit, delete)

**Key Technical Achievements**:
1. **Granular Socket Events**: 9 specific events for efficient real-time sync
2. **Middleware Architecture**: Clean separation of concerns (history, sockets)
3. **Type Safety**: Full TypeScript coverage
4. **Performance**: Debounced saves, optimized re-renders
5. **Error Handling**: Structured API errors with user-friendly toasts

**Trade-offs Made**:
- Prioritized feature completeness over test coverage
- Last-Write-Wins conflict resolution (simple but effective)
- No user authentication (prepared for future implementation)
- Manual testing instead of automated E2E tests

The architecture is scalable and ready for future enhancements like authentication, image uploads, and advanced collaboration features.

---

**Built in 48 hours as a technical assignment**
