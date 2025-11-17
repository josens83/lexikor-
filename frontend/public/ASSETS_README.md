# LexiKor - Required Asset Files

This document describes the image assets needed for a professional production deployment.

## Favicon Files

Place these files in `/frontend/public/`:

### 1. favicon.ico
- **Size**: 32x32 pixels (multi-resolution ICO file preferred)
- **Description**: Classic favicon for browser tabs
- **Tool**: Use https://realfavicongenerator.net/ to generate from a PNG

### 2. favicon-16x16.png
- **Size**: 16x16 pixels
- **Description**: Small favicon for browser tabs
- **Format**: PNG with transparency

### 3. favicon-32x32.png
- **Size**: 32x32 pixels
- **Description**: Standard favicon for browser tabs
- **Format**: PNG with transparency

### 4. apple-touch-icon.png
- **Size**: 180x180 pixels
- **Description**: Icon for iOS home screen
- **Format**: PNG (no transparency, solid background)

### 5. android-chrome-192x192.png
- **Size**: 192x192 pixels
- **Description**: Icon for Android home screen
- **Format**: PNG with transparency

### 6. android-chrome-512x512.png
- **Size**: 512x512 pixels
- **Description**: High-res icon for Android
- **Format**: PNG with transparency

## Open Graph / Social Media Images

### 7. og-image.png
- **Size**: 1200x630 pixels (Facebook/LinkedIn standard)
- **Description**: Image shown when sharing on Facebook, LinkedIn, KakaoTalk
- **Content**: LexiKor logo + tagline "AI 기반 한국형 법률 플랫폼"
- **Format**: PNG or JPG
- **Design Elements**:
  - Background: Gradient (Purple #667eea to #764ba2)
  - Logo: ⚖️ LexiKor in large white text
  - Tagline: "AI 기반 한국형 법률 플랫폼" below logo
  - Clean, professional design with good contrast

### 8. og-image-square.png (Optional)
- **Size**: 1200x1200 pixels
- **Description**: Square image for Instagram, WhatsApp
- **Format**: PNG or JPG

## Logo Files

### 9. logo.svg
- **Description**: Vector logo for scalability
- **Content**: ⚖️ scales emoji + "LexiKor" text
- **Format**: SVG
- **Use**: Website header, email templates

### 10. logo-white.svg
- **Description**: White version for dark backgrounds
- **Format**: SVG

### 11. logo.png
- **Size**: 512x512 pixels (transparent background)
- **Description**: Raster logo for general use
- **Format**: PNG with transparency

## How to Add Favicons to HTML

Update `/frontend/index.html` to include:

```html
<!-- Favicons -->
<link rel="icon" type="image/x-icon" href="/favicon.ico">
<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
<link rel="icon" type="image/png" sizes="192x192" href="/android-chrome-192x192.png">
<link rel="icon" type="image/png" sizes="512x512" href="/android-chrome-512x512.png">

<!-- Web App Manifest -->
<link rel="manifest" href="/site.webmanifest">
```

## Web App Manifest (site.webmanifest)

Already created at `/frontend/public/site.webmanifest` with proper configuration.

## Design Guidelines

### Brand Colors
- **Primary Purple**: #667eea
- **Secondary Purple**: #764ba2
- **Gradient**: linear-gradient(135deg, #667eea 0%, #764ba2 100%)
- **Text on White**: #1f2937 (dark gray)
- **Text on Purple**: #ffffff (white)

### Logo Design Recommendations
1. Use the ⚖️ scales of justice emoji as the icon
2. Font: Sans-serif, bold weight
3. Keep it simple and recognizable at small sizes
4. Ensure good contrast on both light and dark backgrounds

### OG Image Design Tips
- Use high contrast for readability
- Include key value proposition
- Keep text large and legible
- Test on Facebook Debugger: https://developers.facebook.com/tools/debug/
- Test on Twitter Card Validator: https://cards-dev.twitter.com/validator

## Tools for Creating Assets

### Free Design Tools
1. **Canva**: https://www.canva.com/ - Easy OG image creation
2. **Figma**: https://www.figma.com/ - Professional design tool
3. **GIMP**: https://www.gimp.org/ - Free Photoshop alternative

### Favicon Generators
1. **RealFaviconGenerator**: https://realfavicongenerator.net/
   - Upload a PNG (512x512 minimum)
   - Get all favicon sizes automatically
   - Includes manifest and HTML code

### SVG Optimization
1. **SVGOMG**: https://jakearchibald.github.io/svgomg/
   - Optimize SVG file sizes
   - Remove unnecessary data

## Testing

After adding assets:

1. **Favicon Test**: Open site in browser, check browser tab icon
2. **OG Image Test**: Share URL on Facebook/KakaoTalk, verify image appears
3. **Mobile Test**: Add to home screen on iOS/Android, check icon
4. **Lighthouse Audit**: Run in Chrome DevTools for PWA score

## Current Status

✅ Asset requirements documented
✅ site.webmanifest created
✅ HTML meta tags configured for OG images
⏳ Actual image files need to be created and added

## Next Steps

1. Create logo design (can use Canva or hire designer on Fiverr)
2. Generate favicons using RealFaviconGenerator
3. Create OG image (1200x630) with brand colors
4. Add all files to `/frontend/public/`
5. Update `index.html` with favicon links (see above)
6. Test on all platforms

---

**Note**: The placeholder `/vite.svg` in `index.html` should be replaced with `/favicon.ico` once favicon files are created.
