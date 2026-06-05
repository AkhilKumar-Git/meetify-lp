# Meetify — Meeting Playlists & Competitive Scraper

Welcome to **Meetify**! This repository hosts the interactive landing page and workspace dashboard for organizing meeting recordings into smart, searchable playlists with synchronized AI transcripts and built-in competitive intelligence scrapers.

---

## 🚀 Current Architecture State

The project operates in **two configurations** depending on your dev environment:

1. **Static Mock Mode (No Setup)**: Open `index.html` or `dashboard.html` directly in your browser. All playback features, searching, and visual metric grids will function. The **Competitive Intelligence** tab runs on a high-fidelity local simulation (simulating Porsche 911 Carrera SWOT and pricing analyses) with no API keys required.
2. **Full Integration Mode (Express Proxy)**: A local Node.js server (`server.js`) serves static files and hosts reverse-proxy endpoints (`/api/scrape` and `/api/analyze`) to allow real-time scraping and OpenAI completions directly from the UI without CORS blocks.

---

## 📂 Project Structure

- **`index.html` / `app.js` / `styles.css`**: The core customer landing page, pricing plans, and the interactive meeting transcript player demo.
- **`dashboard.html` / `dashboard.js` / `dashboard.css`**: The workspace dashboard, styled with Meetify's obsidian/teal glass theme:
  - **Metrics Cards**: Dynamic tracking of transcription stats.
  - **Platform Distribution**: A sleek solid conic-gradient pie chart showing Zoom, Meet, and Teams usage metrics.
  - **Competitive Intelligence**: Tabbed workspace containing forms to scrape competitor pages and extract SWOT or specs reviews.
- **`server.js` / `package.json`**: An Express reverse-proxy server that handles secure API queries.

---

## 🛠️ How to Build & Run Locally

To unlock real-time scraping (via **Firecrawl**) and strategic prompt analyses (via **OpenAI**), follow these setup steps:

### 1. Prerequisites
Ensure you have **Node.js (v18+)** installed.

### 2. Install Dependencies
Run the following command inside the `meetify` folder to fetch package resources:
```bash
npm install
```

### 3. Run the Proxy Server
Launch the server:
```bash
npm start
```
This runs the application on **`http://localhost:8123`**.

### 4. Open the App
Go to **`http://localhost:8123/dashboard.html`** in your browser. Head to the **Intelligence** tab to enter your API keys and target URLs.

---

## ⚠️ Troubleshooting & API Restrictions

### 1. CORS Policy Blocks (Failed to Fetch)
* **The Error**: When querying Firecrawl or OpenAI directly from the browser (e.g. via localhost static servers), web browsers reject requests with a `CORS Preflight` blocker. OpenAI explicitly disables client-side CORS requests to prevent your secret API keys from being exposed in public client scripts.
* **The Solution**: Always ensure you run the Node backend proxy (`npm start`). The frontend will automatically detect the server and route queries through `/api/scrape` and `/api/analyze` securely.

### 2. Scraping Blocked by Anti-Bot Filters (e.g., Mercedes-Benz site)
* **The Issue**: High-profile luxury automotive sites (like `https://www.mercedes-benz.co.in/` or Tesla) utilize heavy anti-scraping firewalls (such as Cloudflare, Akamai, or Datadome). Scrapers like Firecrawl can occasionally trigger CAPTCHA challenges or receive `403 Forbidden` / `500` site error responses.
* **Best Practices**:
  - When testing real scraping, use URLs from sites with standard security, or configure your Firecrawl request to bypass bot limits (using advanced Firecrawl keys with proxy rotation).
  - Use our **Try Demo Simulation** option to quickly verify frontend rendering, markdown formatting, and OpenAI SWOT grids using high-quality mock datasets.
