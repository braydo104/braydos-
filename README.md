# GPS Tracker (Local PWA)

This is a minimal personal GPS tracker web app that stores location points locally in the browser (localStorage) and allows exporting them as CSV.

Notes
- Requires a secure context: use HTTPS or run from `localhost`. Opening the file via `file://` often blocks geolocation.
- Designed for personal use only. Do not track other people without explicit consent.

How to run (quick)

1. Open a terminal in the `gps-app` folder.
2. Serve the folder on localhost. Example (PowerShell):

```powershell
python -m http.server 8000
```

3. Visit `http://localhost:8000` in your browser (or use HTTPS on a hosted server).

Usage
- Click **Start Tracking** and grant location permission. The app will watch position and store each update.
- Click **Stop Tracking** to stop the watch.
- Click **Export CSV** to download recorded points.
- Click **Clear Data** to remove stored points.

Privacy & Safety
- This app stores data locally only. If you want cloud sync, tell me which backend you prefer and I can add secure sync with authentication.
