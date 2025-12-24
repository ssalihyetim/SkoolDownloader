// Wistia video extractor - injected into Wistia embed pages
console.log('Wistia extractor loaded');

// Function to extract video URL from Wistia player
function extractWistiaVideoUrl() {
  try {
    // Method 1: Check for Wistia API global
    if (window._wq && window._wq.length > 0) {
      const wistiaData = window._wq[0];
      if (wistiaData && wistiaData.onReady) {
        wistiaData.onReady(function(video) {
          console.log('Wistia video object:', video);

          // Get video assets
          const assets = video.data?.media?.assets || [];
          const mp4Assets = assets.filter(a => a.container === 'mp4' || a.type === 'mp4_video');

          if (mp4Assets.length > 0) {
            // Sort by quality (higher first)
            mp4Assets.sort((a, b) => (b.height || 0) - (a.height || 0));
            const bestAsset = mp4Assets[0];

            console.log('Found Wistia MP4:', bestAsset.url);

            // Send to extension
            window.postMessage({
              type: 'WISTIA_VIDEO_URL',
              url: bestAsset.url,
              title: video.data?.media?.name,
              duration: video.duration()
            }, '*');
          }
        });
      }
    }

    // Method 2: Check Wistia._data
    if (window.Wistia && window.Wistia._data) {
      const mediaId = Object.keys(window.Wistia._data)[0];
      if (mediaId) {
        const mediaData = window.Wistia._data[mediaId];
        console.log('Wistia media data:', mediaData);

        const assets = mediaData.assets || [];
        const mp4Assets = assets.filter(a => a.container === 'mp4' || a.type === 'mp4_video');

        if (mp4Assets.length > 0) {
          mp4Assets.sort((a, b) => (b.height || 0) - (a.height || 0));
          const bestAsset = mp4Assets[0];

          window.postMessage({
            type: 'WISTIA_VIDEO_URL',
            url: bestAsset.url,
            title: mediaData.name
          }, '*');
        }
      }
    }
  } catch (error) {
    console.error('Error extracting Wistia video:', error);
  }
}

// Wait for Wistia to load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(extractWistiaVideoUrl, 1000);
  });
} else {
  setTimeout(extractWistiaVideoUrl, 1000);
}

// Also try after a delay
setTimeout(extractWistiaVideoUrl, 3000);
