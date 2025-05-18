# Outliers Explorer

A minimal **stand‑alone** React + Vite + Tailwind project that reproduces the *Outliers* research page you asked for — complete with sliders, search, and filtering.

## 🛠  Quick start

```bash
# 1) Install dependencies
npm install      # or pnpm install / yarn

# 2) Start the dev server
npm run dev

# 3) Open the URL that Vite prints (usually http://localhost:5173)
```

## 📦  Production build

```bash
npm run build     # generates static assets in dist/
npm run preview   # serves the production build locally
```

## 📂  Project structure

```
outliers-app/
├── index.html
├── package.json
├── tailwind.config.ts
├── postcss.config.cjs
├── tsconfig.json
├── vite.config.ts
└── src
    ├── index.css        # Tailwind layers
    ├── main.tsx         # Entry point
    ├── App.tsx          # Top‑level layout
    ├── components/
    │   ├── Outliers.tsx # Whole research page
    │   └── VideoCard.tsx
    └── data/
        └── sampleVideos.ts
```

Everything is written in **TypeScript** and should compile out‑of‑the‑box.  
Have fun hacking on it!
