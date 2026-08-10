# APKMarket CMS

Custom Play Store-inspired APK directory and CMS built with Next.js, cPanel MySQL and server-disk uploads.

## Features
Public homepage, apps/games/categories/search, app detail pages, rich HTML content, screenshots, specifications/features, APK upload or external URL, per-app SEO/schema, editable pages, contact inbox, SMTP notification settings, categories and admin login.

## Local setup
```bash
cp .env.example .env.local
npm install
npm run dev
```
Without MySQL credentials the frontend uses demo data. Persistent CMS writes require MySQL.

## Database
Create a MySQL database and import `mysql/setup.sql`. Then configure `DB_HOST`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.

## Uploads
Images and APKs are written to `UPLOAD_DIR`, or `public/uploads` when not set. Ensure the production folder is writable by the Node.js process.

## Security
Use strong values for `ADMIN_PASSWORD`, `ADMIN_SESSION_SECRET` and `ENCRYPTION_KEY`. SMTP app passwords are encrypted before being stored in MySQL. Only distribute APK files you have permission to host.
