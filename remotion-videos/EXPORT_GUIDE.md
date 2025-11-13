# Video Export Guide

## 📹 Videos Successfully Rendered!

### Generated Files

Located in: `out/`

1. **crop-timeline.mp4** - Standard quality (776 KB)
2. **crop-timeline-optimized.mp4** - Optimized quality (749 KB)

Both videos are:
- Duration: 15 seconds (450 frames at 30fps)
- Resolution: 1920x1080 (Full HD)
- Codec: H.264
- Format: MP4

---

## 🎬 Export Commands Reference

### Basic Export
```bash
npm run video:render-intro       # Export GardenIntro
npm run video:render-timeline    # Export CropTimeline
```

### Custom Export with Options

#### Standard Quality (Balanced)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.mp4
```

#### High Quality (Larger file)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-hq.mp4 \
  --crf=18 \
  --codec=h264
```

#### Optimized (Smaller file, good quality)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-opt.mp4 \
  --crf=23 \
  --pixel-format=yuv420p
```

#### Maximum Compression (Smallest file)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-small.mp4 \
  --crf=28 \
  --pixel-format=yuv420p
```

---

## 🎨 Quality Settings (CRF)

CRF = Constant Rate Factor (0-51, lower = better quality)

| CRF | Quality | File Size | Best For |
|-----|---------|-----------|----------|
| 18  | Very High | Large | Professional use |
| 23  | High | Medium | **Recommended** |
| 28  | Good | Small | Web/social media |
| 32  | Fair | Very small | Low bandwidth |

---

## 📐 Resolution Options

### Full HD (Default - Recommended)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.mp4 \
  --width=1920 --height=1080
```

### HD
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-hd.mp4 \
  --width=1280 --height=720
```

### Square (Instagram/Social)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-square.mp4 \
  --width=1080 --height=1080
```

### Vertical (TikTok/Stories)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-vertical.mp4 \
  --width=1080 --height=1920
```

### 4K
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video-4k.mp4 \
  --width=3840 --height=2160
```

---

## 🎞️ Format Options

### MP4 (Default - Best compatibility)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.mp4
```

### WebM (Better compression, web-friendly)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.webm \
  --codec=vp8
```

### Image Sequence (For post-processing)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/frames \
  --sequence
```
This creates: `out/frames/frame-0000.png`, `frame-0001.png`, etc.

### GIF
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.gif
```

### PNG Sequence (Transparent background support)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/frames \
  --sequence \
  --image-format=png
```

---

## 🎯 Custom Props

Export with custom data:

```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/tomatoes.mp4 \
  --props='{"cropName":"Tomatoes","sowingDate":"2025-03-15","harvestDate":"2025-07-20"}'
```

```bash
npx remotion render remotion-videos/src/index.ts GardenIntro out/my-garden.mp4 \
  --props='{"gardenName":"My Garden","plantCount":42}'
```

---

## ⚡ Performance Options

### Increase Speed (Use more CPU cores)
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.mp4 \
  --concurrency=8
```

### Reduce Quality for Faster Render
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/video.mp4 \
  --crf=28 \
  --scale=0.5
```

---

## 📦 Recommended Presets

### For Website Embedding
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/web.mp4 \
  --crf=23 \
  --width=1920 \
  --height=1080 \
  --pixel-format=yuv420p
```
**Result**: ~750KB for 15s video

### For Social Media
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/social.mp4 \
  --crf=28 \
  --width=1080 \
  --height=1080
```

### For Email/Newsletter
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/email.gif \
  --width=800 \
  --height=600
```

### For Download/Archive
```bash
npx remotion render remotion-videos/src/index.ts CropTimeline out/archive.mp4 \
  --crf=18 \
  --width=1920 \
  --height=1080
```

---

## 🔧 Batch Export

Create multiple versions at once:

```bash
#!/bin/bash
# save as export-all.sh

COMPOSITION="CropTimeline"
INPUT="remotion-videos/src/index.ts"

# Web version
npx remotion render $INPUT $COMPOSITION out/web.mp4 --crf=23

# HD version
npx remotion render $INPUT $COMPOSITION out/hd.mp4 --crf=23 --width=1280 --height=720

# Social media
npx remotion render $INPUT $COMPOSITION out/social.mp4 --crf=28 --width=1080 --height=1080

# GIF
npx remotion render $INPUT $COMPOSITION out/preview.gif --width=800 --height=600

echo "✅ All versions exported!"
```

---

## 📤 Upload to CDN

### Upload to Cloudflare R2 (Recommended)
```bash
# Install Wrangler CLI
npm install -g wrangler

# Configure
wrangler r2 bucket create gardenflow-videos

# Upload
wrangler r2 object put gardenflow-videos/crop-timeline.mp4 \
  --file=out/crop-timeline-optimized.mp4 \
  --content-type=video/mp4
```

### Upload to AWS S3
```bash
aws s3 cp out/crop-timeline-optimized.mp4 \
  s3://gardenflow-videos/crop-timeline.mp4 \
  --acl public-read \
  --content-type video/mp4
```

---

## 🎬 Using in Your App

### HTML5 Video Tag
```html
<video width="1920" height="1080" controls>
  <source src="https://cdn.gardenflow.io/crop-timeline.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>
```

### React Component
```tsx
export const VideoPlayer = () => {
  return (
    <video
      width="100%"
      height="auto"
      controls
      autoPlay
      loop
      muted
    >
      <source
        src="https://cdn.gardenflow.io/crop-timeline.mp4"
        type="video/mp4"
      />
    </video>
  );
};
```

### Background Video
```html
<video
  autoplay
  loop
  muted
  playsinline
  style="position: absolute; width: 100%; height: 100%; object-fit: cover;"
>
  <source src="https://cdn.gardenflow.io/crop-timeline.mp4" type="video/mp4">
</video>
```

---

## 💡 Tips

1. **CRF 23 is the sweet spot** for web videos (good quality, reasonable size)
2. **Always use yuv420p** for maximum browser compatibility
3. **Test on mobile** - some devices struggle with high-res videos
4. **Use WebM for web** when possible (better compression than MP4)
5. **Compress GIFs** - they're often huge! Use tools like Gifsicle
6. **CDN is essential** - Don't serve videos from your app server

---

## 🐛 Troubleshooting

### Video is too large
- Increase CRF (try 28 instead of 23)
- Reduce resolution (1280x720 instead of 1920x1080)
- Use WebM format instead of MP4

### Quality is poor
- Decrease CRF (try 18 instead of 23)
- Increase resolution
- Check your source design has high-quality elements

### Render is slow
- Increase --concurrency (try 8 or 12)
- Reduce complexity in your React components
- Use simpler animations

### Video won't play in browser
- Add --pixel-format=yuv420p
- Use MP4 format (not MOV or AVI)
- Ensure codec is h264

---

## 📊 File Size Reference

For a 15-second video at 30fps (450 frames):

| Resolution | CRF 18 | CRF 23 | CRF 28 |
|------------|--------|--------|--------|
| 1920x1080  | ~1.2MB | ~750KB | ~400KB |
| 1280x720   | ~600KB | ~400KB | ~200KB |
| 1080x1080  | ~800KB | ~500KB | ~250KB |

---

## ✅ Your Videos Are Ready!

Current exports in `out/`:
- ✅ crop-timeline.mp4 (776 KB)
- ✅ crop-timeline-optimized.mp4 (749 KB) **← Recommended for web**

Both are ready to:
- Upload to CDN
- Embed in website
- Share on social media
- Use in presentations
