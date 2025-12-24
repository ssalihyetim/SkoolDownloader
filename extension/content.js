// Content script - runs on Skool pages
console.log('Skool Video Downloader: Content script loaded');

// Store captured video URLs from network
let capturedVideoUrls = [];
let capturedM3u8Urls = [];

// Intercept fetch and XMLHttpRequest to capture video URLs
const originalFetch = window.fetch;
window.fetch = function(...args) {
  const url = args[0];
  if (typeof url === 'string') {
    if (url.includes('.m3u8') || url.includes('stream.video.skool.com')) {
      console.log('Captured m3u8 URL from fetch:', url);
      if (!capturedM3u8Urls.includes(url)) {
        capturedM3u8Urls.push(url);
      }
    } else if (url.includes('.mp4') || url.includes('video')) {
      console.log('Captured video URL from fetch:', url);
      if (!capturedVideoUrls.includes(url)) {
        capturedVideoUrls.push(url);
      }
    }
  }
  return originalFetch.apply(this, args);
};

// Also intercept XMLHttpRequest
const originalXHROpen = XMLHttpRequest.prototype.open;
XMLHttpRequest.prototype.open = function(method, url, ...rest) {
  if (typeof url === 'string') {
    if (url.includes('.m3u8') || url.includes('stream.video.skool.com')) {
      console.log('Captured m3u8 URL from XHR:', url);
      if (!capturedM3u8Urls.includes(url)) {
        capturedM3u8Urls.push(url);
      }
    }
  }
  return originalXHROpen.apply(this, [method, url, ...rest]);
};

