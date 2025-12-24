// Popup script
const extractBtn = document.getElementById('extractBtn');
const statusDiv = document.getElementById('status');
const videoListDiv = document.getElementById('videoList');

let currentVideos = [];

// Extract videos from current tab
async function extractVideos() {
  extractBtn.disabled = true;
  extractBtn.textContent = '🔄 Scanning...';
  statusDiv.innerHTML = '<div class="spinner"></div><p>Scanning page for videos...</p>';
  videoListDiv.style.display = 'none';

  try {
    // Get current tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

    // Check if we're on Skool
    if (!tab.url.includes('skool.com')) {
      statusDiv.innerHTML = '<div class="alert alert-warning">⚠️ Please navigate to a Skool page first</div>';
      extractBtn.disabled = false;
      extractBtn.textContent = '🔍 Scan for Videos';
      return;
    }

    // Send message to content script
    const response = await chrome.tabs.sendMessage(tab.id, { action: 'extractVideos' });

    if (response && response.videos && response.videos.length > 0) {
      currentVideos = response.videos;
      displayVideos(response.videos);
    } else {
      statusDiv.innerHTML = '<div class="alert alert-info">ℹ️ No videos found on this page</div>';
      videoListDiv.style.display = 'none';
    }
  } catch (error) {
    console.error('Error extracting videos:', error);
    statusDiv.innerHTML = `<div class="alert alert-warning">⚠️ Error: ${error.message}<br><br>Make sure you're on a Skool page with videos.</div>`;
  } finally {
    extractBtn.disabled = false;
    extractBtn.textContent = '🔍 Scan for Videos';
  }
}

