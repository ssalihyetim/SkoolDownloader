# Skool Video Downloader - Chrome Extension

Chrome extension to detect and download videos from Skool courses (Wistia and Loom).

## Features

- Auto-detect videos on Skool pages
- No login required - uses your existing Skool session
- Lightweight and easy to use
- Badge notification showing number of videos found
- Support for Wistia and Loom platforms

## Installation

1. Open Chrome and go to `chrome://extensions/`
2. Enable **Developer mode** (toggle in top right)
3. Click **Load unpacked**
4. Select the `extension` folder from this repository
5. The extension is now installed!

## Usage

1. Navigate to a Skool course page with videos
2. Click the extension icon in Chrome toolbar
3. The extension will automatically scan for videos
4. See detected videos with options to open or copy video IDs

For detailed instructions, see [extension/README.md](extension/README.md)

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
