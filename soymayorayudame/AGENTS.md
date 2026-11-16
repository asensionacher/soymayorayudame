# AGENTS.md

Guidelines for AI agents working in this repository.

## Project Overview

"Soy Mayor Ayúdame" is the website of a group of **volunteers** who help older people and
people with disabilities carry out their online procedures (trámites).

The site has two parts:

1. An explanation of who they are and what they can help with.
2. A form that, when submitted, sends the request to the volunteers' Telegram group.

There is **no database**. Data only travels to Telegram.

The accessibility of the site is **the main constraint**, not a nice-to-have. Any change that
reduces legibility or ease of use is a regression, even if it looks nicer.

## Build & Run Commands

```bash
npm run dev                  # Dev server at http://localhost:3000
npm run build                # Production build (includes TypeScript check)
npm run start                # Production server
npm run lint                 # ESLint (flat config, Next.js + TypeScript presets)
npm run typecheck            # tsc --noEmit
npm run verificar:texto      # Checks user-facing text for corrupted words
npm run verificar:contraste  # Checks colour contrast (WCAG AAA)
npm run verificar            # All of the above checks
```

No test framework is configured.

## Project Structure

```
src/
  app/
    page.tsx                  # Explanation of who we are + the form
    ayuda/page.tsx            # How it works, step by step
    privacidad/page.tsx       # What data is asked for and where it goes
    not-found.tsx
    api/solicitud/route.ts    # Receives the form, notifies Telegram
    icon.tsx                  # Generated favicon
    layout.tsx                # Metadata, initial theme, skip link
    sitemap.ts, robots.ts
  components/
    Cabecera.tsx              # Header with the accessibility controls
    Pie.tsx
    ControlesAccesibilidad.tsx  # Theme, font size, print button
    FormularioSolicitud.tsx   # The form
  lib/
    telegram.ts               # Sends the message to Telegram
    validacion.ts             # Zod schema for the form data
scripts/
  verificar-texto.mjs         # Detects corrupted text in user-facing strings
  verificar-contraste.mjs      # Computes WCAG contrast ratios
```

Path alias: `@/*` maps to `./src/*`.

## Environment Variables

```
TELEGRAM_API_KEY   Bot token (from @BotFather)
TELEGRAM_CHAT_ID   Target group id (starts with -100)
```

Both live in `.env`, which is gitignored. `.env.example` is committed and must stay in sync
with the variable names used in the code.

**Never commit `.env`** and never hardcode the token or the chat id in the source.

## The Form Flow

1. `FormularioSolicitud.tsx` does `POST /api/solicitud` with a JSON body.
2. `app/api/solicitud/route.ts` validates with Zod. On failure it returns `400` with a
   `{ errores: { campo: mensaje } }` map; the form renders each message next to its field
   and moves focus to the first invalid field.
3. On success, `lib/telegram.ts` calls the Telegram API and posts to the group.
4. If Telegram fails, the route returns `502` and the form shows a retry-friendly error.
   **The person's data is not stored anywhere**, so a failure loses it.

The message posted to the group is plain text, built by `construirMensaje()` in
`src/lib/telegram.ts`. Keep it plain — Telegram's Markdown parsing mangles accents.

## Accessibility Rules (non-negotiable)

1. **Font size.** The base is 19px (`--text-base`). The type scale is in `em` relative to the
   body font, so the "Letra" control scales everything at once. Never go below 16px.
2. **Contrast.** Every text/background pair must be **AAA (7:1)** in both themes. Run
   `npm run verificar:contraste` after changing any colour in `globals.css`.
3. **Touch targets.** Interactive elements are at least 44x44px (WCAG 2.2). Buttons use the
   `.boton` class (`min-height: 3.25rem`).
4. **Focus.** Never remove the focus outline. The global `:focus-visible` rule gives a 3px
   ring. It is the only way keyboard users can see where they are.
5. **Colour is never the only signal.** Links are always underlined. Status is conveyed with
   text or an icon, not colour alone.
6. **No decorative colour.** No emojis, no bright colours, no gradients. The only accent is
   the dark blue.
7. **Dark mode is a first-class mode.** Every colour is a token in `globals.css`, defined for
   both `:root` and `.dark`.
8. **Semantic HTML.** One `<h1>` per page, real `<nav>`, `<main>`, `<footer>`. A `<ul>` inside
   a `<p>` is invalid HTML and causes hydration errors.
