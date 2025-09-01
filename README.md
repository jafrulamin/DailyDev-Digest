# DailyDev Digest

A simple web app that aggregates developer news from Hacker News, Dev.to, and Reddit programming communities. Built with Next.js 14 and Tailwind CSS.

## Features

- **Multi-source aggregation**: Combines articles from Hacker News, Dev.to, and Reddit
- **Filtering**: Filter by source or search by keyword
- **Save articles**: Save interesting articles locally (localStorage)
- **Export saved**: Export your saved articles to CSV
- **Top 10 digest**: View the most popular articles across all sources
- **Simple caching**: 5-minute cache to avoid spamming public APIs

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

- `GET /api/aggregate` - Get articles from all sources
- `GET /api/sources/hn` - Hacker News articles
- `GET /api/sources/devto` - Dev.to articles  
- `GET /api/sources/reddit` - Reddit programming articles

Query parameters:
- `query` - Search term
- `source` - Filter by source (hn, devto, reddit, all)
- `tag` - Filter Dev.to by tag

## Deployment

Deploy to Vercel with one click:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/yourusername/dailydev-digest)

## Demo

1. Browse the main feed to see articles from all sources
2. Use filters to focus on specific sources or search terms
3. Save interesting articles using the Save button
4. View your saved articles on the Saved page
5. Export saved articles to CSV for offline reading
6. Check the Digest page for top articles by popularity

## Tech Stack

- Next.js 14 (App Router)
- React 18
- Tailwind CSS
- JavaScript (no TypeScript)
- localStorage for persistence
- Public APIs (no authentication required)

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for development guidelines.
