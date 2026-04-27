# Loudly Web App

A minimal, open-source personal publishing platform built on Next.js. Your content lives in a GitHub repository and Loudly renders it.

## The idea

Most personal sites force you to commit to a CMS, a database, or a hosting platform that owns your content. Loudly takes a different approach: your writing lives in a plain-text GitHub repository that you control. The site is just a reader.

This separation means:

- **Your vault is portable.** Markdown files in Git are readable without any app, forever.
- **Publishing is a branch.** You decide what's public by controlling a branch (e.g. `public`). Drafts stay on other branches, never exposed.
- **No database, no CMS admin.** The GitHub API is the backend. There's nothing to maintain.
- **Private content stays private.** You can use a private repo — only posts with `status: public` in their frontmatter are rendered.

## How it works

Content is fetched at request time from the GitHub API (with 60-second ISR revalidation). The site reads markdown files from a configured repo/branch/path, parses frontmatter with gray-matter, and renders them. No build step is needed when you publish — just push to the public branch.

Configuration is a single file, `loudly.config.js` (gitignored — copy from `loudly.config.js.example`):

```js
export default {
  content: {
    repo: "your-username/your-vault",
    branch: "public",
    path: "/content",
  },
  site: {
    title: "Your Name",
    description: "Your description",
    url: "https://yoursite.com",
    defaultOgImage: "/og-default.png",
  },
};
```

## Content format

Each post is a markdown file with YAML frontmatter:

```markdown
---
title: My post
date: 2026-04-27
type: tech          # tech | art | music | personal
status: public      # only "public" posts are rendered
og:
  description: Optional OG description override
---

Your content here.
```

## Getting started

```bash
npm install
cp loudly.config.js.example loudly.config.js
# edit loudly.config.js with your repo and site details
```

Set your GitHub token (required for private repos, recommended to avoid rate limits):

```bash
cp .env.local.example .env.local
# add GITHUB_TOKEN=your_token
```

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy to [Vercel](https://vercel.com) and add `GITHUB_TOKEN` as an environment variable. No other infrastructure needed.
