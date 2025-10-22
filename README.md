# 🌟 Sparky - AI-Powered Personal Memory Organizer# Sparky — AI-Powered Personal Content Organizer



<div align="center">A lightweight personal content memory assistant that captures what you read/watch, adds AI summaries and tags, and makes it easy to find later by keyword, visuals, or even emotion.



![Sparky Logo](packages/extension/icons/icon128.png)## Problem

We all consume a flood of content (articles, videos, posts, PDFs), but later can’t remember where we saw that “one great thing.” Traditional bookmarks/history are noisy and hard to search. Users need a private, structured memory that indexes content with context, emotion, and keywords for fast, intuitive retrieval.

**Capture, organize, and rediscover your digital memories beautifully.**

## Proposed Solution

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)Build a web/mobile experience that automatically captures content interactions, enriches them with AI (summary, keywords/tags, visual/similarity embeddings, sentiment), and lets users search or browse a personal library by text, time, visual similarity, or emotional cues.

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-blue.svg)](packages/extension)

[![Next.js](https://img.shields.io/badge/Next.js-15.5.4-black.svg)](packages/website)## Concept Overview

[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](package.json)- Client side: unobtrusive capture of URLs/titles/snippets/screenshots and quick search (text/image/"feeling").

- AI processing: generate summaries, keywords, visual embeddings, and sentiment tags; organize items in a searchable index.

[Features](#-features) • [Quick Start](#-quick-start) • [Installation](#-installation) • [Documentation](#-documentation) • [Contributing](#-contributing)

## Key Features

</div>1) Automatic Content Capture

- Track activity across sources (browser/apps/PDFs)

---- Store source URL, timestamp, content type/preview



## 📖 Table of Contents2) AI Tagging & Summarization

- Summarize long articles or videos

- [Overview](#-overview)- Tag with topics/keywords

- [Features](#-features)- Assign sentiment/emotional labels

- [Architecture](#-architecture)

- [Quick Start](#-quick-start)3) Advanced Search & Retrieval

- [Installation](#-installation)- Search by keyword/topic/emotion

- [Usage](#-usage)- Visual similarity (reverse image for screenshots)

- [Project Structure](#-project-structure)- Timeline view of first-seen content

- [Technologies](#-technologies)

- [Configuration](#-configuration)4) Personalized Dashboard

- [Development](#-development)- Recent items, trending topics, favorites/bookmarks

- [Building](#-building)- Manual organization (folders/tags)

- [Documentation](#-documentation)- Insights (e.g., most-read topics)

- [Troubleshooting](#-troubleshooting)

- [Contributing](#-contributing)5) Privacy & Control

- [License](#-license)- Local-first indexing option

- Opt-out rules for specific sites/types

---

6) Proposed Stretch Features

## 🎯 Overview- Visual similarity for screenshots

- Mood-based recommendations

**Sparky** is a comprehensive personal memory organizer that combines a powerful Chrome extension with a beautiful Next.js web dashboard. It automatically captures and intelligently organizes your browsing content, making it easy to rediscover your digital memories.- Cross-device sync

- Exportable “memory snapshots” (PDF/visual)

### The Problem

## Hackathon MVP (Target Outcome)

We consume a flood of content daily (articles, videos, posts), but later struggle to recall "that one great thing we read." Traditional bookmarks are noisy and hard to search. We need a private, structured memory system.- Capture: Browser-based capture of URL, title, favicon/thumbnail, timestamp, optional screenshot

- AI: Text summary + keyword tags for pages; basic sentiment

### The Solution- Search: Keyword + tag + date range; simple “feeling” filter

- UI: Minimal dashboard for recent items, detail view, and favorites

Sparky provides an unobtrusive capture system with AI enrichment:- Privacy: Local storage by default; site-level opt-out list

- **Automatic Content Capture** across your browsing

- **AI Summarization** (not duplicate content!)## Tech Notes (initial direction — flexible)

- **Smart Tagging** and categorization- Start with a browser extension + small web dashboard (or a single-page app) storing data locally (IndexedDB/LocalStorage/SQLite)

- **Intuitive Search** by keyword, topic, or emotion- Use an embedding/summarization API or a local model wrapper when available

- **Beautiful Dashboard** to browse your memories- Keep an adapter layer to swap AI providers (e.g., OpenAI, Azure OpenAI, local models)



---## Project To‑Do

- [ ] Repo hygiene: README, LICENSE, basic CI (lint only)

## ✨ Features- [ ] Define data schema (Item, Tags, Embeddings, Sentiment, Source)

- [ ] Storage layer (local-first: IndexedDB/SQLite)

### 🚀 Chrome Extension- [ ] Capture MVP (browser extension or in‑app URL add)

- [ ] Content extraction (title, canonical URL, snippet, image)

#### 📝 Content Capture- [ ] Summarization pipeline (API adapter, batching, retries)

- **Floating Capture Button**: Automatically appears when you select text - just click!- [ ] Keyword tagging (rule-based + model-assisted)

- **Right-Click Menu**: Quick access to capture selected text- [ ] Sentiment/emotion labeling (coarse: positive/neutral/negative + 1–2 emotions)

- **Full Page Capture**: Save entire web pages with one click- [ ] Search API (by keyword, tag, date; basic vector search later)

- **Manual Notes**: Add quick notes linked to current page- [ ] UI: dashboard (recent, favorites), item detail, search results

- **Auto-Capture Mode**: Optionally capture pages automatically (3-second delay)- [ ] Privacy controls (site blacklist, local-only mode)

- [ ] Telemetry/offline handling (basic errors only; no PII)

#### 🤖 AI-Powered Intelligence- [ ] Stretch: visual similarity for screenshots

- **Smart Summaries**: Intelligent text summarization (2-3 key sentences, NOT full content)- [ ] Stretch: mood-based recommendations

- **Auto-Tagging**: Automatic tag generation from content and meta keywords- [ ] Stretch: exportable memory report (PDF)

- **Categorization**: Smart content classification (technology, business, science, etc.)

- **Sentiment Analysis**: Emotional tone detection## Milestones

- **Keyword Extraction**: Important terms highlightedM1 — Scaffolding & storage ready; manual add/search works

- **Importance Scoring**: Content relevance rankingM2 — Automatic capture + summaries + tags

M3 — Dashboard polish + privacy controls

#### 💾 Data ManagementM4 — Stretch features (visual similarity, mood, export)

- **Local Storage**: All data stored securely in Chrome's local storage

- **Clear All Data**: Safely delete all captured content (double confirmation)## Getting Started (placeholder)

- **Statistics**: Track saved items and storage usageImplementation is in progress. Once the initial scaffold lands, this section will include setup and run steps.

- **Browsing History**: Automatic page visit tracking (max 1,000 entries)
- **Screenshot Capture**: Visual snapshots with 50x50 thumbnails

### 🌐 Web Dashboard (Next.js)

#### 🖥️ Beautiful Interface
- **Sky Theme**: Cloud-inspired design with smooth gradients
- **Dark Mode**: Full dark mode support
- **Responsive**: Works on desktop, tablet, and mobile
- **Smooth Animations**: Framer Motion powered transitions
- **Modern UI**: Built with Radix UI and Tailwind CSS

#### 📊 Dashboard Features
- **Memory Cards**: Beautiful visual cards for each captured item
- **AI Summary Display**: Shows condensed summaries (not full content)
- **Tag System**: Filter and browse by tags
- **Search**: Find memories quickly by keyword
- **Analytics**: View capture statistics and trends
- **Folders**: Organize memories (upcoming feature)
- **Favorites**: Mark important captures

#### 🔗 Extension Bridge
- **Real-time Sync**: Direct communication with Chrome extension
- **Live Data**: Access extension data from web dashboard
- **No Backend**: Client-side data access via bridge system

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User's Browser                          │
│                                                             │
│  ┌──────────────────┐         ┌─────────────────────────┐ │
│  │  Chrome Extension │◄───────►│   Next.js Dashboard     │ │
│  │                   │  Bridge │   (localhost:3000)      │ │
│  │  - Content Script │         │   - React Components    │ │
│  │  - Background SW  │         │   - Framer Motion       │ │
│  │  - Popup UI       │         │   - Tailwind CSS        │ │
│  └──────────────────┘         └─────────────────────────┘ │
│           │                              │                  │
│           ▼                              ▼                  │
│  ┌────────────────────────────────────────────────────┐   │
│  │         Chrome Local Storage                       │   │
│  │  - Saved Content    - AI Analysis                 │   │
│  │  - Screenshots      - Browsing History            │   │
│  │  - Thumbnails       - Settings                    │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

**Privacy First**: All data stays in YOUR browser. No external servers or cloud storage.

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** >= 18.0.0
- **npm** >= 9.0.0
- **Google Chrome** (latest version)

### Installation & Setup

```bash
# Clone the repository
git clone https://github.com/SaumyaKhobragade/genathon-atomicity.git
cd genathon-atomicity

# Install all dependencies
npm install
cd packages/website && npm install
cd ../extension # (no install needed for extension)

# Start the website
cd ../website
npm run dev
```

### Load Extension in Chrome

1. Open Chrome: `chrome://extensions/`
2. Enable **Developer mode** (toggle top-right)
3. Click **Load unpacked**
4. Select `packages/extension` folder
5. Extension icon appears in toolbar ✅

### Verify Setup

- Click extension icon → Should show popup with "0 Saved"
- Visit http://localhost:3000 → Should see landing page
- Dashboard should connect to extension automatically

---

## 💡 Usage

### Capturing Content

#### Method 1: Floating Button ⭐ (Easiest!)
1. Visit any webpage
2. **Select text** (more than 5 characters)
3. Purple **"Capture"** button appears automatically in bottom-right
4. Click to capture → Done! ✨

**Speed**: 2 steps, ~1 second

#### Method 2: Extension Popup
1. Click Sparky icon in Chrome toolbar
2. Select text on page (if capturing selection)
3. Click **"Capture Selection"** or **"Capture Full Page"**
4. Success notification appears

#### Method 3: Add Quick Note
1. Click Sparky icon
2. Click **"Add Note"**
3. Type your note
4. Note saved with current page context

### Auto-Capture Mode

Enable hands-free capturing:

1. Click Sparky extension icon
2. Toggle **"Auto-capture pages"** ON
3. Browse normally - pages auto-capture after 3 seconds
4. Only pages with 100+ characters captured

**Configure in `content.js`:**
```javascript
autoCapture = {
  enabled: false,
  delay: 3000,             // Wait time (ms)
  minContentLength: 100    // Minimum length
}
```

### Viewing Your Memories

#### Web Dashboard (Recommended)
1. Visit http://localhost:3000
2. Browse captured memories as beautiful cards
3. Click any card for full details
4. Use search or filter by tags

**Features:**
- AI summaries (not full content!)
- Tags and categories
- Screenshots and thumbnails
- Timestamp and source URL

#### Extension Popup
- Quick stats: saved items count
- Storage usage in MB
- Quick capture buttons

### Managing Data

#### Clear All Data
1. Click extension icon
2. Scroll to **"Clear All Data"** button (red)
3. **Confirm twice** (safety measure)
4. All data permanently deleted

**What gets deleted:**
- All saved content and notes
- Browsing history
- Screenshots and thumbnails
- AI analysis data
- All metadata

⚠️ **Warning**: This action cannot be undone!

---

## 📁 Project Structure

```
genathon-atomicity/
├── packages/
│   ├── extension/                    # Chrome Extension
│   │   ├── manifest.json             # Extension manifest (V3)
│   │   ├── background.js             # Service worker (AI, data)
│   │   ├── content.js                # Content script (capture)
│   │   ├── popup.html/js/css         # Extension popup UI
│   │   ├── bridge.js                 # Extension ↔ Website bridge
│   │   ├── icons/                    # Extension icons
│   │   └── *.md                      # Feature docs
│   │
│   ├── website/                      # Next.js Dashboard
│   │   ├── app/                      # Next.js App Router
│   │   │   ├── (auth)/               # Auth pages
│   │   │   ├── (user)/dashboard/    # Dashboard
│   │   │   ├── components/           # React components
│   │   │   ├── globals.css           # Global styles
│   │   │   ├── layout.tsx            # Root layout
│   │   │   └── page.tsx              # Landing page
│   │   ├── components/ui/            # UI components
│   │   ├── hooks/                    # Custom hooks
│   │   ├── lib/                      # Utilities
│   │   ├── public/                   # Static assets
│   │   └── package.json              # Dependencies
│   │
│   └── shared/                       # Shared code
│
├── package.json                      # Root workspace
├── README.md                         # This file
└── LICENSE                           # MIT License
```

---

## 🛠️ Technologies

### Chrome Extension Stack

| Technology | Purpose |
|------------|---------|
| Manifest V3 | Latest Chrome extension standard |
| JavaScript ES6+ | Core extension logic |
| Chrome Storage API | Local data persistence |
| Chrome Tabs API | Tab management |
| Service Workers | Background processing |

### Website Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 15.5.4 | React framework |
| React | 19.1.0 | UI library |
| TypeScript | Latest | Type safety |
| Tailwind CSS | 4.x | Styling |
| Framer Motion | 12.23.23 | Animations |
| Radix UI | Latest | Accessible components |
| Zustand | 5.0.8 | State management |
| Lucide React | 0.545.0 | Icons |

---

## ⚙️ Configuration

### Extension Settings

**Manifest** (`packages/extension/manifest.json`):
```json
{
  "permissions": [
    "storage",          // Local storage
    "tabs",             // Tab access
    "activeTab",        // Current tab
    "scripting",        // Script injection
    "unlimitedStorage", // Large data
    "alarms"            // Scheduled tasks
  ]
}
```

**Auto-Capture** (`content.js`):
```javascript
autoCapture = {
  enabled: false,         // Toggle
  delay: 3000,           // Delay (ms)
  minContentLength: 100  // Min length
}
```

**Floating Button Position** (`content.js`):
```javascript
{
  bottom: '30px',  // From bottom
  right: '30px'    // From right
}
```

---

## 👨‍💻 Development

### Start Development

**All services:**
```bash
npm run dev
```

**Website only:**
```bash
cd packages/website
npm run dev
# Visit http://localhost:3000
```

**Extension only:**
```bash
# Load in Chrome at chrome://extensions/
# Changes require manual reload
```

### Development Workflow

1. Make code changes
2. **Extension**: Reload in `chrome://extensions/`
3. **Website**: Auto-reloads via HMR
4. Test thoroughly
5. Commit changes

### Useful Commands

```bash
# Install all dependencies
npm run install:all

# Clean builds
npm run clean

# Lint code
npm run lint

# Build extension icons
npm run extension:build-icons

# Create extension ZIP
npm run extension:zip
```

---

## 🏗️ Building

### Extension (Production Ready)

Extension files are production-ready as-is. To create ZIP:

```bash
cd packages/extension
npm run extension:zip
# Creates browsing-tracker-extension.zip
```

### Website (Production Build)

```bash
cd packages/website
npm run build
npm run start
```

---

## 📚 Documentation

Detailed feature documentation:

- **[AUTO_CAPTURE_GUIDE.md](packages/extension/AUTO_CAPTURE_GUIDE.md)** - Automatic page capture
- **[CLEAR_DATA_FEATURE.md](packages/extension/CLEAR_DATA_FEATURE.md)** - Clear all data
- **[FLOATING_BUTTON_FEATURE.md](packages/extension/FLOATING_BUTTON_FEATURE.md)** - Floating capture button
- **[SUMMARY_FIX.md](packages/extension/SUMMARY_FIX.md)** - AI summary generation

---

## 🐛 Troubleshooting

### Extension Not Loading?
1. Enable Developer mode in `chrome://extensions/`
2. Check manifest.json for errors
3. Reload extension
4. Check console for errors

### Floating Button Not Appearing?
1. Select more than 5 characters
2. Avoid chrome:// pages
3. Reload extension
4. Check console

### Dashboard Not Showing Data?
1. Verify extension is loaded
2. Capture some data first
3. Hard refresh (Ctrl+F5)
4. Check console for errors
5. Verify on localhost:3000

### Bridge Not Connecting?
1. Must be on `localhost:3000`
2. Reload extension
3. Check manifest permissions
4. Look for bridge messages in console

### Summary Same as Content?
**Fixed!** Reload extension to get new summary algorithm.

---

## 🤝 Contributing

Contributions welcome! Here's how:

### 1. Fork & Clone

```bash
git clone https://github.com/YOUR_USERNAME/genathon-atomicity.git
cd genathon-atomicity
```

### 2. Create Branch

```bash
git checkout -b feature/your-feature-name
```

### 3. Make Changes

- Follow existing code style
- Add comments
- Test thoroughly

### 4. Commit

```bash
git commit -m "feat: add amazing feature"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation
- `style:` - Formatting
- `refactor:` - Code restructuring
- `test:` - Tests
- `chore:` - Maintenance

### 5. Push & PR

```bash
git push origin feature/your-feature-name
```

Create Pull Request with description.

---

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 📞 Contact

**Maintainer**: [Saumya Khobragade](https://github.com/SaumyaKhobragade)

**Repository**: [genathon-atomicity](https://github.com/SaumyaKhobragade/genathon-atomicity)

**Issues**: [GitHub Issues](https://github.com/SaumyaKhobragade/genathon-atomicity/issues)

---

## 🙏 Acknowledgments

- Chrome Extensions Team
- Next.js Team
- Shadcn/ui
- Radix UI
- Framer Motion
- Tailwind CSS

---

## 🌟 Key Highlights

✅ **Privacy-First**: All data stored locally in your browser
✅ **AI-Powered**: Smart summaries, tags, and categorization
✅ **Beautiful UI**: Modern design with smooth animations
✅ **Easy Capture**: Floating button makes it effortless
✅ **Fast Search**: Find your memories instantly
✅ **Open Source**: Free and customizable

---

<div align="center">

**Made with ❤️ by Saumya Khobragade**

**Capture your memories, rediscover your journey** ✨

[⬆ Back to Top](#-sparky---ai-powered-personal-memory-organizer)

</div>
