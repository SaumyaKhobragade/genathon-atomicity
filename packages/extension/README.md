# Sparky - Chrome Extension

A modern Chrome extension that captures and stores your browsing data, selected text, and page content with a beautiful React/TypeScript UI and seamless dashboard integration.

## Features

### 🎯 Core Functionality

- **Smart Browsing History Tracking**: Automatically tracks visited pages, time spent, and scroll depth
- **Text Selection Capture**: Right-click to save any selected text from any webpage
- **Full Page Capture**: Save entire web pages with metadata
- **Context Menu Integration**: Quick access to save selections, pages, and links
- **Visual Feedback**: Beautiful notifications when content is saved

### 🎨 Modern UI

- **React + TypeScript**: Built with modern web technologies
- **Tailwind CSS**: Clean, responsive design
- **Dark Mode Support**: Auto, light, and dark themes
- **Settings Page**: Comprehensive extension configuration

### 📊 Dashboard Integration

- **Data Export/Import**: JSON-based data portability
- **LocalStorage Sync**: Seamless integration with Next.js dashboard
- **Real-time Stats**: Track storage usage and item counts

### 🔒 Privacy & Control

- **Local Storage Only**: All data stored locally in Chrome storage
- **Domain Exclusions**: Exclude specific domains from tracking
- **Data Management**: Clear, export, or import your data anytime

## Project Structure

```
packages/extension/
├── src/
│   ├── background/
│   │   └── index.ts          # Background service worker
│   ├── content/
│   │   └── index.ts          # Content script for page interaction
│   ├── pages/
│   │   ├── Settings.tsx      # React settings page
│   │   └── settings-entry.tsx
│   ├── types/
│   │   └── index.ts          # TypeScript type definitions
│   ├── utils/
│   │   ├── storage.ts        # Storage utility functions
│   │   └── dashboard-bridge.ts # Dashboard integration
│   └── styles/
│       └── settings.css      # Tailwind CSS styles
├── icons/                    # Extension icons
├── manifest.json             # Extension manifest v3
├── popup.html                # Popup UI
├── settings.html             # Settings page HTML
├── vite.config.ts            # Vite build configuration
├── tsconfig.json             # TypeScript configuration
├── tailwind.config.js        # Tailwind CSS configuration
└── package.json              # Dependencies
```

## Installation & Setup

### 1. Install Dependencies

```bash
cd packages/extension
npm install
```

### 2. Build the Extension

```bash
npm run build
```

This will create a `dist/` folder with the compiled extension.

### 3. Load in Chrome

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `packages/extension` folder (NOT the dist folder)

### 4. Development Mode

For development with hot reload:

```bash
npm run dev
```

## Usage

### Capturing Content

#### 1. **Text Selection**

- Select any text on a webpage
- Right-click → "Save selected text to Sparky"
- Or use the popup button "Capture Selection"

#### 2. **Full Page**

- Right-click anywhere → "Save this page to Sparky"
- Or click "Capture Full Page" in the popup

#### 3. **Links**

- Right-click on any link → "Save link to Sparky"

#### 4. **Manual Notes**

- Click the extension icon
- Click "Add Note"
- Enter your note

### Settings Configuration

1. Click the extension icon
2. Click the settings icon (⚙️) or right-click extension icon → "Options"
3. Configure:
   - **Theme**: Light, Dark, or Auto
   - **Analytics**: Enable/disable browsing history tracking
   - **Screenshots**: Enable/disable screenshot capture
   - **Max History**: Set maximum history entries (100-10,000)
   - **Excluded Domains**: Add domains to exclude from tracking

### Dashboard Integration

#### Method 1: Import/Export

1. **Export from Extension**:

   - Go to Settings → Data Management → Export Data
   - Downloads a JSON file with all your data

2. **Import to Dashboard**:
   - In your Next.js dashboard, use the `useExtensionData` hook
   - Upload the exported JSON file
   - Data will be synced to localStorage

#### Method 2: Direct Integration

```typescript
import { useExtensionData } from "@/app/hooks/useExtensionData";

function Dashboard() {
  const {
    savedContent,
    browsingHistory,
    lastSync,
    importData,
    exportData,
    deleteContent,
    updateContent,
  } = useExtensionData();

  // Use the data in your dashboard
  return (
    <div>
      {savedContent.map((item) => (
        <div key={item.id}>{item.title}</div>
      ))}
    </div>
  );
}
```

## Data Storage

### Stored Data Types

1. **Saved Content**:

   - Selected text snippets
   - Full page captures
   - Manual notes
   - Bookmarked links
   - With metadata: tags, category, timestamp

2. **Browsing History**:

   - URL, title, domain
   - Visit time and duration
   - Scroll depth
   - Auto-categorization

3. **Settings**:
   - User preferences
   - Theme, analytics flags
   - Excluded domains

### Storage Structure

```typescript
{
  savedContent: SavedContent[],
  browsingHistory: BrowsingData[],
  settings: ExtensionSettings,
  folders: Folder[],
  screenshots: { [id: string]: string },
  storageStats: StorageStats
}
```

## TypeScript Types

All types are fully defined in `src/types/index.ts`:

- `SavedContent`: Captured content items
- `BrowsingData`: Browsing history entries
- `ExtensionSettings`: User settings
- `StorageStats`: Storage usage statistics
- `ExportData`: Data export format

## Permissions Explained

- **storage**: Store data locally
- **tabs**: Access tab information for tracking
- **activeTab**: Capture content from active tab
- **scripting**: Inject content scripts
- **unlimitedStorage**: Store large amounts of data
- **contextMenus**: Add right-click menu options
- **notifications**: Show save confirmations
- **alarms**: Periodic data syncing and cleanup

## Development

### Tech Stack

- **TypeScript**: Type-safe code
- **React 18**: Modern UI components
- **Vite**: Fast build tool
- **Tailwind CSS**: Utility-first styling
- **Lucide React**: Beautiful icons

### Building for Production

```bash
npm run build
```

### Code Quality

The extension uses:

- TypeScript for type safety
- ESLint for code linting
- Modular architecture for maintainability

## Troubleshooting

### Extension Not Loading

1. Make sure you've run `npm run build`
2. Check that the `dist/` folder exists
3. Reload the extension in Chrome

### Data Not Syncing

1. Check browser console for errors
2. Verify permissions are granted
3. Try exporting and re-importing data

### Settings Not Saving

1. Open Chrome DevTools → Application → Storage
2. Check chrome.storage.local for data
3. Clear and reset settings

## Dashboard Integration Details

### Using the Hook

```typescript
const {
  savedContent, // Array of saved items
  browsingHistory, // Array of browsing history
  lastSync, // Last sync timestamp
  isLoading, // Loading state
  importData, // Function to import JSON file
  exportData, // Function to export data
  clearData, // Function to clear all data
  deleteContent, // Function to delete specific item
  updateContent, // Function to update item
  refresh, // Function to reload data
} = useExtensionData();
```

### Import Component Example

```typescript
function ImportButton() {
  const { importData } = useExtensionData();

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const success = await importData(file);
      if (success) {
        alert("Data imported successfully!");
      }
    }
  };

  return <input type="file" accept=".json" onChange={handleImport} />;
}
```

## Future Enhancements

- [ ] Cloud sync support
- [ ] AI-powered categorization
- [ ] Full-text search
- [ ] Chrome sync storage option
- [ ] Mobile companion app
- [ ] Advanced analytics dashboard
- [ ] Collaborative features

## License

MIT

## Support

For issues, feature requests, or questions, please open an issue on GitHub.

---

Built with ❤️ using React, TypeScript, and Tailwind CSS
