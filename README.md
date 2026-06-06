# A More Perfect Union — Special Election Edition

Two deliverables for the *Special Election Edition* newsletter:

| File / dir | What it is |
|------------|-----------|
| **`index.html` + `src/`** | The **web page** — a React + Vite app. Animated gradient hero, scroll reveals, the Common Questions accordion, and the social **Question of the Day** quiz. |
| **`email.html`** | The **Mailchimp email** — clean summary version. Plain table-based HTML with inline styles so it pastes straight into Mailchimp. (Not part of the React build — email clients can't run JS/React.) |
| **`assets/`** | Brand images used by the email. |
| **`public/assets/`** | The same images, served by the Vite app at `/assets/…`. |

## Running the web page locally

```bash
npm install      # first time only
npm run dev      # starts the dev server and opens it in your browser
```

Vite prints a local URL (usually <http://localhost:5173>; it picks the next free port if that's taken). Edits hot-reload instantly.

To preview the quiz exactly as the email links to it, open the dev URL with `#play` on the end — e.g. `http://localhost:5173/#play` — and the quiz dialog auto-opens.

### Production build

```bash
npm run build    # outputs static files to dist/
npm run preview  # serves the built dist/ to sanity-check it
```

Deploy the contents of `dist/` to any static host (Netlify, Vercel, GitHub Pages, S3, …).

## Previewing the email

Open `email.html` directly in a browser, or paste its source into Mailchimp. Its "read more" links point at `index.html#…` (relative), so once the built site and the email live on the same host, every link lands on the matching section. Before sending, swap those for the site's hosted URL.

## Project layout

```
src/
  main.jsx            React entry
  App.jsx             composes the page + quiz dialog
  styles.css          the full design system (ported 1:1 from the prototype)
  hooks/useReveal.js  IntersectionObserver scroll-in animation
  components/         Reveal, ScrollProgress, QuizDialog
  lib/quiz.js         questions, localStorage stats, share helpers
  sections/           Hero, Letter, Toc, Feature, Resources, Events,
                      Spotlight, Happenings, Faq, Game, Footer
```