// Generate filename from video metadata
async function generateFilename(video) {
  const settings = await chrome.storage.sync.get({
    namingPattern: '{course}/{title}',
    downloadPath: ''
  });

  // Clean strings for filename
  const clean = (str) => str.replace(/[<>:"/\\|?*]/g, '-').trim();

  const courseName = clean(video.courseName || 'skool-course');
  const title = clean(video.title || `${video.platform}_${video.id}`);
  const platform = video.platform.toLowerCase();
  const id = video.id;

  let filename = settings.namingPattern
    .replace('{course}', courseName)
    .replace('{title}', title)
    .replace('{platform}', platform)
    .replace('{id}', id);

  // Add extension
  filename += '.mp4';

  return filename;
}

// Check if user has been shown the Chrome settings tip
async function checkAndShowChromeTip() {
  const { shownChromeTip } = await chrome.storage.local.get({ shownChromeTip: false });

  if (!shownChromeTip) {
    return `
      <div class="alert alert-info" style="font-size: 12px; margin-bottom: 10px; position: relative;">
        <button id="dismissTip" style="position: absolute; right: 8px; top: 8px; border: none; background: none; cursor: pointer; font-size: 16px; color: #666;">×</button>
        <div style="margin-right: 20px;">
          💡 <strong>Tip:</strong> To choose where to save videos, enable
          <a href="chrome://settings/downloads" target="_blank" style="color: #1976d2; text-decoration: underline;">
            "Ask where to save"
          </a>
          in Chrome settings.
        </div>
      </div>
    `;
  }
  return '';
}

// Display videos in the popup
async function displayVideos(videos) {
  statusDiv.style.display = 'none';
  videoListDiv.style.display = 'block';

  const chromeTip = await checkAndShowChromeTip();

  videoListDiv.innerHTML = `
    <div class="alert alert-success">
      ✅ Found ${videos.length} video${videos.length > 1 ? 's' : ''}
    </div>
    ${chromeTip}
    <div style="text-align: right; margin-bottom: 10px;">
      <button id="settingsBtn" class="btn btn-secondary" style="font-size: 12px; padding: 4px 8px;">
        ⚙️ Settings
      </button>
    </div>
  `;

  videos.forEach((video, index) => {
    const videoItem = document.createElement('div');
    videoItem.className = 'video-item';

    const platformClass = `platform-${video.platform.toLowerCase()}`;

    const isM3u8 = video.isM3u8 || video.downloadUrl?.includes('.m3u8');

    // Display video title if available
    const titleDisplay = video.title ? `<div class="video-title">${video.title}</div>` : '';

    videoItem.innerHTML = `
      <div class="video-header">
        <span class="platform-badge ${platformClass}">${video.platform}</span>
        <span class="video-id">${video.type || video.id}</span>
      </div>
      ${titleDisplay}
      ${isM3u8 ? `
        <div style="font-size: 11px; color: #666; margin-bottom: 8px;">
          🎞️ HLS Stream (m3u8) - Use ffmpeg to download
        </div>
      ` : ''}
      <div class="video-actions">
        <button class="btn btn-primary" data-index="${index}" data-action="download">
          ${isM3u8 ? '📋 Copy URL' : '⬇️ Download'}
        </button>
        <button class="btn btn-secondary" data-index="${index}" data-action="open">
          🎬 Open
        </button>
      </div>
    `;

    videoListDiv.appendChild(videoItem);
  });

  // Add settings button listener
  document.getElementById('settingsBtn')?.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });

  // Add dismiss tip listener
  document.getElementById('dismissTip')?.addEventListener('click', async () => {
    await chrome.storage.local.set({ shownChromeTip: true });
    document.querySelector('.alert-info')?.remove();
  });

  // Add event listeners
  document.querySelectorAll('[data-action="download"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      const video = currentVideos[index];

      e.target.disabled = true;
      e.target.textContent = '⏳ Fetching...';

      try {
        const isM3u8 = video.isM3u8 || video.downloadUrl?.includes('.m3u8');

        // Check if it's an m3u8 stream
        if (isM3u8) {
          // Copy URL and show instructions
          await navigator.clipboard.writeText(video.downloadUrl);
          e.target.textContent = '✅ Copied!';

          // Show instructions in a better way
          const instructions = `
M3U8 URL kopyalandı! İndirmek için:

Terminal'de şu komutu çalıştırın:

ffmpeg -headers "Referer: https://skool.com/" -i "${video.downloadUrl}" -c copy skool_video.mp4

Veya daha basit:
1. Extension'daki "Open" butonuna tıklayın
2. Tarayıcının Developer Tools'unu açın (F12)
3. Network tab → "m3u8" filtresi
4. Videoyu oynatın
5. URL'i kopyalayın ve yukarıdaki komutu kullanın
          `.trim();

          alert(instructions);

          setTimeout(() => {
            e.target.disabled = false;
            e.target.textContent = '📋 Copy URL';
          }, 3000);

          return;
        }

        // Check if video has direct download URL (Skool native MP4)
        if (video.downloadUrl && !isM3u8) {
          // Generate proper filename
          const filename = await generateFilename(video);

          console.log('Attempting download:', { url: video.downloadUrl, filename });

          // Direct download URL available
          chrome.downloads.download({
            url: video.downloadUrl,
            filename: filename,
            saveAs: true
          }, (downloadId) => {
            if (chrome.runtime.lastError) {
              console.error('Download error:', chrome.runtime.lastError);
              alert(`Download failed: ${chrome.runtime.lastError.message}\n\nTrying alternative method...`);
              // Fallback: open in new tab
              chrome.tabs.create({ url: video.downloadUrl });
            } else {
              console.log('Download started:', downloadId);
            }
          });
          e.target.textContent = '✅ Started!';
        } else {
          // Fetch video info to get download URL
          const response = await chrome.runtime.sendMessage({
            action: 'getVideoInfo',
            platform: video.platform,
            id: video.id
          });

          if (response && response.downloadUrl) {
            // Merge response data with video data
            const mergedVideo = { ...video, ...response };
            const filename = await generateFilename(mergedVideo);

            console.log('Attempting download from API:', { url: response.downloadUrl, filename });

            // Direct download URL available
            chrome.downloads.download({
              url: response.downloadUrl,
              filename: filename,
              saveAs: true
            }, (downloadId) => {
              if (chrome.runtime.lastError) {
                console.error('Download error:', chrome.runtime.lastError);
                alert(`Download failed: ${chrome.runtime.lastError.message}\n\nOpening video page instead...`);
                // Fallback: open video page
                const url = video.embedUrl || video.shareUrl || video.url;
                chrome.tabs.create({ url });
              } else {
                console.log('Download started:', downloadId);
              }
            });
            e.target.textContent = '✅ Started!';
          } else {
            // No direct URL available - need manual download
            const url = video.embedUrl || video.shareUrl || video.url;

            e.target.textContent = '📺 Opened';

            // Show platform-specific instructions
            let instructions = '';
            if (video.platform === 'Wistia') {
              instructions = `Wistia video opened in new tab.\n\nTo download:\n1. Play the video\n2. Right-click on the video player\n3. Select "Save video as..."\n\nOr use browser DevTools to find the video URL.`;
            } else if (video.platform === 'Loom') {
              instructions = `Loom video opened in new tab.\n\nTo download:\n1. Click the "..." menu on the video\n2. Select "Download"\n\nNote: You may need to be logged into Loom.`;
            } else {
              instructions = `Video opened in new tab.\n\nTo download:\n1. Right-click on the video\n2. Select "Save video as..."\n\nOr check browser DevTools Network tab.`;
            }

            alert(instructions);
            chrome.tabs.create({ url });
          }
        }

        setTimeout(() => {
          e.target.disabled = false;
          e.target.textContent = '⬇️ Download';
        }, 3000);

      } catch (error) {
        console.error('Download error:', error);
        e.target.textContent = '❌ Error';
        setTimeout(() => {
          e.target.disabled = false;
          e.target.textContent = '⬇️ Download';
        }, 3000);
      }
    });
  });

  document.querySelectorAll('[data-action="open"]').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const index = parseInt(e.target.dataset.index);
      const video = currentVideos[index];
      const url = video.embedUrl || video.shareUrl || video.url;

      chrome.runtime.sendMessage({
        action: 'openTab',
        url: url
      });
    });
  });
}

// Event listeners
extractBtn.addEventListener('click', extractVideos);

// Auto-extract on popup open if on Skool
chrome.tabs.query({ active: true, currentWindow: true }, async ([tab]) => {
  if (tab.url && tab.url.includes('skool.com')) {
    // Small delay to ensure content script is loaded
    setTimeout(() => {
      extractVideos();
    }, 500);
  }
});
