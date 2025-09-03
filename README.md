# DailyDev Digest

A simple developer news aggregator that combines stories from Hacker News, Dev.to, and Reddit programming subreddits.

![DailyDev Digest Screenshot](public/og-image.png)

## Features

- View combined news feed from multiple developer sources
- Filter by source (HN, Dev.to, Reddit)
- Search by keyword
- Save articles locally (no account needed)
- Export saved items to CSV
- View a daily digest of top articles

## Running Locally

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `/api/aggregate` - Combined feed from all sources
  - Query params: `source` (all, hn, devto, reddit), `query`, `tag`
- `/api/sources/hn` - Hacker News articles
- `/api/sources/devto` - Dev.to articles
- `/api/sources/reddit` - Reddit programming posts

## Deploy

The easiest way to deploy is using Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyourusername%2Fdailydev-digest)

## 60-Second Demo

1. Open the app and browse the combined feed
2. Click a source filter to narrow down results
3. Search for a topic like "javascript" or "react"
4. Save a few interesting articles
5. Visit the Saved page to see your collection
6. Export your saved items to CSV
7. Check out the Digest page for top trending stories