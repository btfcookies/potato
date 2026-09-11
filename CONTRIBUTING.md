# Contributing to TAD Chat

Thanks for helping out. TAD Chat is a small project, so the process is light.

## Getting set up

1. Fork and clone the repo.
2. Install dependencies:
   ```
   npm install
   ```
3. Create a `.env` file in the project root with your Upstash Redis credentials:
   ```
   UPSTASH_REDIS_REST_URL=your-url
   UPSTASH_REDIS_REST_TOKEN=your-token
   ```
   You can make a free database at [upstash.com](https://upstash.com/).
4. Start the server:
   ```
   npm start
   ```
   The app runs at `http://localhost:3000`.

## Project layout

- `server.js` - Express backend and API routes (`/messages`, `/users`, `/ping`)
- `public/` - the frontend (`index.html`, `script.js`, `style.css`)

## Making changes

1. Create a branch:
   ```
   git checkout -b my-change
   ```
2. Keep changes focused and test them in the browser before committing.
3. Match the existing code style: 2-space indentation, `const`/`let`, small helper functions.
4. Write clear commit messages (`fix:`, `feat:`, `docs:`, etc.).

## Opening a pull request

1. Push your branch and open a PR against `main`.
2. Describe what changed and why, and how you tested it.
3. Link any related issue.

## Reporting bugs

Open an issue at https://github.com/btfcookies/potato/issues with steps to reproduce, what you expected, and what happened.
