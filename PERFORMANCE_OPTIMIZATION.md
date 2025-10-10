# Portfolio Performance Optimization Guide

## Current Issues (Grade: C/78)
- **Page Size:** 3.9 MB
- **Load Time:** 1.25s
- **Requests:** 51

## Critical Optimizations

### 1. Image Optimization (HIGH PRIORITY)
```bash
# Install image optimization tools
npm install -g sharp-cli imagemin-cli

# Optimize applogo.png (615KB → ~150KB)
sharp assets/applogo.png --resize 400 --webp --quality 85 --output assets/applogo.webp

# Optimize MANOJ.jpg (118KB → ~40KB)
sharp assets/MANOJ.jpg --resize 800 --webp --quality 80 --output assets/MANOJ.webp

# Expected savings: ~540KB (47% reduction)
```

### 2. Remove Duplicate Logo Requests
**Issue:** Logo loaded 4 times
- Once in HTML
- Three times with `?v=1` query parameter

**Fix:** Ensure single reference in HTML, remove cache-busting duplicates.

### 3. CDN & Resource Loading Strategy

#### Replace Large Libraries
```html
<!-- BEFORE: Tailwind (2.9MB) -->
<link href="https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css">

<!-- AFTER: Custom CSS only (uses ~30KB from your style.css) -->
<!-- Remove Tailwind entirely or use JIT build -->
```

#### Defer Non-Critical Scripts
```html
<!-- Three.js: Load after page render -->
<script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" defer></script>

<!-- Font Awesome: Load only what's needed -->
<link rel="preload" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/webfonts/fa-solid-900.woff2" as="font" crossorigin>
```

### 4. Image Lazy Loading
```html
<!-- Add loading="lazy" to all images below fold -->
<img src="assets/MANOJ.webp" loading="lazy" alt="Manoj">

<!-- Skill card backgrounds: Use data attributes -->
<div class="skill-card" data-bg-url="https://images.unsplash.com/...">
```

### 5. Font Optimization
```html
<!-- BEFORE: Multiple font weights -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700&display=swap">

<!-- AFTER: Only weights you use -->
<link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@700&display=swap&text=BUILDBYMANOJPORTFOLIO">
```

### 6. Preconnect to External Domains
```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://cdn.jsdelivr.net">
<link rel="preconnect" href="https://cdnjs.cloudflare.com">
<link rel="dns-prefetch" href="https://images.unsplash.com">
```

### 7. Critical CSS Inlining
Extract above-the-fold CSS (~5-10KB) and inline in `<head>`:
```html
<style>
  /* Critical CSS for hero, navbar, initial view */
  :root { --primary: #6366f1; --bg: #0a0a0a; }
  .navbar { /* ... */ }
  .hero { /* ... */ }
  .skill-card { /* ... */ }
</style>
```

### 8. Resource Hints
```html
<!-- Preload critical assets -->
<link rel="preload" href="assets/applogo.webp" as="image">
<link rel="preload" href="style.css" as="style">
<link rel="preload" href="script.js" as="script">
```

## Implementation Priority

### Phase 1: Quick Wins (30 minutes)
1. ✅ Optimize images (applogo.png, MANOJ.jpg)
2. ✅ Add `loading="lazy"` to images
3. ✅ Add `defer` to Three.js script
4. ✅ Remove duplicate logo requests

**Expected Impact:** Grade C → B (85+), Load time: 1.25s → 0.7s

### Phase 2: Medium Effort (2 hours)
1. ✅ Replace Tailwind with custom utility classes
2. ✅ Implement lazy loading for Unsplash backgrounds
3. ✅ Add resource hints (preconnect, dns-prefetch)
4. ✅ Optimize font loading

**Expected Impact:** Grade B → A (90+), Load time: 0.7s → 0.5s

### Phase 3: Advanced (1 day)
1. ✅ Implement critical CSS inlining
2. ✅ Bundle and minify custom JS
3. ✅ Add service worker for caching
4. ✅ Implement HTTP/2 server push

**Expected Impact:** Grade A → A+ (95+), Load time: 0.5s → 0.3s

## Monitoring Tools

1. **Lighthouse** (Chrome DevTools)
   ```bash
   # Run audit
   lighthouse https://buildbymanoj-portfolio.vercel.app --view
   ```

2. **WebPageTest** (https://webpagetest.org)
3. **Pingdom** (https://tools.pingdom.com)
4. **GTmetrix** (https://gtmetrix.com)

## Expected Final Results

| Metric | Before | After Phase 1 | After Phase 2 | After Phase 3 |
|--------|--------|---------------|---------------|---------------|
| Grade | C (78) | B (85) | A (92) | A+ (96) |
| Size | 3.9 MB | 2.1 MB | 1.2 MB | 800 KB |
| Requests | 51 | 45 | 38 | 32 |
| Load Time | 1.25s | 0.7s | 0.5s | 0.3s |

## Vercel-Specific Optimizations

### vercel.json
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    },
    {
      "source": "/(.*\\.(webp|jpg|png|svg))",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/"
    }
  ]
}
```

## Testing Checklist

- [ ] Images load in WebP format
- [ ] Logo appears only once in Network tab
- [ ] Lighthouse Performance score > 90
- [ ] First Contentful Paint < 1s
- [ ] Time to Interactive < 2s
- [ ] Cumulative Layout Shift < 0.1
- [ ] Largest Contentful Paint < 2.5s

## Next Steps

1. Run the image optimization commands
2. Update HTML with optimized images
3. Test locally with Lighthouse
4. Deploy to Vercel
5. Re-test with Pingdom
6. Compare before/after metrics
