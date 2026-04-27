# Loudly

Loudly is a personal stream. One feed, every content type — short notes, long writings, images, audio, video. No algorithm, no platform, no middle man. Just you, publishing loud.

## What you can publish

| Type | What it is | Analogue |
|------|-----------|----------|
| `note` | Short thoughts, links, quick observations | X / Twitter |
| `writing` | Essays, articles, long-form posts | Blog |
| `image` | Photos, artwork, visuals | Instagram |
| `audio` | Tracks, recordings, podcasts | SoundCloud |
| `video` | Clips, films, recordings | YouTube |

Everything lands in the same stream, in reverse chronological order. Domain tags (`tech`, `art`, `music`, `personal`) let readers filter to what they care about.

## How it works

Your content lives in a plain-text GitHub repository — the *vault* — that you fully own. Loudly reads it and renders the stream. The site is just a reader; the vault is the source of truth.

Content is fetched at request time from the GitHub API (with 60-second ISR revalidation). No build step is needed when you publish — push a file with `status: public` to the public branch and it appears in the stream.

## Why

Every publishing platform either owns your content or forces you into a single format. Loudly treats your vault as a first-class artifact: plain markdown files, versioned in git, readable without any tooling, forever.

- **One stream, every type.** Notes and essays and images coexist in the same feed rather than being spread across different platforms.
- **Publishing is a branch.** The `public` branch is what gets served. Drafts stay on other branches, never exposed.
- **No database, no CMS.** The GitHub API is the backend. There's nothing to maintain.
- **Private content stays private.** Use a private repo — only posts with `status: public` in their frontmatter are rendered.

## Content format

Each post is a markdown file with YAML frontmatter:

```markdown
---
title: My post          # optional for notes
date: 2026-04-27
type: writing           # note | writing | image | audio | video
domain: tech            # tech | art | music | personal
status: public          # only "public" posts appear in the stream
tags: [optional, tags]
cover: https://...      # image URL (image type)
url: https://...        # external media URL (audio/video type)
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

```js
// loudly.config.js
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

Then:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy

Deploy to [Vercel](https://vercel.com) and add `GITHUB_TOKEN` as an environment variable. No other infrastructure needed.
