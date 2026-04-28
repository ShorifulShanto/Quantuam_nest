# Project Cleanup Guide

To reduce the size of your project before sharing or zipping it, you can safely remove the following directories. These are temporary and will be recreated as needed.

## Safe to Remove

1. **`node_modules/`**
   - **What it is:** External dependencies downloaded from NPM.
   - **How to restore:** Run `npm install` in your terminal.

2. **`.next/`**
   - **What it is:** Next.js build cache and development server files.
   - **How to restore:** Run `npm run dev` or `npm run build`.

3. **`out/`**
   - **What it is:** The static export of your application (used for Android/iOS deployment).
   - **How to restore:** Run `npm run static-build`.

4. **`.idx/`**
   - **What it is:** Internal configuration for the Google Cloud Workstation IDE.
   - **How to restore:** Re-initialized automatically when opened in IDX.

## Quick Cleanup Command

You can use the following command to remove all of these at once:

```bash
npm run clean
```

Or manually:

```bash
rm -rf node_modules .next out .idx
```

## Important
Do **NOT** delete the `src/`, `public/`, or `package.json` files, as these contain your actual application code and assets.