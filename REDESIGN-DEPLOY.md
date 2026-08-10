# APKMarket Redesign Deployment

## What changed
- New premium storefront UI using Playfair Display + Poppins.
- Real brand logos for demo app cards via Simple Icons CDN.
- New hero, featured-app panel, category tiles, popular apps, fresh updates, and improved app detail pages.
- Demo app fallback now works when the MySQL `apps` table is empty, including app detail URLs.
- Public app/category/search pages are dynamic so CMS updates appear without rebuilding.
- `server.js` included for cPanel Node/Passenger.
- Build script uses `next build --webpack`.

## Local Mac update
From Downloads:

```bash
cd ~/Downloads/apkmarket-cms
unzip -o ~/Downloads/apkmarket-redesign-patch.zip
npm install
DB_HOST= DB_NAME= DB_USER= npm run build
rm -f apkmarket-redesign-build.zip
zip -r apkmarket-redesign-build.zip .next
```

## Push GitHub
```bash
git add .
git commit -m "Redesign APKMarket storefront"
git push origin main
```

## Push live to cPanel
1. In File Manager open `/home/pkio/apkmarket-cms`.
2. Upload `apkmarket-redesign-patch.zip` and extract it into `/home/pkio/apkmarket-cms` (overwrite files).
3. Upload `apkmarket-redesign-build.zip` and extract it into `/home/pkio/apkmarket-cms` (overwrite `.next`).
4. Do NOT run Build on cPanel because the hosting build hits the LVE memory limit.
5. In Setup Node.js App for pk365.io click Restart.
6. Hard refresh pk365.io.

Your existing `.env.local`, MySQL database, uploaded files, and CMS credentials are not included in the patch and are not overwritten.
