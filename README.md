<<<<<<< HEAD
# super-duper-parakeet
=======
# My SaaS Application

This project is a Software as a Service (SaaS) application consisting of an API and a web frontend. It is structured to facilitate development, testing, and deployment.

## Project Structure

```
my-saas-app
├── apps
│   ├── api          # API application
│   ├── web          # Web application
│   └── shared       # Shared types and utilities
├── package.json     # Root package configuration
├── tsconfig.json    # Root TypeScript configuration
├── README.md        # Project documentation
├── .gitignore       # Files to ignore in version control
└── .editorconfig    # Coding styles and formatting rules
```

## Getting Started

### Prerequisites

- Node.js (version X.X.X)
- npm (version X.X.X) or yarn

### Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   cd my-saas-app
   ```

2. Install dependencies for the API:
   ```
   cd apps/api
   npm install
   ```

3. Install dependencies for the web application:
   ```
   cd ../web
   npm install
   ```

4. (Optional) Install dependencies for the shared library:
   ```
   cd ../shared
   npm install
   ```

### Running the Application

  ```
  cd apps/api
  copy .env.example .env
  npm install
  npm run dev   # development (TS)
  # or
  npm run build && npm start   # production build
  ```

## Quick start (local, dev)

1) API
 - Copy `apps/api/.env.example` to `apps/api/.env` and adjust values.
 - Install deps and start:
   - Windows PowerShell:
     - cd apps/api
     - npm install
     - npm run dev
 - API runs on http://localhost:3000

2) Web
 - Optionally create `apps/web/.env` and set `VITE_API_BASE` (defaults to http://localhost:3000).
 - Install and start:
   - Windows PowerShell:
     - cd apps/web
     - npm install
     - npm start
 - Web runs on http://localhost:5173 (exposed to LAN because `host: true`).

## Test over local network (with your team)

Find your machine IP (e.g., 192.168.1.50):
- API: ensure it binds to 0.0.0.0 (default for Node). If needed, run `PORT=3000 node dist/app.js` after `npm run build`.
- Web (Vite dev): already configured with `host: true` so teammates can open `http://YOUR_IP:5173`.

If the browser blocks mixed content, ensure both are HTTP or both HTTPS on the same LAN.

## Simple production-ish deploy (one VM)

On a Linux VM (Ubuntu):
- Install Node 18+, Nginx.
- Reverse-proxy two upstreams:
  - api.example.com -> Node API (port 3000)
  - app.example.com -> Static web build (Vite `dist` served by Nginx)
- Steps:
  - API: `cd apps/api; npm ci; npm run build; PORT=3000 node dist/app.js` (use pm2 or systemd)
  - Web: `cd apps/web; npm ci; npm run build` then serve `apps/web/dist` via Nginx root.
  - Set `VITE_API_BASE=https://api.example.com` before `npm run build` for the web.

## Docker (optional)

You can add a docker-compose with two services (api, web) and an Nginx reverse proxy. If you want, ask and I'll add it.

  Test admin login (default credentials from .env.example):
  - POST http://localhost:3000/admin/login
    body: { "email": "admin@example.com", "password": "Admin#2025" }
  - GET http://localhost:3000/admin/me with header Authorization: Bearer <token>

- To start the web application:
  ```
  cd apps/web
  npm run dev
  ```

### Testing

- To run unit tests for the API:
  ```
  cd apps/api
  npm test
  ```

- To run tests for the web application:
  ```
  cd apps/web
  npm test
  ```

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.
>>>>>>> 2e99e73 (initial)
