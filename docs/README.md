# CONNECT shared dashboard (GitHub Pages-ready)

This folder is intended to be published as a static website (recommended: GitHub Pages from the `main` branch `/docs` folder).

## Contents

- `index.html` — dashboard UI (auto-fetches `connect-awareness-dashboard-data.json` and falls back to embedded records)
- `connect-awareness-dashboard-data.json` — exported dataset used by the dashboard

## Build locally

Run:

```powershell
powershell -ExecutionPolicy Bypass -File D:\AI\scripts\connect_build_public_site.ps1
```

## Publish (after repo + remote are set)

Run:

```powershell
powershell -ExecutionPolicy Bypass -File D:\AI\scripts\connect_publish_git.ps1
```

