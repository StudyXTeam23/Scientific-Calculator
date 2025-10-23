# Required Icon Assets

This directory should contain the following icon files for SEO and PWA support:

## Required Files:

### 1. Favicon and Icons
- **icon.png** (192x192px) - Standard icon for browsers and PWA
- **icon-512.png** (512x512px) - Large icon for PWA
- **apple-icon.png** (180x180px) - Apple touch icon for iOS devices

### 2. Social Media Images
- **og-image.png** (1200x630px) - Open Graph image for social media sharing
  - Used by Facebook, LinkedIn, and other platforms
  - Should include the app name and a visual representation

### 3. Screenshots (Optional but Recommended)
- **screenshot.png** (1280x720px) - App screenshot for PWA
  - Shows the calculator interface
  - Used in app install prompts

## Design Guidelines:

### Icon Design (icon.png, icon-512.png, apple-icon.png):
- Background: Primary blue (#5d89ee) or white
- Subject: Calculator symbol or "=" sign
- Style: Modern, minimalist, flat design
- Ensure it's recognizable at small sizes

### Open Graph Image (og-image.png):
- Background: Gradient or solid color
- Include: "Scientific Calculator" text
- Include: Brief tagline or screenshot
- Ensure text is readable on mobile

## Quick Generation Options:

1. **Online Tools**:
   - [Favicon.io](https://favicon.io) - Generate favicons from text/image
   - [RealFaviconGenerator](https://realfavicongenerator.net) - Complete icon package
   - [Canva](https://canva.com) - Create og-image with templates

2. **Design Tools**:
   - Figma/Sketch - Professional design
   - GIMP/Photoshop - Image editing

3. **AI Generation**:
   - Use AI tools like DALL-E, Midjourney for icon concepts
   - Specify: "calculator icon, flat design, blue theme, minimalist"

## Temporary Placeholder:

For development, you can use a simple colored square:
```bash
# Using ImageMagick (if installed)
convert -size 192x192 xc:#5d89ee icon.png
convert -size 512x512 xc:#5d89ee icon-512.png
convert -size 180x180 xc:#5d89ee apple-icon.png
convert -size 1200x630 xc:#5d89ee og-image.png
```

Or use online placeholder services:
- https://placehold.co/192x192/5d89ee/white?text=Calc

