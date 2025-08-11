Netlify build notes

- Site base directory: apps/web
- Build command: npm run build
- Publish directory: dist
- Environment variables:
  - NODE_VERSION = 18
  - VITE_API_BASE = https://rozare-as.up.railway.app

Troubleshooting
- If the build fails with `npm run build`, ensure the repo has apps/web/package.json with Vite 5 and @vitejs/plugin-react 4.
- Clear cache and retry deploy.
- Confirm there is no apps/web/netlify.toml conflicting with the root netlify.toml.
