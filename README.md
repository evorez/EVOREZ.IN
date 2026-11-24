# Evorez

A responsive personal site inspired by the original Evorez landing page. It keeps the “still alive, still building” identity, the project queue and the rebuilding arcade, with a refreshed design and a light/dark appearance picker.

## Run locally

Requires Node.js 20.19+ or 22.12+.

```sh
npm ci
npm run dev
```

Vite prints the local address in the terminal. To make a production build and preview it:

```sh
npm run build
npm run preview
```

The static build is written to `dist/`; a Vercel deployment can use the Vite framework preset and that output directory.

## Editing

- Site copy, queue items and social links: `src/App.jsx`
- Layout, colors and responsive styles: `src/styles.css`
- Favicon, artwork and social-sharing image: `public/`

The queue percentages/statuses are static copy inspired by the original site, not live project data; update them in `src/App.jsx` as projects change. Appearance preferences are stored locally in the visitor's browser. The arcade currently shows its rebuilding status; it does not include games. The old site's AI chat and soundtrack are not connected in this build.
