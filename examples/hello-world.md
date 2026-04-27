---
title: Hello, world
date: 2026-04-25
type: writing
domain: tech
status: public
tags: [meta, loudly]
og:
  description: First post on Loudly — a self-hosted personal stream powered by a private GitHub vault.
---

This is Loudly — a personal publishing platform where a git push is the only publish mechanism.

## How it works

Content lives in a private GitHub repo called the vault. The `public` branch is what gets served. Pushing a markdown file with `status: public` in the frontmatter is all it takes to publish.

No CMS. No sync jobs. No database. Just files and git.

## Why

The big publishing platforms are good at distribution but bad at ownership. Everything here is a plain text file I control, versioned in git, readable without any tooling.

The stream treats short notes and long posts identically — same workflow, same schema, same feed. Type and domain tags do the filtering.

## What's next

- Connecting music to the stream
- Image and audio post types
- Feed endpoint
