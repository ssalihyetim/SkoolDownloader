# User Guide: Video Naming and Download Location

## How to Use the Extension

### Step 1: Navigate to a Skool Page
1. Go to any Skool course page with videos
2. Click the extension icon in your browser toolbar

### Step 2: Scan for Videos
1. The extension will automatically scan when opened
2. Or click the "🔍 Scan for Videos" button
3. You'll see a list of detected videos

### Step 3: Configure Settings (Optional)
1. After videos are found, click the **⚙️ Settings** button (top-right)
2. Or right-click the extension icon → select "Options"

### Step 4: Set Your Naming Pattern
In the Settings page, you can customize how videos are named:

**Default Pattern:** `{course}/{title}`

**Available Variables:**
- `{course}` - Course name (extracted from URL)
- `{title}` - Video/lesson title (from page heading)
- `{platform}` - Platform name (wistia, loom, skool)
- `{id}` - Unique video ID

**Example Patterns:**

| Pattern | Result |
|---------|--------|
| `{course}/{title}` | `my-course/lesson-1-intro.mp4` |
| `{title}` | `lesson-1-intro.mp4` |
| `{platform}_{title}` | `wistia_lesson-1-intro.mp4` |
| `{course}/{platform}/{title}` | `my-course/wistia/lesson-1-intro.mp4` |
| `downloads/{course}_{id}` | `downloads/my-course_abc123.mp4` |

### Step 5: Download Videos
1. Click the **⬇️ Download** button on any video
2. Chrome will show a **"Save As" dialog**
3. The filename will be pre-filled based on your pattern
4. **Choose where to save:** You can navigate to any folder on your computer
5. Click "Save"

## Important Notes

### About Download Locations
- Chrome **always** shows a save dialog (this is by design for security)
- The extension suggests the filename based on your pattern
- **You choose the final location** every time
- Use `/` in patterns to create folder structure (e.g., `{course}/{title}`)
- The suggested path will include folders, but you can override it

### About Video Titles
- Video titles are automatically extracted from:
  - Page headings (`<h1>` tags)
  - Page title
  - Wistia API (for Wistia videos)
- If no title is found, it uses the video ID

### Folder Organization
If your pattern is `{course}/{title}`:
1. Extension suggests: `my-course/lesson-1.mp4`
2. Chrome shows save dialog with this path
3. You can keep it or choose a different location
4. The folders will be created automatically if they don't exist

## Troubleshooting

### Can't Find Settings Button
- Make sure you've scanned for videos first
- The Settings button appears after videos are detected
- Alternative: Right-click extension icon → "Options"

### Filename Doesn't Match Pattern
- Make sure you saved settings (click "💾 Save Settings")
- Reload the extension page
- Scan for videos again

### Want to Change Download Location
- Chrome will ask you every time where to save
- You cannot set a permanent default folder (Chrome limitation)
- But you can use patterns with folders to organize files

## Examples in Practice

### Example 1: Organized by Course
**Pattern:** `{course}/{title}`

When downloading from "JavaScript Masterclass":
- Suggested: `javascript-masterclass/lesson-1-variables.mp4`
- You choose: `/Users/yourname/Downloads/` (or any folder)
- Final result: `/Users/yourname/Downloads/javascript-masterclass/lesson-1-variables.mp4`

### Example 2: Simple Flat Structure
**Pattern:** `{title}`

- Suggested: `lesson-1-variables.mp4`
- You choose where to save it
- No subfolders created

### Example 3: Platform-Based Organization
**Pattern:** `{platform}/{course}_{title}`

- Suggested: `wistia/javascript-masterclass_lesson-1-variables.mp4`
- Creates a "wistia" folder
- Includes course name in filename

## Quick Tips

1. **Test Your Pattern:** Try different patterns in settings to see what works for you
2. **Use Folders:** Include `/` to organize downloads automatically
3. **Keep It Simple:** If unsure, use default `{course}/{title}`
4. **Invalid Characters:** The extension automatically replaces `< > : " / \ | ? *` with `-`
5. **Settings Sync:** Your settings sync across all your devices with the same Chrome account

## Need Help?

If you're still having trouble:
1. Check that the extension is up to date
2. Try reloading the extension (chrome://extensions → reload button)
3. Open browser console (F12) to see any error messages
