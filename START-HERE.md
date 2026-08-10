# START HERE — cPanel / Symbol Host version

This build uses your own hosting resources: Node.js, cPanel MySQL and hosting disk storage. It does not require Supabase.

Deployment sequence:
1. Push this project to GitHub.
2. In cPanel create a MySQL database + user and grant ALL PRIVILEGES.
3. Import `mysql/setup.sql` using phpMyAdmin.
4. In cPanel Setup Node.js App create the application and connect it to this GitHub checkout/application root.
5. Add environment variables from `.env.example` using your real DB credentials, admin login, encryption key and domain.
6. Run `npm install` then `npm run build` in the application terminal.
7. Start/restart the Node app.
8. Point the domain/subdomain to the Node application using cPanel's application URL/domain mapping.

Uploads default to `public/uploads` locally. On production, set `UPLOAD_DIR` to a writable persistent folder. If your cPanel Node app directly serves `/public/uploads`, you can leave `UPLOAD_DIR` blank. If using a folder outside the app root, create a public mapping/symlink and set `UPLOAD_PUBLIC_URL` accordingly.

CMS: `/admin/login`
