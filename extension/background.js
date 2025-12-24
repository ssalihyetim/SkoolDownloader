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
    // First try to get media info from Wistia API
    const mediaUrl = `https://fast.wistia.com/embed/medias/${videoId}.json`;
    let downloadUrl = null;
    let title = null;

    try {
      const mediaResponse = await fetch(mediaUrl);
      if (mediaResponse.ok) {
        const mediaData = await mediaResponse.json();
        console.log('Wistia media data:', mediaData);

        // Extract title
        title = mediaData.media?.name || mediaData.name;

        // Try to find MP4 asset
        const assets = mediaData.media?.assets || mediaData.assets || [];
        const mp4Asset = assets.find(asset =>
          asset.type === 'original' ||
          asset.type === 'mp4_video' ||
          asset.container === 'mp4'
        );

        if (mp4Asset && mp4Asset.url) {
          downloadUrl = mp4Asset.url;
          console.log('Found Wistia MP4 URL:', downloadUrl);
        }
      }
    } catch (err) {
      console.warn('Could not fetch Wistia media info:', err);
    }

    // Also try oEmbed API for title
    if (!title) {
      try {
        const oembedUrl = `https://fast.wistia.com/oembed?url=https://fast.wistia.net/embed/iframe/${videoId}`;
        const response = await fetch(oembedUrl);
        if (response.ok) {
          const data = await response.json();
          title = data.title;
        }
      } catch (err) {
        console.warn('Could not fetch Wistia oEmbed:', err);
      }
    }

    return {
      id: videoId,
      title: title || `Wistia Video ${videoId}`,
      platform: 'Wistia',
      downloadUrl: downloadUrl,
      embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
      needsExtraction: !downloadUrl
    };
  } catch (error) {
    console.error('Failed to fetch Wistia info:', error);
    return {
      id: videoId,
      title: `Wistia Video ${videoId}`,
      platform: 'Wistia',
      downloadUrl: null,
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
