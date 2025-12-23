#!/bin/bash
# Create simple icons using ImageMagick or use emoji

# For now, create simple colored squares with text
# You can replace these with proper icons later

# Create a simple SVG icon
cat > icon.svg << 'EOF'
<svg width="128" height="128" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#764ba2;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="128" height="128" rx="20" fill="url(#grad)"/>
  <text x="64" y="75" font-family="Arial" font-size="60" fill="white" text-anchor="middle">⬇</text>
</svg>
EOF

echo "Icon created as icon.svg"
echo "You can convert it to PNG using an online tool or ImageMagick"
echo "For now, you can use the SVG as placeholder"
