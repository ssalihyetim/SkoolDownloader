// Background service worker
console.log('Skool Video Downloader: Background script loaded');

// Generate filename from video metadata
function generateFilename(video, settings) {
  let filename = '';

  // Use naming pattern from settings
  const pattern = settings?.namingPattern || '{course}/{title}';

  // Clean strings for filename
  const clean = (str) => str.replace(/[<>:"/\\|?*]/g, '-').trim();

  const courseName = clean(video.courseName || 'skool-course');
  const title = clean(video.title || `${video.platform}_${video.id}`);
  const platform = video.platform.toLowerCase();
  const id = video.id;

  filename = pattern
    .replace('{course}', courseName)
    .replace('{title}', title)
    .replace('{platform}', platform)
    .replace('{id}', id);

  // Add extension
  filename += '.mp4';

  return filename;
}

// Fetch video info from Wistia
async function getWistiaVideoInfo(videoId) {
  try {
    // Try oEmbed API
    const oembedUrl = `https://fast.wistia.com/oembed?url=https://fast.wistia.net/embed/iframe/${videoId}`;
    const response = await fetch(oembedUrl);

    if (!response.ok) {
      throw new Error('oEmbed API failed');
    }

    const data = await response.json();

    return {
      id: videoId,
      title: data.title || `Wistia Video ${videoId}`,
      thumbnail: data.thumbnail_url,
      duration: data.duration,
      platform: 'Wistia',
      // Wistia videos need to be accessed via their embed page
      downloadUrl: null,
      embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
      needsExtraction: true
    };
  } catch (error) {
    console.error('Failed to fetch Wistia info:', error);
    return {
      id: videoId,
      title: `Wistia Video ${videoId}`,
      platform: 'Wistia',
      embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
      needsExtraction: true
    };
  }
}

// Fetch video info from Loom
async function getLoomVideoInfo(videoId) {
  try {
    const shareUrl = `https://www.loom.com/share/${videoId}`;

    return {
      id: videoId,
      title: `Loom Video ${videoId}`,
      platform: 'Loom',
      shareUrl: shareUrl,
      downloadUrl: null,
      needsExtraction: true
    };
  } catch (error) {
    console.error('Failed to fetch Loom info:', error);
    return {
      id: videoId,
      title: `Loom Video ${videoId}`,
      platform: 'Loom',
      shareUrl: `https://www.loom.com/share/${videoId}`,
      needsExtraction: true
    };
  }
}

// Handle messages from content script and popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'getVideoInfo') {
    const { platform, id } = request;

    if (platform === 'Wistia') {
      getWistiaVideoInfo(id).then(sendResponse);
    } else if (platform === 'Loom') {
      getLoomVideoInfo(id).then(sendResponse);
    }

    return true; // Keep channel open for async response
  }

  if (request.action === 'downloadVideo') {
    const { url, filename } = request;

    chrome.downloads.download({
      url: url,
      filename: filename,
      saveAs: true
    }, (downloadId) => {
      if (chrome.runtime.lastError) {
        sendResponse({ success: false, error: chrome.runtime.lastError.message });
      } else {
        sendResponse({ success: true, downloadId });
      }
    });

    return true;
  }

  if (request.action === 'openTab') {
    chrome.tabs.create({ url: request.url }, () => {
      sendResponse({ success: true });
    });
    return true;
  }
});

// Update badge when videos are found
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'videosFound') {
    chrome.action.setBadgeText({
      text: request.count.toString(),
      tabId: sender.tab.id
    });
    chrome.action.setBadgeBackgroundColor({
      color: '#4CAF50',
      tabId: sender.tab.id
    });
  }
});
