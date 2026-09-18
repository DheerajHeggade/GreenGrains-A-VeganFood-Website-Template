# 🌱 Green Gains — Vegan Fuel for Lifters

A glassmorphism-styled, 100% plant-based e-commerce site built for gym-goers: high-protein vegan meals, shakes, snacks, staples, meal-plan subscriptions and a daily protein calculator.

## ✨ Features

- **Shop** — 12 products with live search, category filters and sorting (protein / price)
- **Cart** — slide-in glass drawer, quantity controls, free-delivery progress bar, `localStorage` persistence, WhatsApp demo checkout
- **Protein Calculator** — daily protein & kcal targets by weight, goal and activity; auto-fills your cart with suggested meals
- **Meal Plans** — Lean Cut, Bulk Builder and Athlete subscriptions
- **Brand video** — an accessible, responsive HTML5 video section with a local MP4 asset and download fallback
- **Design** — full glassmorphism (frosted glass, aurora orbs, neon lime/mint accents), scroll-reveal animations, fully responsive

## 🚀 Run locally

No build step — it's a pure static site.

```bash
python -m http.server 5500 --bind 127.0.0.1
# then open http://127.0.0.1:5500
```

Or simply double-click `index.html`.

## 📁 Files

| File | Purpose |
|---|---|
| `index.html` | Page structure — hero, shop, calculator, plans, reviews, FAQ, cart drawer |
| `styles.css` | Glassmorphism design system + responsive layout |
| `script.js` | Catalog, filters, cart, calculator, toasts |
| `assets/green-gains.mp4` | Included brand video used by the video section |

## ⚠️ Demo notes

- Prices, phone number and products are placeholders
- Checkout is a WhatsApp mock — connect a payment gateway for real orders

---

© 2026 Green Gains · 100% vegan · no whey, no way
