# Chris Nappi - Portfolio Website

A modern, interactive, and fully responsive portfolio website for Chris Nappi, Product Design Lead.

## Features

### 🎨 Design
- Clean, minimal design based on your provided mockups
- Modern typography and color scheme
- Smooth animations and transitions
- Beautiful gradient backgrounds for work cards

### 🚀 Interactions
- **Smooth Scroll Navigation**: All navigation links smoothly scroll to their respective sections
- **Logo Reset**: Clicking the logo/name in the header smoothly scrolls back to the top
- **Hover Effects**:
  - Logo hover: Avatar rotates and scales, name changes color
  - Navigation links: Animated underline effect
  - Work cards: Lift animation with shadow, image zoom, and arrow slide
  - Text sections: Subtle zoom effect on hover
  - Profile photo: Scale and rotate effect

### 📱 Responsive Design
- Fully responsive across all device sizes
- Optimized layouts for:
  - Desktop (1200px+)
  - Tablet (768px - 968px)
  - Mobile (< 768px)
- Header stacks vertically on mobile
- Work grid adapts to single column on mobile
- Text sizes scale appropriately

### 📄 Sections
1. **Hero Section**: Introduction with profile photo
2. **Featured Work**: 6 portfolio project cards (placeholders ready for content)
3. **About**: Personal bio and background
4. **Experience**: Section ready for resume content

## Getting Started

### Running Locally

1. Navigate to the project directory:
```bash
cd /Users/chrisnappi/Desktop/Personal/portfolio
```

2. Start a local web server (choose one):

**Using Python 3:**
```bash
python3 -m http.server 8000
```

**Using Python 2:**
```bash
python -m SimpleHTTPServer 8000
```

**Using Node.js (if you have http-server installed):**
```bash
npx http-server -p 8000
```

3. Open your browser and navigate to:
```
http://localhost:8000
```

## File Structure

```
portfolio/
├── index.html          # Main HTML structure
├── styles.css          # All styles and animations
├── script.js           # Interactive functionality
└── README.md           # This file
```

## Customization Guide

### Adding Real Images

1. **Profile Photo**: Replace the placeholder in the HTML:
```html
<div class="profile-photo" style="background-image: url('path/to/your/photo.jpg');"></div>
```

2. **Work Card Images**: Add images to each work card by updating the placeholder divs:
```html
<div class="placeholder-image purple-bg" style="background-image: url('path/to/project.jpg');"></div>
```

### Adding Work Card Links

Each work card is currently set up as a placeholder. To link to individual project pages:

1. Remove `data-color` attribute from the work card
2. Update the `article` tag to an `a` tag:
```html
<a href="/project-page.html" class="work-card">
  <!-- card content -->
</a>
```

### Customizing Colors

All colors are defined as CSS variables in `styles.css`:
```css
:root {
    --primary-red: #E53E3E;
    --text-dark: #2D3748;
    --text-light: #4A5568;
    /* etc. */
}
```

### Adding More Sections

Follow the existing section pattern:
```html
<section id="new-section" class="new-section">
    <div class="container">
        <h2 class="section-heading">Section Title</h2>
        <!-- Your content -->
    </div>
</section>
```

Don't forget to add navigation link in the header!

## Browser Compatibility

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Performance Features

- Optimized animations with CSS transforms
- Hardware-accelerated transitions
- Throttled scroll events
- Intersection Observer for efficient animations
- Smooth scrolling with `scroll-behavior: smooth`

## Next Steps

1. **Add Real Content**: Replace placeholder text and images with actual portfolio content
2. **Create Individual Project Pages**: Build detailed case study pages for each work card
3. **Add Resume Content**: Populate the Experience section with your work history
4. **Add Contact Form**: Consider adding a contact section at the bottom
5. **Add Analytics**: Integrate Google Analytics or similar tracking
6. **SEO Optimization**: Add meta tags, Open Graph tags, etc.
7. **Add Favicon**: Create and add a favicon for browser tabs

## Development Notes

- The site uses vanilla JavaScript (no frameworks) for maximum performance
- All animations respect `prefers-reduced-motion` for accessibility
- Semantic HTML5 for better SEO and accessibility
- CSS Grid and Flexbox for layout
- Mobile-first responsive approach

## Support

For questions or issues, feel free to reach out!

---

Built with ❤️ for showcasing exceptional UX design work.
