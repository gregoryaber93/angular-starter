# angular-starter

Angular 20 starter application with examples for:
- REST API CRUD
- JWT login flow
- WebSocket messaging
- WebRTC local/remote stream handling
- Toast notifications

## Repository overview

- `src/app/components/` - UI feature components (`rest`, `webrtc`, `websocket`, `login`, `toast`)
- `src/app/services/` - API and integration services
- `src/app/models/` - shared TypeScript models

## Prerequisites

- Node.js 20+
- npm 10+

## Install

```bash
npm install
```

## Run locally

```bash
npm start
```

Open: `http://localhost:4200`

## Build

```bash
npm run build
```

## Test

```bash
npm test
```

## Backend services expected by this app

The frontend currently uses these default local endpoints:

- REST + auth: `http://localhost:3000/`
  - login: `POST /auth/login`
  - products CRUD on `/`
- WebSocket: `wss://localhost:3002/`

> If your backend runs on different URLs/ports, update the corresponding service files in `src/app/services/`.

## Routes

- `/` or `/rest` - REST products page
- `/webrtc` - WebRTC demo page
- `/websocket` - WebSocket demo page
- `/login` - login page

## Notes

- GraphQL service code exists in the repository, but GraphQL routes/components are currently commented out.
