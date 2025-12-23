// Debug script - Skool page'de console'a yapıştır

console.log('=== Skool Video Debug ===');

// Find all video elements
const videos = document.querySelectorAll('video');
console.log('Video elements found:', videos.length);
videos.forEach((v, i) => {
  console.log(`Video ${i}:`, {
    src: v.src,
    currentSrc: v.currentSrc,
    sources: Array.from(v.querySelectorAll('source')).map(s => s.src)
  });
});

// Find all iframes
const iframes = document.querySelectorAll('iframe');
console.log('Iframes found:', iframes.length);
iframes.forEach((iframe, i) => {
  console.log(`Iframe ${i}:`, iframe.src);
});

// Check for video players
const players = document.querySelectorAll('[class*="player"], [id*="player"], [class*="video"], [id*="video"]');
console.log('Potential video players:', players.length);
players.forEach((p, i) => {
  console.log(`Player ${i}:`, {
    className: p.className,
    id: p.id,
    innerHTML: p.innerHTML.substring(0, 200)
  });
});

// Check network requests for video URLs
console.log('Check Network tab for .mp4, .m3u8, or video/* content-type');
console.log('Also check for API calls to video services');

// Look for React/Vue data
const reactRoot = document.querySelector('[data-reactroot], #root, #app');
if (reactRoot) {
  console.log('React/Vue root found, data might be in component state');
}
