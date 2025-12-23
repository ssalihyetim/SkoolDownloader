# Skool Video Downloader - Chrome Extension

Chrome extension to detect and download videos from Skool courses.

## Features

✅ **Auto-detect videos** - Automatically finds Wistia and Loom videos on Skool pages
✅ **No login required** - Uses your existing Skool session
✅ **Lightweight** - No heavy dependencies
✅ **Easy to use** - Click extension icon to see videos
✅ **Badge notification** - Shows number of videos found on current page

## Installation

### Method 1: Load Unpacked Extension (Development)

1. Open Chrome and go to `chrome://extensions/`

2. Enable **Developer mode** (toggle in top right)

3. Click **Load unpacked**

4. Select the `extension` folder:
   ```
   /Users/salihyetim/SkoolDownloader/extension
   ```

5. The extension is now installed!

### Method 2: Drag and Drop

1. Open Finder and navigate to:
   ```
   /Users/salihyetim/SkoolDownloader/extension
   ```

2. Open Chrome and go to `chrome://extensions/`

3. Enable **Developer mode**

4. Drag the `extension` folder onto the extensions page

## Usage

1. **Navigate to a Skool course page** with videos

2. **Click the extension icon** in Chrome toolbar
   - Or use the keyboard shortcut (if configured)

3. **The extension will automatically scan** for videos

4. **See detected videos** in the popup:
   - Platform badge (Wistia/Loom)
   - Video ID
   - Action buttons

5. **Actions available:**
   - **Open Video** - Opens the video in a new tab
   - **Copy ID** - Copies video ID to clipboard

## How It Works

### Detection

The extension scans the current page for:
- **Wistia embeds**: `<iframe src="*.wistia.com">` or elements with `wistia_async_*` class
- **Loom embeds**: `<iframe src="*.loom.com">`

### Video Information

When a video is detected, the extension:
1. Extracts the video ID
2. Fetches metadata (title, thumbnail) from the platform's API
3. Displays the information in the popup

### Downloading

To download videos:
1. Click "Open Video" to view the video in a new tab
2. In the video page, right-click and use browser's native "Save video as..." option
3. Or use video download helper extensions

## Supported Platforms

- ✅ Wistia
- ✅ Loom

## Permissions Explained

The extension requests these permissions:

- **activeTab**: To scan the current page for videos
- **downloads**: To trigger downloads (future feature)
- **storage**: To save extension settings
- **Host permissions** (skool.com, wistia.com, loom.com): To access video APIs

## Troubleshooting

### Extension doesn't show videos

1. Make sure you're on a Skool page with videos
2. Refresh the page
3. Click the "Scan for Videos" button again

### Extension icon is grayed out

1. The extension only works on `skool.com` pages
2. Navigate to a Skool course first

### Videos not opening

1. Check if you're logged into Skool
2. The video might be private/restricted
3. Try opening the Skool page directly

## Privacy & Security

- ✅ **No data collection** - Extension doesn't send any data anywhere
- ✅ **No tracking** - Your activity is not monitored
- ✅ **Local only** - All processing happens in your browser
- ✅ **Open source** - You can review all the code

## Legal Notice

⚠️ **Important:**
- This tool is for **personal educational use only**
- Only download content you have **legitimate access to**
- **Do not redistribute** downloaded content
- Respect **copyright** and **terms of service**
- Use **responsibly** and **ethically**

## Development

### File Structure

```
extension/
├── manifest.json       # Extension configuration
├── popup.html         # Extension popup UI
├── popup.js          # Popup logic
├── content.js        # Content script (runs on Skool pages)
├── background.js     # Background service worker
├── icons/           # Extension icons
└── README.md        # This file
```

### Making Changes

1. Edit the files in the `extension/` folder
2. Go to `chrome://extensions/`
3. Click the **Reload** button for this extension
4. Test your changes

### Debugging

- **Popup**: Right-click extension icon → Inspect popup
- **Content script**: Open DevTools on Skool page → Console tab
- **Background**: Go to `chrome://extensions/` → Click "Inspect views: background page"

## Future Enhancements

Planned features:
- [ ] Direct download from popup
- [ ] Batch download multiple videos
- [ ] Download progress tracking
- [ ] Video quality selection
- [ ] Export video list
- [ ] Keyboard shortcuts
- [ ] Dark mode

## Support

For issues or questions:
1. Check the logs: Right-click extension → Inspect → Console
2. Review this README
3. Check browser console on Skool pages

## Credits

Created for personal educational use with Skool courses.
