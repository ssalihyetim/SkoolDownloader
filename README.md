# Skool Video Downloader - Chrome Extension

Chrome extension to detect and download videos from Skool courses (Wistia and Loom).

## Features

- **Auto-detect videos** on Skool pages (Wistia, Loom, native Skool videos)
- **Intelligent file naming** - customizable patterns with course/title/platform variables
- **Settings page** - configure how videos are named
- **Video metadata extraction** - automatic title and course name detection
- **No login required** - uses your existing Skool session
- **Badge notification** showing number of videos found
- **Organized downloads** - create folder structures automatically

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder from this repository
5. The extension is now installed!

## Quick Start Guide

### 1. Navigate to Skool
Go to any Skool course page with videos

### 2. Scan for Videos
Click the extension icon - it will automatically scan for videos

### 3. Configure Settings (Optional)
- Click the **⚙️ Settings** button (appears after scan)
- Or right-click extension icon → "Options"
- Set your naming pattern (default: `{course}/{title}`)

**Naming Pattern Variables:**
- `{course}` - Course name from URL
- `{title}` - Video/lesson title
- `{platform}` - wistia, loom, or skool
- `{id}` - Video ID

**Example Patterns:**
```
{course}/{title}          → my-course/lesson-1-intro.mp4
{title}                   → lesson-1-intro.mp4
{platform}_{title}        → wistia_lesson-1-intro.mp4
downloads/{course}/{title} → downloads/my-course/lesson-1-intro.mp4
```

### 4. Download Videos
- Click **⬇️ Download** on any video
- Chrome will show a "Save As" dialog with the suggested filename
- Choose where to save it
- Done!

## How It Works

1. **Metadata Extraction:** Extension reads course name from URL and lesson title from the page
2. **Pattern Application:** Your naming pattern is applied with the extracted data
3. **Filename Generation:** A clean filename is created (invalid characters removed)
4. **Save Dialog:** Chrome shows the save dialog with suggested path/filename
5. **Your Choice:** You pick the final download location

For detailed instructions, see [USER_GUIDE.md](USER_GUIDE.md)

## Project Structure

```
SkoolDownloader/
├── extension/              # Chrome extension files
│   ├── manifest.json      # Extension configuration
│   ├── popup.html        # Extension popup UI
│   ├── popup.js          # Popup logic
│   ├── content.js        # Content script (runs on Skool pages)
│   ├── background.js     # Background service worker
│   ├── debug.js          # Debug utilities
│   ├── icons/            # Extension icons
│   └── README.md         # Detailed extension documentation
└── README.md             # This file
```

## Legal Notice

This tool is for **personal educational use only**. Only download content you have legitimate access to. Do not redistribute downloaded content. Respect copyright and terms of service.

## License

This project is for educational purposes only. Use responsibly and in accordance with applicable laws and terms of service.
