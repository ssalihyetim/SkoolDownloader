# Chrome Download Settings Guide

## Issue: Videos Download Automatically Without Asking Where to Save

If videos are downloading automatically to your default Downloads folder without showing a save dialog, you need to enable Chrome's "Ask where to save each file" setting.

## Solution: Enable "Ask Where to Save" in Chrome

### Method 1: Quick Settings (Recommended)

1. **Download any file** (or try downloading a video from the extension)
2. Look at the **bottom of Chrome** for the download bar
3. Click the **three dots (⋮)** next to the downloaded file
4. Select **"Always ask where to save files"**
5. ✅ Done! Chrome will now ask you every time

### Method 2: Chrome Settings Page

1. Open Chrome Settings
   - Click the **three dots (⋮)** in the top-right corner
   - Select **"Settings"**
   - Or go to: `chrome://settings/`

2. Navigate to Downloads
   - Scroll down and click **"Downloads"**
   - Or go directly to: `chrome://settings/downloads`

3. Enable the setting
   - Find **"Ask where to save each file before downloading"**
   - **Toggle it ON** (switch should be blue)

4. ✅ Done! Try downloading a video again

## What This Does

When this setting is **ON**:
- Chrome shows a save dialog for every download
- You can choose the folder location
- You can rename the file before saving
- The extension's suggested filename will appear in the dialog

When this setting is **OFF**:
- Chrome downloads directly to your default Downloads folder
- No dialog is shown
- You cannot change the location or filename before download
- The extension's filename will still be used, but you can't change it

## Recommended Setup for This Extension

For the best experience with Skool Video Downloader:

1. **Enable "Ask where to save each file before downloading"** ✅
2. Set your desired default Downloads folder (optional)
3. Use the extension's naming pattern in Settings to organize files

This way, every video download will show a dialog with:
- The smart filename from your pattern (e.g., `course-name/lesson-title.mp4`)
- Option to navigate to any folder
- Option to change the filename if needed

## Checking Your Current Setting

To check if the setting is enabled:

1. Try downloading any video with the extension
2. Watch what happens:
   - **Dialog appears** → Setting is ON ✅
   - **Downloads immediately** → Setting is OFF ❌

If the setting is OFF, follow the steps above to enable it.

## Additional Tips

- You can change this setting at any time
- The setting applies to ALL downloads in Chrome, not just this extension
- If you prefer automatic downloads for some files, you can use keyboard shortcuts:
  - Regular click = Show dialog (if setting is ON)
  - Alt+Click / Option+Click = Save to default location (bypass dialog)

## Still Having Issues?

If the save dialog still doesn't appear after enabling the setting:

1. **Reload the extension:**
   - Go to `chrome://extensions/`
   - Find "Skool Video Downloader"
   - Click the reload icon (🔄)

2. **Restart Chrome** completely

3. **Check the console for errors:**
   - Open Developer Tools (F12)
   - Click the extension icon and try downloading
   - Look for any error messages in the Console tab

4. **Try a different video:**
   - Some videos might have download restrictions
   - Try both Skool native videos and Wistia videos

If you're still having issues, check the browser console for specific error messages that can help debug the problem.
