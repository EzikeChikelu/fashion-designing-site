# NNIA Stitches — Fashion Design Website

A refreshed, editorial-style portfolio for NNIA Stitches, built with semantic HTML, modern CSS, and lightweight vanilla JavaScript.

## Features

- Responsive layout for desktop, tablet, and mobile
- Clean fashion-editorial visual system with reusable CSS variables
- Sticky navigation and an accessible mobile menu
- Work gallery with category filters and image lightbox
- Direct WhatsApp and Instagram contact links
- Reduced-motion support, descriptive image alt text, and semantic page sections
- No build step or framework required

## Run locally

Open `index.html` in a browser, or serve the project with any static server:

```bash
python -m http.server 8000
```

Then visit http://localhost:8000.

## Project files

- `index.html` — page structure and content
- `style.css` — responsive styling and design tokens
- `script.js` — navigation, gallery filtering, and lightbox interactions
- `images/` — original brand logo and fashion portfolio imagery

## Customising the site

Update the images in the existing `images/` folder to change the portfolio. The WhatsApp and Instagram links are in the contact section near the bottom of `index.html`. Colours, spacing, and typography can be adjusted in the `:root` variables in `style.css`.


## Enquiry form and motion

The contact form prepares a WhatsApp message from the visitor's entries. It does not send automatically or store personal data; the visitor chooses the NNIA Stitches chat and sends the message themselves. Update the service options and budget ranges in `index.html` to reflect current offerings.

The page also includes social sharing metadata, basic ClothingStore structured data, keyboard focus styles, a skip link, and scroll-reveal transitions that respect reduced-motion preferences.
