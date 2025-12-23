from PIL import Image, ImageDraw, ImageFont

def create_icon(size, filename):
    # Create gradient background
    img = Image.new('RGB', (size, size), '#667eea')
    draw = ImageDraw.Draw(img)
    
    # Draw gradient (simple two-color)
    for y in range(size):
        r1, g1, b1 = 102, 126, 234  # #667eea
        r2, g2, b2 = 118, 75, 162   # #764ba2
        
        factor = y / size
        r = int(r1 + (r2 - r1) * factor)
        g = int(g1 + (g2 - g1) * factor)
        b = int(b1 + (b2 - b1) * factor)
        
        draw.line([(0, y), (size, y)], fill=(r, g, b))
    
    # Draw download symbol
    arrow_size = size // 2
    center = size // 2
    
    # Arrow shaft
    draw.rectangle([center - size//10, center - arrow_size//2, 
                   center + size//10, center + arrow_size//4], 
                  fill='white')
    
    # Arrow head (triangle)
    arrow_width = size // 3
    points = [
        (center, center + arrow_size//2),
        (center - arrow_width//2, center),
        (center + arrow_width//2, center)
    ]
    draw.polygon(points, fill='white')
    
    img.save(filename, 'PNG')
    print(f'Created {filename}')

# Create icons
create_icon(16, 'icon16.png')
create_icon(48, 'icon48.png')
create_icon(128, 'icon128.png')