// Extract page metadata
function extractPageMetadata() {
  // Try to get course name from URL or page
  const urlMatch = window.location.pathname.match(/\/classroom\/([^\/]+)/);
  const courseName = urlMatch ? urlMatch[1] : null;

  // Try to get lesson title
  let lessonTitle = document.querySelector('h1')?.textContent?.trim() ||
                    document.querySelector('[class*="title"]')?.textContent?.trim() ||
                    document.title;

  // Clean up title
  lessonTitle = lessonTitle.replace(/[<>:"/\\|?*]/g, '-').trim();

  return {
    courseName: courseName || 'skool-course',
    lessonTitle: lessonTitle || 'video',
    pageUrl: window.location.href
  };
}

// Extract videos from current page
function extractVideos() {
  const videos = [];
  const metadata = extractPageMetadata();

  // Extract Skool native videos from <video> tags
  const skoolVideos = document.querySelectorAll('video');
  skoolVideos.forEach((video, index) => {
    const src = video.src || video.currentSrc;
    const sources = video.querySelectorAll('source');

    if (src && src.startsWith('http')) {
      const isM3u8 = src.includes('.m3u8') || src.includes('stream.video.skool.com');
      videos.push({
        platform: 'Skool',
        id: `native_${index}`,
        type: isM3u8 ? 'hls-stream' : 'native',
        url: src,
        downloadUrl: src,
        isM3u8: isM3u8,
        title: metadata.lessonTitle,
        courseName: metadata.courseName
      });
    } else if (sources.length > 0) {
      sources.forEach((source, sourceIndex) => {
        const sourceSrc = source.src;
        if (sourceSrc && sourceSrc.startsWith('http')) {
          const isM3u8 = sourceSrc.includes('.m3u8') || sourceSrc.includes('stream.video.skool.com');
          videos.push({
            platform: 'Skool',
            id: `native_${index}_${sourceIndex}`,
            type: isM3u8 ? 'hls-stream' : 'native',
            url: sourceSrc,
            downloadUrl: sourceSrc,
            isM3u8: isM3u8,
            title: metadata.lessonTitle,
            courseName: metadata.courseName
          });
        }
      });
    }
  });

  // Extract from captured m3u8 URLs (Skool native HLS streams)
  capturedM3u8Urls.forEach((url, index) => {
    if (!videos.find(v => v.downloadUrl === url)) {
      videos.push({
        platform: 'Skool',
        id: `m3u8_${index}`,
        type: 'hls-stream',
        url: url,
        downloadUrl: url,
        isM3u8: true,
        title: metadata.lessonTitle,
        courseName: metadata.courseName
      });
    }
  });

  // Extract from captured network requests
  capturedVideoUrls.forEach((url, index) => {
    if (!videos.find(v => v.downloadUrl === url)) {
      videos.push({
        platform: 'Skool',
        id: `network_${index}`,
        type: 'network-capture',
        url: url,
        downloadUrl: url,
        title: metadata.lessonTitle,
        courseName: metadata.courseName
      });
    }
  });

  // Look for video URLs in page source/scripts
  const scripts = document.querySelectorAll('script');
  scripts.forEach(script => {
    const content = script.textContent || script.innerHTML;
    // Look for video URLs in JSON or JavaScript
    const mp4Matches = content.match(/https?:\/\/[^\s"']+\.mp4[^\s"']*/g);
    const m3u8Matches = content.match(/https?:\/\/[^\s"']+\.m3u8[^\s"']*/g);

    [...(mp4Matches || []), ...(m3u8Matches || [])].forEach((url, index) => {
      if (!videos.find(v => v.downloadUrl === url)) {
        videos.push({
          platform: 'Skool',
          id: `script_${index}`,
          type: 'script-extracted',
          url: url,
          downloadUrl: url,
          title: metadata.lessonTitle,
          courseName: metadata.courseName
        });
      }
    });
  });

  // Extract videos from video tags with data attributes
  const dataVideos = document.querySelectorAll('[data-video-url], [data-src*=".mp4"], [data-video], [data-media]');
  dataVideos.forEach((elem, index) => {
    const url = elem.dataset.videoUrl || elem.dataset.src || elem.dataset.video || elem.dataset.media;
    if (url && url.startsWith('http')) {
      if (!videos.find(v => v.downloadUrl === url)) {
        videos.push({
          platform: 'Skool',
          id: `data_${index}`,
          type: 'data-attribute',
          url: url,
          downloadUrl: url,
          title: metadata.lessonTitle,
          courseName: metadata.courseName
        });
      }
    }
  });

  // Extract Wistia videos
  const wistiaIframes = document.querySelectorAll('iframe[src*="wistia"]');
  wistiaIframes.forEach(iframe => {
    const src = iframe.src;
    const match = src.match(/wistia\.(net|com)\/embed\/iframe\/([a-zA-Z0-9]+)/);
    if (match) {
      const videoId = match[2];
      videos.push({
        platform: 'Wistia',
        id: videoId,
        type: 'iframe',
        url: src,
        embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
        title: metadata.lessonTitle,
        courseName: metadata.courseName
      });
    }
  });

  // Extract Wistia inline embeds
  const wistiaInline = document.querySelectorAll('[class*="wistia"], [id*="wistia"]');
  wistiaInline.forEach(elem => {
    const className = elem.className || '';
    const id = elem.id || '';
    const combined = className + ' ' + id;
    const match = combined.match(/wistia_async_([a-zA-Z0-9]+)/);
    if (match) {
      const videoId = match[1];
      if (!videos.find(v => v.id === videoId)) {
        videos.push({
          platform: 'Wistia',
          id: videoId,
          type: 'inline',
          embedUrl: `https://fast.wistia.net/embed/iframe/${videoId}`,
          title: metadata.lessonTitle,
          courseName: metadata.courseName
        });
      }
    }
  });

  // Extract Loom videos
  const loomIframes = document.querySelectorAll('iframe[src*="loom.com"]');
  loomIframes.forEach(iframe => {
    const src = iframe.src;
    const match = src.match(/loom\.com\/(share|embed)\/([a-zA-Z0-9]+)/);
    if (match) {
      const videoId = match[2];
      videos.push({
        platform: 'Loom',
        id: videoId,
        type: 'iframe',
        url: src,
        shareUrl: `https://www.loom.com/share/${videoId}`,
        title: metadata.lessonTitle,
        courseName: metadata.courseName
      });
    }
  });

  console.log(`Found ${videos.length} videos:`, videos);
  return videos;
}

// Listen for messages from popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'extractVideos') {
    const videos = extractVideos();
    sendResponse({ videos });
  }
  return true;
});

// Auto-detect and notify
const videos = extractVideos();
if (videos.length > 0) {
  chrome.runtime.sendMessage({
    action: 'videosFound',
    count: videos.length
  });
}
