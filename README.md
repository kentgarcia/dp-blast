# EXPLICIT DP Blast

A professional profile picture generator for your organization built with Next.js, React, TypeScript, and Tailwind CSS. Users fill out a questionnaire, upload a photo, adjust positioning, and export high-resolution images with custom frames.

## Features

- **Multi-step Questionnaire**: Collect name, section, and academic status
- **Status-specific Frames**: Different frame designs for freshman, sophomore, junior, and senior
- **High-Resolution Export**: Export images at 3000x3000 pixels for print quality
- **Interactive Image Positioning**:
  - Drag to move your photo
  - Scale slider to resize (50% to 300%)
  - Fine-tune position with X/Y controls
- **Responsive Design**: Works perfectly on desktop and mobile
- **Vercel Ready**: Optimized for easy deployment

## Getting Started

1. Install dependencies: `npm install`
2. Run the development server: `npm run dev`
3. Open [http://localhost:3000](http://localhost:3000) in your browser

## Customization

### Adding Your Frames

1. Create 3000x3000 pixel PNG images with transparent backgrounds
2. Name them according to academic status:
   - `freshman-frame.png`
   - `sophomore-frame.png`
   - `junior-frame.png`
   - `senior-frame.png`
3. Place them in the `/public/frames/` directory
4. The app will automatically use PNG frames if available, or fall back to the placeholder SVG frames

### Frame Requirements

- **Size**: Exactly 3000x3000 pixels
- **Format**: PNG with transparency
- **Background**: Transparent
- **Design**: Frame/border overlay that goes on top of user photos

## Deployment

Deploy to Vercel with one click:

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Vercel will automatically detect Next.js and deploy

For manual deployment: `npm run build`

## Technical Details

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Export Quality**: 3000x3000 pixels
- **Image Processing**: HTML5 Canvas API

---

Built for professional profile picture generation with high-quality output.