9. **Every interactive element needs an accessible name.** Icon-only buttons need
   `aria-label`.
10. **Errors must be specific and next to the field.** "Revise los campos marcados" alone is
    not enough for someone who cannot see which field failed.
11. **The theme must be applied before first paint.** `src/app/layout.tsx` has an inline
    script that reads `localStorage` and sets the `dark` class, otherwise users see a white
    flash.

## Writing the Content

The site's voice matters: plain Spanish, short sentences, no jargon, no condescension. The
reader may be someone who has never used a form online.

Content rules:

- Explain every technical term the first time it appears.
- Be explicit that this is **voluntary work** and that nobody is paid.
- Say plainly that the volunteers **do not** act on the person's behalf: the user signs and
  accepts.
- Warn that they are **not an official service** and do not represent any public body.
- Say what they **cannot** help with (legal advice, medical questions, official
  certificates, managing money).
- Never ask for card numbers, PINs or bank credentials.

**Always run `npm run verificar:texto` after editing any user-facing text.** The script
detects the corruption that creeps in when writing long Spanish text by hand: words glued
together (`leLeave`, `DNIRenew`), stray English words, and misplaced capitals.

The script only reviews the files listed in `RUTAS_REVISADAS` inside it. If you add a new
component with user-facing text, add it to that list.

## Code Style

### Formatting

- **No semicolons** at end of statements.
- **Single quotes** for all strings in TS/TSX.
- **2-space indentation**.
- **Trailing commas** in multi-line objects, arrays, and function parameters.
- No Prettier configured — follow existing file conventions.

### Imports

Order (no blank lines between groups):
1. React directives (`'use client'` at very top if needed)
2. React built-ins (`useState`, `useEffect`, `useSyncExternalStore`)
3. Next.js (`next/link`, `next/image`, `next/font/google`)
4. Third-party
5. Internal via alias (`@/lib/...`, `@/components/...`)
6. Relative

Use `import type { ... }` for type-only imports.

### TypeScript

- Strict mode enabled. Do not weaken tsconfig settings.
- Define component props as `type Props = { ... }` inline in the same file.
- Use `React.ReactNode` (not `ReactNode`) for children types.
- Never use `React.FC`. Write plain functions: `export function Component({ ... }: Props)`.
- Use non-null assertion (`!`) only for environment variables.

### React Patterns

- Components are **server components by default**. Only add `'use client'` when the
  component needs hooks or event handlers.
- `localStorage` is external state. Read it with `useSyncExternalStore`, **not** with
  `useState` + `useEffect` — the latter triggers the `react-hooks/set-state-in-effect`
  lint error and causes cascading renders.
- Components that observe the scroll position use `IntersectionObserver`.

### Naming Conventions

| What | Convention | Examples |
|------|-----------|----------|
| React components (files) | PascalCase | `Cabecera.tsx`, `FormularioSolicitud.tsx` |
| Non-component files | camelCase | `telegram.ts`, `validacion.ts` |
| Component exports | Named PascalCase | `export function Cabecera()` |
| Page/layout exports | Default | `export default function PaginaInicio()` |
| Props types | `Props` (local) | `type Props = { ... }` |
| CSS custom props | kebab-case | `--color-primary`, `--tamano-letra` |
| CSS classes | Spanish, kebab-case | `.boton--primario`, `.solo-lectores` |

## Known TODOs

- **Domain.** `soymayorayudame.es` is a placeholder in `metadataBase`, `sitemap.ts` and
  `robots.ts`.
- **Contact email.** `contacto@soymayorayudame.es` is a placeholder on the home page, the
  privacy page and the footer.
- **Abuse prevention.** The endpoint has no rate limiting. Add a honeypot, a captcha or
  per-IP throttling if spam arrives.

## Before Committing

- [ ] `npm run verificar` passes (text, contrast, types, lint).
- [ ] `npm run build` succeeds.
- [ ] If you changed colours: `npm run verificar:contraste` still reports AAA.
- [ ] If you changed the type scale: check the layout at all three font sizes and on
      mobile — there must be no horizontal scroll.
- [ ] If you touched user-facing text: `npm run verificar:texto` is clean.
- [ ] If you touched the form: test it end to end, including the error path (send it empty
      and check that each field shows its own message and receives focus).
